const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const toBoolean = (value) => value === true || value === 'true';

const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 4000),
    clientOrigin: process.env.CLIENT_ORIGIN || '*',
    mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/caltec',
    jwtAccessSecret:
        process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me',
    jwtRefreshSecret:
        process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    codePepper: process.env.CODE_PEPPER || 'dev-code-pepper-change-me',
    smtp: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: toBoolean(process.env.SMTP_SECURE),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.SMTP_FROM || 'Caltec <no-reply@caltec.local>',
    },
    adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL,
    expoAccessToken: process.env.EXPO_ACCESS_TOKEN || '',
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        folder: process.env.CLOUDINARY_FOLDER || 'caltec/profile-images',
    },
    adminEmail: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
};

module.exports = env;
