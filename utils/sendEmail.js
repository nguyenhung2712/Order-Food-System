const nodemailer = require("nodemailer");

const config = require(__dirname + "/../config/config.json")["email"];

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: config.service,
            port: 587,
            secure: true,
            auth: {
                user: config.user,
                pass: config.password,
            },
        });

        await transporter.sendMail({
            from: config.user,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;