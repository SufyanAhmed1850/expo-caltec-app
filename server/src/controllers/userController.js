const { z } = require('zod');

const AppError = require('../utils/AppError');
const toPublicUser = require('../utils/publicUser');
const { normalizeName } = require('../utils/normalize');
const PushToken = require('../models/PushToken');
const User = require('../models/User');
const { uploadProfileImage } = require('../services/cloudinaryService');

const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().trim().min(2, 'Name is required.'),
        companyName: z.string().trim().min(1, 'Company name is required.'),
        designation: z.string().trim().min(1, 'Designation is required.'),
        phone: z.string().trim().min(1, 'Phone number is required.'),
    }),
});

const updateSettingsSchema = z.object({
    body: z.object({
        notificationsPaused: z.boolean().optional(),
        themePreference: z.enum(['system', 'light', 'dark']).optional(),
    }),
});

const pushTokenSchema = z.object({
    body: z.object({
        token: z.string().trim().min(20, 'Push token is required.'),
        platform: z.enum(['android', 'ios']).optional(),
        deviceName: z.string().trim().max(120).optional(),
    }),
});

const getMe = async (req, res) => {
    res.json({
        success: true,
        user: toPublicUser(req.user),
    });
};

const updateMe = async (req, res) => {
    const { name, companyName, designation, phone } = req.validated.body;

    req.user.set({
        name: normalizeName(name),
        companyName,
        designation,
        phone,
    });

    if (req.file) {
        const avatar = await uploadProfileImage(req.file, req.user._id.toString());
        req.user.avatar = avatar;
        req.user.profileImage = avatar.url;
    }

    await req.user.save();

    res.json({
        success: true,
        user: toPublicUser(req.user),
        message: 'Profile updated successfully.',
    });
};

const updateSettings = async (req, res) => {
    const { notificationsPaused, themePreference } = req.validated.body;

    if (typeof notificationsPaused === 'boolean') {
        req.user.notificationsPaused = notificationsPaused;
    }

    if (themePreference) {
        req.user.themePreference = themePreference;
    }

    await req.user.save();

    res.json({
        success: true,
        user: toPublicUser(req.user),
        message: 'Settings updated successfully.',
    });
};

const registerPushToken = async (req, res) => {
    const token = req.validated.body.token.trim();
    const platform = req.validated.body.platform || 'android';
    const deviceName = req.validated.body.deviceName || '';

    await PushToken.findOneAndUpdate(
        { token },
        {
            user: req.user._id,
            token,
            platform,
            deviceName,
            lastRegisteredAt: new Date(),
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        }
    );

    res.json({
        success: true,
        message: 'Push token registered successfully.',
    });
};

const removePushToken = async (req, res) => {
    const token = req.validated.body.token.trim();

    await PushToken.deleteOne({
        token,
        user: req.user._id,
    });

    res.json({
        success: true,
        message: 'Push token removed successfully.',
    });
};

const listUsers = async (req, res) => {
    if (req.user.role !== 'admin') {
        throw new AppError('Admin access required.', 403, 'ADMIN_REQUIRED');
    }

    const users = await User.find({ _id: { $ne: req.user._id } })
        .sort({ createdAt: -1 })
        .lean();

    res.json({
        success: true,
        users: users.map(toPublicUser),
    });
};

module.exports = {
    getMe,
    listUsers,
    pushTokenSchema,
    registerPushToken,
    removePushToken,
    updateMe,
    updateProfileSchema,
    updateSettings,
    updateSettingsSchema,
};
