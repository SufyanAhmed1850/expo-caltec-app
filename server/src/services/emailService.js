const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter;
const lastSentCodes = new Map();

const hasSmtpConfig = () =>
    Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);

const getTransporter = () => {
    if (!hasSmtpConfig()) {
        return null;
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: env.smtp.host,
            port: env.smtp.port,
            secure: env.smtp.secure,
            auth: {
                user: env.smtp.user,
                pass: env.smtp.pass,
            },
        });
    }

    return transporter;
};

const sendMail = async ({ to, subject, text, html }) => {
    const activeTransporter = getTransporter();

    if (!activeTransporter) {
        console.log(`[email skipped] ${subject} -> ${to}\n${text}`);
        return;
    }

    await activeTransporter.sendMail({
        from: env.smtp.from,
        to,
        subject,
        text,
        html,
    });
};

const rememberCodeForTests = (email, purpose, code) => {
    if (env.nodeEnv === 'test') {
        lastSentCodes.set(`${purpose}:${email}`, code);
    }
};

const sendVerificationCode = async (user, code) => {
    rememberCodeForTests(user.email, 'verify', code);
    await sendMail({
        to: user.email,
        subject: 'Verify your Caltec account',
        text: `Your Caltec verification code is ${code}. It expires in 15 minutes.`,
        html: `<p>Your Caltec verification code is <strong>${code}</strong>.</p><p>It expires in 15 minutes.</p>`,
    });
};

const sendPasswordResetCode = async (user, code) => {
    rememberCodeForTests(user.email, 'reset', code);
    await sendMail({
        to: user.email,
        subject: 'Reset your Caltec password',
        text: `Your Caltec password reset code is ${code}. It expires in 15 minutes.`,
        html: `<p>Your Caltec password reset code is <strong>${code}</strong>.</p><p>It expires in 15 minutes.</p>`,
    });
};

const sendEnquiryNotification = async (enquiry) => {
    if (!env.adminNotificationEmail) {
        return;
    }

    await sendMail({
        to: env.adminNotificationEmail,
        subject: `New enquiry ${enquiry.enquiryNumber}`,
        text: `A new enquiry ${enquiry.enquiryNumber} was submitted by ${enquiry.userName} for ${enquiry.companyName}.`,
        html: `<p>A new enquiry <strong>${enquiry.enquiryNumber}</strong> was submitted by ${enquiry.userName} for ${enquiry.companyName}.</p>`,
    });
};

const getLastSentCode = (email, purpose) =>
    lastSentCodes.get(`${purpose}:${email}`);

module.exports = {
    getLastSentCode,
    sendEnquiryNotification,
    sendPasswordResetCode,
    sendVerificationCode,
};
