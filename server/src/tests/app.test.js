process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.CODE_PEPPER = 'test-code-pepper';

const argon2 = require('argon2');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

const createApp = require('../app/createApp');
const { connectDatabase, disconnectDatabase } = require('../config/database');
const PushToken = require('../models/PushToken');
const User = require('../models/User');
const Service = require('../models/Service');
const Counter = require('../models/Counter');
const { getLastSentCode } = require('../services/emailService');

let mongoServer;
let app;

const registerAndVerify = async (
    email = 'user@example.com',
    password = 'Password1!'
) => {
    await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email, password })
        .expect(201);

    const code = getLastSentCode(email, 'verify');
    const verifyResponse = await request(app)
        .post('/api/auth/verify-email')
        .send({ email, code })
        .expect(200);

    return verifyResponse.body;
};

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectDatabase(mongoServer.getUri());
    app = createApp();
});

afterAll(async () => {
    await disconnectDatabase();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Promise.all([
        PushToken.deleteMany({}),
        User.deleteMany({}),
        Service.deleteMany({}),
        Counter.deleteMany({}),
    ]);
});

describe('auth API', () => {
    it('registers, verifies, logs in, refreshes, and logs out a user', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'New User',
                email: 'new@example.com',
                password: 'Password1!',
            })
            .expect(201);

        const unverifiedLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: 'new@example.com', password: 'Password1!' })
            .expect(200);
        expect(unverifiedLogin.body.authStatus).toBe('unverified');

        const code = getLastSentCode('new@example.com', 'verify');
        const verified = await request(app)
            .post('/api/auth/verify-email')
            .send({ email: 'new@example.com', code })
            .expect(200);
        expect(verified.body.authStatus).toBe('authenticated');
        expect(verified.body.tokens.accessToken).toBeTruthy();

        const refreshed = await request(app)
            .post('/api/auth/refresh')
            .send({ refreshToken: verified.body.tokens.refreshToken })
            .expect(200);
        expect(refreshed.body.tokens.accessToken).toBeTruthy();

        await request(app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${refreshed.body.tokens.accessToken}`)
            .send({ refreshToken: refreshed.body.tokens.refreshToken })
            .expect(200);
    });

    it('updates persisted user settings', async () => {
        const session = await registerAndVerify('settings@example.com');

        const response = await request(app)
            .patch('/api/users/me/settings')
            .set('Authorization', `Bearer ${session.tokens.accessToken}`)
            .send({ notificationsPaused: true, themePreference: 'dark' })
            .expect(200);

        expect(response.body.user.notificationsPaused).toBe(true);
        expect(response.body.user.themePreference).toBe('dark');
    });

    it('stores push tokens in a separate collection and reassigns duplicates', async () => {
        const firstSession = await registerAndVerify('device-a@example.com');
        const secondSession = await registerAndVerify('device-b@example.com');
        const sharedToken = 'ExponentPushToken[abcdefghijklmnopqrstuvwx1234567890]';

        await request(app)
            .post('/api/users/me/push-tokens')
            .set('Authorization', `Bearer ${firstSession.tokens.accessToken}`)
            .send({
                token: sharedToken,
                platform: 'android',
                deviceName: 'Pixel 10 Pro XL',
            })
            .expect(200);

        let storedToken = await PushToken.findOne({ token: sharedToken });
        expect(storedToken).toBeTruthy();
        expect(storedToken.deviceName).toBe('Pixel 10 Pro XL');

        await request(app)
            .post('/api/users/me/push-tokens')
            .set('Authorization', `Bearer ${secondSession.tokens.accessToken}`)
            .send({
                token: sharedToken,
                platform: 'android',
                deviceName: 'Galaxy S24',
            })
            .expect(200);

        const tokenCount = await PushToken.countDocuments({ token: sharedToken });
        expect(tokenCount).toBe(1);

        storedToken = await PushToken.findOne({ token: sharedToken });
        const secondUser = await User.findOne({ email: 'device-b@example.com' });
        expect(storedToken.user.toString()).toBe(secondUser._id.toString());
        expect(storedToken.deviceName).toBe('Galaxy S24');

        await request(app)
            .delete('/api/users/me/push-tokens')
            .set('Authorization', `Bearer ${secondSession.tokens.accessToken}`)
            .send({ token: sharedToken })
            .expect(200);

        const deletedToken = await PushToken.findOne({ token: sharedToken });
        expect(deletedToken).toBeNull();
    }, 15000);

    it('sends and accepts a password reset code', async () => {
        await registerAndVerify('reset@example.com');

        await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: 'reset@example.com' })
            .expect(200);

        const code = getLastSentCode('reset@example.com', 'reset');
        await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: 'reset@example.com' })
            .expect(200);
        expect(getLastSentCode('reset@example.com', 'reset')).toBe(code);

        await request(app)
            .post('/api/auth/verify-reset-code')
            .send({ email: 'reset@example.com', code })
            .expect(200);

        await request(app)
            .post('/api/auth/verify-reset-code')
            .send({ email: 'reset@example.com', code: '000000' })
            .expect(400);

        await request(app)
            .post('/api/auth/reset-password')
            .send({
                email: 'reset@example.com',
                code,
                password: 'NewPassword1!',
            })
            .expect(200);

        await request(app)
            .post('/api/auth/login')
            .send({ email: 'reset@example.com', password: 'NewPassword1!' })
            .expect(200);
    }, 10000);
});

describe('service and enquiry API', () => {
    it('protects admin service writes and creates user enquiries with atomic numbers', async () => {
        const userSession = await registerAndVerify('customer@example.com');
        const userToken = userSession.tokens.accessToken;

        await request(app)
            .post('/api/services')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                category: 'Pressure Calibration',
                name: 'Pressure Gauge',
                price: 5000,
            })
            .expect(403);

        const admin = await User.create({
            name: 'Admin',
            email: 'admin@example.com',
            passwordHash: await argon2.hash('Password1!'),
            role: 'admin',
            emailVerified: true,
        });
        const adminLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: admin.email, password: 'Password1!' })
            .expect(200);

        await request(app)
            .post('/api/services')
            .set('Authorization', `Bearer ${adminLogin.body.tokens.accessToken}`)
            .send({
                category: 'Pressure Calibration',
                name: 'Pressure Gauge',
                price: 5000,
            })
            .expect(201);

        await request(app)
            .patch('/api/users/me')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Test User',
                companyName: 'Caltec Customer',
                designation: 'Manager',
                phone: '123456789',
            })
            .expect(200);

        const persistedUser = await User.findOne({ email: 'customer@example.com' });
        expect(persistedUser.designation).toBe('Manager');
        expect(persistedUser.profileCompleted).toBe(true);

        const enquiryResponse = await request(app)
            .post('/api/enquiries')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                companyName: 'Caltec Customer',
                address: 'Karachi',
                contactPerson: 'Test User',
                designation: 'Manager',
                phone: '123456789',
                fax: 'N/A',
                email: 'customer@example.com',
                placeOfCalibration: 'Site',
                instruments: [{ name: 'Pressure Gauge', quantity: 2 }],
                comments: '',
                discountPercentage: '',
            })
            .expect(201);

        expect(enquiryResponse.body.enquiryNumber).toBe('CIS-000001');
        expect(enquiryResponse.body.enquiry.totalAmount).toBe(10000);
    });

    it('requires designation before marking a profile complete', async () => {
        const userSession = await registerAndVerify('missing-role@example.com');
        const userToken = userSession.tokens.accessToken;

        await request(app)
            .patch('/api/users/me')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Test User',
                companyName: 'Caltec Customer',
                designation: '',
                phone: '123456789',
            })
            .expect(400);

        const user = await User.findOne({ email: 'missing-role@example.com' });
        expect(user.designation).toBe('');
        expect(user.profileCompleted).toBe(false);
    });
});
