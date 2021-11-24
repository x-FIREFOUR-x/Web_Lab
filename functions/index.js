const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const sanitizeHtml = require("sanitize-html");

const secretMailData = functions.config().secretemail;
let transporter = null;

if (secretMailData) {
  transporter = nodemailer.createTransport({
    host: secretMailData.host,
    port: secretMailData.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: secretMailData.mail, // generated ethereal user
      pass: secretMailData.password, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

const rateLimit = {
  ipNumberCalls: 3,
  timeSeconds: 30,
  ipData: new Map(),
};

exports.sendmail = functions.https.onRequest((req, res) => {
  if (!transporter) {
    functions.logger.log("Secretemail is undefined");
    return res.status(500).json({code: "500",
      error: "Mail name and pass are undefined"});
  }

  const currentTime = new Date();

  const currentIp = req.headers["fastly-client-ip"];
  const currentIpUser = rateLimit.ipData.get(currentIp) ??
  {count: 0,
    time: currentTime - (rateLimit.timeSeconds + 1)*1000,
  };


  functions.logger.log(currentIpUser.count);
  functions.logger.log(currentTime - currentIpUser.time);

  if ((currentIpUser.count + 1 > rateLimit.ipNumberCalls) ||
            (currentTime - currentIpUser.time <= rateLimit.timeSeconds*1000)) {
    return res.status(429)
        .json({code: "429", error: "Too many sends!"});
  }
  currentIpUser.count++;
  currentIpUser.time = new Date();
  rateLimit.ipData.set(currentIp, currentIpUser);

  if (!Object.keys(req.body ?? {}).length) {
    return res.status(400).json({code: "400", error: "no data passed to api"});
  }

  const lines = Object.entries(req.body)
      .map(([key, val]) => `<p><b>${key}: </b>${val}</p>`)
      .join("\n");

  const html = sanitizeHtml(`<h2> Message from  form: </h2>${lines}`);

  const mailOptions = {
    from: `Contact form <${secretMailData.mail}>`,
    to: secretMailData.to,
    subject: "Hi, nice form!!!",
    html: html,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Error sending mail", error.message);
      return res.status(500).json({code: "500", error: error.message});
    }
    return res.status(200).json({data: "ok"});
  });
});
