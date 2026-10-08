const mongoose = require('mongoose');

const pushTokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        token: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true,
        },
        platform: {
            type: String,
            enum: ['android', 'ios'],
            default: 'android',
            index: true,
        },
        deviceName: {
            type: String,
            default: '',
            trim: true,
            maxlength: 120,
        },
        lastRegisteredAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
        lastDeliveredAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

pushTokenSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('PushToken', pushTokenSchema);
