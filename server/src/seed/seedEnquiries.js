const { connectDatabase, disconnectDatabase } = require('../config/database');
const Enquiry = require('../models/Enquiry');
const Service = require('../models/Service');
const User = require('../models/User');
const { getNextEnquiryNumber } = require('../services/enquiryNumberService');

const SEED_MARKER = '[seed:demo-enquiry]';

const SAMPLE_ADDRESSES = [
    'Plot 24, Korangi Industrial Area, Karachi',
    'Main Boulevard, Gulberg Industrial Estate, Lahore',
    'Sector I-9 Industrial Area, Islamabad',
    'S.I.T.E Area, Hyderabad',
    'Industrial Estate, Multan',
];

const SAMPLE_DESIGNATIONS = [
    'Maintenance Manager',
    'Quality Engineer',
    'Plant Supervisor',
    'Instrumentation Lead',
    'Operations Coordinator',
];

const SAMPLE_COMMENTS = [
    'Please include calibration certificate details with the quotation.',
    'Site visit preferred during working hours.',
    'Kindly confirm earliest available calibration slot.',
    'Urgent requirement for audit preparation.',
    'Please share quotation with service timeline.',
];

const STATUSES = ['Pending', 'Approved', 'Declined'];
const PLACES = ['Site', 'Lab', 'Both'];

const pick = (items, index) => items[index % items.length];

const buildInstrumentLines = (services, userIndex, enquiryIndex) => {
    const count = enquiryIndex % 2 === 0 ? 2 : 3;
    const selectedServices = Array.from({ length: count }, (_, index) => {
        const serviceIndex = (userIndex * 5 + enquiryIndex * 3 + index) % services.length;
        return services[serviceIndex];
    });
    const discountPercentage = enquiryIndex % 3 === 1 ? 7.5 : null;

    let totalAmount = 0;
    let customTotal = 0;
    const instruments = selectedServices.map((service, index) => {
        const quantity = ((userIndex + enquiryIndex + index) % 3) + 1;
        const price = Number(service.price) || 0;
        const customPrice =
            discountPercentage == null && index === 1
                ? Math.max(price - Math.round(price * 0.08), 0)
                : null;
        const selectedPrice =
            discountPercentage != null ? price : customPrice || price;
        const totalPrice = selectedPrice * quantity;

        totalAmount += price * quantity;
        customTotal += totalPrice;

        return {
            service: service._id,
            name: service.name,
            quantity,
            price,
            customPrice,
            totalPrice,
            currency: service.currency || 'PKR',
        };
    });

    const discountedAmount =
        discountPercentage != null
            ? totalAmount - (totalAmount * discountPercentage) / 100
            : customTotal;

    return {
        discountPercentage,
        discountedAmount,
        instruments,
        totalAmount,
    };
};

const buildEnquiryDoc = async ({ user, userIndex, enquiryIndex, services }) => {
    const pricing = buildInstrumentLines(services, userIndex, enquiryIndex);
    const enquiryNumber = await getNextEnquiryNumber();
    const createdAt = new Date(
        Date.now() - (userIndex * 3 + enquiryIndex + 1) * 24 * 60 * 60 * 1000
    );
    const seedId = `${SEED_MARKER}:${user._id}:${enquiryIndex}`;

    return {
        enquiryNumber,
        user: user._id,
        userName: user.name,
        companyName:
            user.companyName ||
            `${user.name.split(' ')[0] || 'Caltec'} Industries`,
        address: pick(SAMPLE_ADDRESSES, userIndex + enquiryIndex),
        contactPerson: user.name,
        designation: pick(SAMPLE_DESIGNATIONS, userIndex + enquiryIndex),
        phone: user.phone || `03${String(100000000 + userIndex * 9321).slice(0, 9)}`,
        fax: enquiryIndex % 2 === 0 ? 'N/A' : '',
        email: user.email,
        placeOfCalibration: pick(PLACES, userIndex + enquiryIndex),
        instruments: pricing.instruments,
        comments: `${pick(SAMPLE_COMMENTS, userIndex + enquiryIndex)} ${seedId}`,
        totalAmount: pricing.totalAmount,
        discountPercentage: pricing.discountPercentage,
        discountedAmount: pricing.discountedAmount,
        status: pick(STATUSES, userIndex + enquiryIndex),
        isSeen: enquiryIndex % 2 === 0,
        createdAt,
        updatedAt: createdAt,
    };
};

const seedEnquiries = async () => {
    const [users, services] = await Promise.all([
        User.find({ emailVerified: true }).sort({ createdAt: 1 }).lean(),
        Service.find({ isActive: true }).sort({ category: 1, name: 1 }).lean(),
    ]);

    if (users.length === 0) {
        throw new Error('No verified users found. Create/verify users first.');
    }

    if (services.length < 3) {
        throw new Error('Not enough active services found. Run npm run seed:services first.');
    }

    const existingSeedCount = await Enquiry.countDocuments({
        comments: { $regex: '\\[seed:demo-enquiry\\]' },
    });

    if (existingSeedCount > 0) {
        console.log(`Demo enquiries already exist (${existingSeedCount}). Skipping.`);
        return;
    }

    const docs = [];
    const targetUsers = users.slice(0, 8);

    for (const [userIndex, user] of targetUsers.entries()) {
        const enquiriesForUser = user.role === 'admin' ? 1 : 2;

        for (let enquiryIndex = 0; enquiryIndex < enquiriesForUser; enquiryIndex += 1) {
            docs.push(
                await buildEnquiryDoc({
                    user,
                    userIndex,
                    enquiryIndex,
                    services,
                })
            );
        }
    }

    await Enquiry.insertMany(docs, { ordered: true });
    console.log(`Seeded ${docs.length} demo enquiries for ${targetUsers.length} users.`);
};

if (require.main === module) {
    connectDatabase()
        .then(seedEnquiries)
        .then(disconnectDatabase)
        .catch(async (error) => {
            console.error('Failed to seed demo enquiries:', error);
            await disconnectDatabase();
            process.exit(1);
        });
}

module.exports = seedEnquiries;
