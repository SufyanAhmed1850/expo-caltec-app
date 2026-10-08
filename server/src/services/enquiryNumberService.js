const Counter = require('../models/Counter');

const getNextEnquiryNumber = async () => {
    const counter = await Counter.findOneAndUpdate(
        { key: 'enquiry' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    return `CIS-${String(counter.seq).padStart(6, '0')}`;
};

module.exports = {
    getNextEnquiryNumber,
};
