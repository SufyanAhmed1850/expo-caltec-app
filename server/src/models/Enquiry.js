const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema(
    {
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        name: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        customPrice: { type: Number, default: null, min: 0 },
        totalPrice: { type: Number, required: true, min: 0 },
        currency: { type: String, default: 'PKR' },
    },
    { _id: false }
);

const enquirySchema = new mongoose.Schema(
    {
        enquiryNumber: { type: String, required: true, unique: true, index: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        userName: { type: String, required: true, trim: true },
        companyName: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        contactPerson: { type: String, required: true, trim: true },
        designation: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        fax: { type: String, default: '', trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        placeOfCalibration: {
            type: String,
            enum: ['Site', 'Lab', 'Both'],
            default: 'Site',
        },
        instruments: { type: [instrumentSchema], required: true },
        comments: { type: String, default: '', trim: true },
        totalAmount: { type: Number, required: true, min: 0 },
        discountPercentage: { type: Number, default: null, min: 0, max: 100 },
        discountedAmount: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Declined'],
            default: 'Pending',
            index: true,
        },
        isSeen: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
