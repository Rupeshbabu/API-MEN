// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }

        //Active in gmail "less secure app" options
    });

    // 2. Define the email options
    const mailOptions = {
        from : 'Rupesh <nrupesh08@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
    }
    // 3. Actually send the email

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;