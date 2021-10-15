const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const sanitizeHtml = require("sanitize-html");
const mail = "";
const password = "";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: mail, // generated ethereal user
        pass: password, // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.sendmail = functions.https.onRequest((req, res) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    res.send("Hello from Firebase!");
    if (!Object.keys(req.body ?? {}).length) {   // if(Object.keys(req.body?.data ?? {}).length)
        return res.status(400).json({code: "400", error: "no data passed to api"});
    }
    console.log(req.body);
    const lines = Object.entries(req.body)
        .map(([key, val]) => `<p><b>${key}: </b>${val}</p>`)
        .join("\n");

    const html = sanitizeHtml(`<h2> Message from  form: </h2>${lines}`);

    const mailOptions = {

        from: `Contact form <${mail}>`,
        to: "",
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