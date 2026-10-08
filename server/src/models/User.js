const mongoose = require('mongoose');

const tokenHashSchema = new mongoose.Schema(
    {
        hash: { type: String, required: true },
        expiresAt: { type: Date, required: true },
    },
    { _id: false, timestamps: { createdAt: true, updatedAt: false } }
);

const avatarSchema = new mongoose.Schema(
    {
        url: { type: String, default: null },
        publicId: { type: String, default: null },
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        passwordHash: { type: String, required: true },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
            index: true,
        },
        emailVerified: { type: Boolean, default: false, index: true },
        profileCompleted: { type: Boolean, default: false },
        companyName: { type: String, default: '', trim: true },
        designation: { type: String, default: '', trim: true },
        phone: { type: String, default: '', trim: true },
        profileImage: { type: String, default: null },
        avatar: { type: avatarSchema, default: () => ({}) },
        notificationsPaused: { type: Boolean, default: false },
        themePreference: {
            type: String,
            enum: ['system', 'light', 'dark'],
            default: 'system',
        },
        verificationCodeHash: { type: String, default: null },
        verificationCodeExpiresAt: { type: Date, default: null },
        resetPasswordCodeHash: { type: String, default: null },
        resetPasswordCodeExpiresAt: { type: Date, default: null },
        resetPasswordCodeSentAt: { type: Date, default: null },
        refreshTokenHashes: { type: [tokenHashSchema], default: [] },
    },
    { timestamps: true }
);

userSchema.methods.isProfileComplete = function isProfileComplete() {
    return Boolean(
        this.companyName?.trim() &&
            this.designation?.trim() &&
            this.phone?.trim()
    );
};

userSchema.pre('save', function syncProfileCompleted(next) {
    this.profileCompleted = this.isProfileComplete();
    next();
});

module.exports = mongoose.model('User', userSchema);
