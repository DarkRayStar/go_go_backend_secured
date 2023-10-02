const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
    try {
        //creating a transporter using nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        //Adding email
        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });
    }
    catch (error) {
        return error;
    }
}