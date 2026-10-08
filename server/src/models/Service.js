const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
    {
        category: { type: String, required: true, trim: true, index: true },
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        currency: { type: String, default: 'PKR', trim: true },
        isActive: { type: Boolean, default: true, index: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

serviceSchema.index(
    { category: 1, name: 1 },
    { unique: true, partialFilterExpression: { isActive: true } }
);

module.exports = mongoose.model('Service', serviceSchema);
