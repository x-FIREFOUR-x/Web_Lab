const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const sanitizeHtml = require("sanitize-html");
const mail = functions.config().secretemail.mail;
const password = functions.config().secretemail.password;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: mail, // generated ethereal user
    pass: password, // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const rateLimit = {
  ipNumberCalls: 3,
  timeSeconds: 30,
  ipData: new Map(),
};

exports.sendmail = functions.https.onRequest((req, res) => {
  const currentIp = req.headers["fastly-client-ip"];
  let currentIpUser = {};
  const currentTime = new Date();

  if (rateLimit.ipData.get(currentIp) == undefined) {
    rateLimit.ipData.set(currentIp, {count: 1, time: currentTime});
  } else {
    currentIpUser = rateLimit.ipData.get(currentIp);
    currentIpUser.count+=1;
    rateLimit.ipData.set(currentIp, currentIpUser);
    if ((currentIpUser.count > rateLimit.ipNumberCalls) ||
            (currentTime - currentIpUser.time <= rateLimit.timeSeconds*1000)) {
      return res.status(429)
          .json({code: "429", error: "Too many sends!"});
    }
  }
  currentIpUser = rateLimit.ipData.get(currentIp);
  currentIpUser.time = new Date();
  rateLimit.ipData.set(currentIp, currentIpUser);


  functions.logger.info("Hello logs!", {structuredData: true});
  res.send("Hello from Firebase!");
  if (!Object.keys(req.body ? req.body : {} === req.body ?? {})) {
    return res.status(400).json({code: "400", error: "no data passed to api"});
  }

  const lines = Object.entries(req.body)
      .map(([key, val]) => `<p><b>${key}: </b>${val}</p>`)
      .join("\n");

  const html = sanitizeHtml(`<h2> Message from  form: </h2>${lines}`);

  const mailOptions = {

    from: `Contact form <${mail}>`,
    to: "olexandrpasalsky@gmail.com",
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
