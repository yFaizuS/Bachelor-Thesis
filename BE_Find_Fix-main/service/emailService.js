const nodemailer = require('nodemailer');
const UserModel = require('../models/user');

const transporter = nodemailer.createTransport({
    host: "",
    port: 2525,
    auth: {
        user: "",
        pass: ""
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'your-email@example.com', // Sender address
        to: to, // List of recipients
        subject: subject, // Subject line
        text: text, // Plain text body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Failed to send email:", error);
    }
};
const sendEmailToAllAdmin = async (subject, text) => {
    let admins = await UserModel.getAdminUsers();
    const emails = admins.map(admin => admin.email); // Extract emails from user data

    // You might want to limit the number of emails sent in a single batch
    for (const email of emails) {
        const mailOptions = {
            from: 'your-email@example.com', // Sender address
            to: email, // List of recipients
            subject: subject, // Subject line
            text: text, // Plain text body
        };
        await transporter.sendMail(mailOptions);
    }
};


module.exports = { sendEmail,sendEmailToAllAdmin };