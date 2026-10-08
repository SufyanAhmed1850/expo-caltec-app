const { z } = require('zod');

const AppError = require('../utils/AppError');
const Enquiry = require('../models/Enquiry');
const Service = require('../models/Service');
const { getNextEnquiryNumber } = require('../services/enquiryNumberService');
const { sendEnquiryNotification } = require('../services/emailService');
const {
    sendPushNotificationToUser,
    sendPushNotificationsToAdmins,
} = require('../services/pushNotificationService');
const { emitToAdmins, emitToUser } = require('../sockets/socketHub');

const instrumentInputSchema = z.object({
    name: z.string().min(1, 'Instrument name is required.'),
    quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1.'),
    customPrice: z.union([z.coerce.number().min(0), z.literal(''), z.null()]).optional(),
});

const createEnquirySchema = z.object({
    body: z.object({
        companyName: z.string().min(1, 'Company name is required.'),
        address: z.string().min(1, 'Address is required.'),
        contactPerson: z.string().min(1, 'Contact person is required.'),
        designation: z.string().min(1, 'Designation is required.'),
        phone: z.string().min(1, 'Phone is required.'),
        fax: z.string().optional().default(''),
        email: z.string().email('Enter a valid email address.'),
        placeOfCalibration: z.enum(['Site', 'Lab', 'Both']).default('Site'),
        instruments: z.array(instrumentInputSchema).min(1),
        comments: z.string().optional().default(''),
        discountPercentage: z.union([z.coerce.number().min(0).max(100), z.literal(''), z.null()]).optional(),
    }),
});

const statusSchema = z.object({
    body: z.object({
        status: z.enum(['Pending', 'Approved', 'Declined']),
    }),
});

const toClientEnquiry = (enquiry) => {
    const doc = typeof enquiry.toObject === 'function' ? enquiry.toObject() : enquiry;

    return {
        id: doc._id?.toString?.() || doc.id,
        userId: doc.user?.toString?.() || doc.user,
        enquiryNumber: doc.enquiryNumber,
        userName: doc.userName,
        companyName: doc.companyName,
        address: doc.address,
        contactPerson: doc.contactPerson,
        designation: doc.designation,
        phone: doc.phone,
        fax: doc.fax,
        email: doc.email,
        placeOfCalibration: doc.placeOfCalibration,
        instruments: doc.instruments,
        comments: doc.comments,
        totalAmount: doc.totalAmount,
        discountPercentage: doc.discountPercentage ?? '',
        discountedAmount: doc.discountedAmount,
        status: doc.status,
        isSeen: doc.isSeen,
        timestamp: doc.createdAt,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
};

const buildInstrumentLines = async (instrumentInputs, discountPercentage) => {
    const names = instrumentInputs.map((instrument) => instrument.name);
    const services = await Service.find({
        name: { $in: names },
        isActive: true,
    }).lean();
    const serviceByName = new Map(
        services.map((service) => [service.name, service])
    );

    let totalAmount = 0;
    let customTotal = 0;
    const instruments = instrumentInputs.map((input) => {
        const service = serviceByName.get(input.name);
        if (!service) {
            throw new AppError(
                `Service "${input.name}" is not available.`,
                400,
                'SERVICE_NOT_FOUND'
            );
        }

        const quantity = Number(input.quantity);
        const price = Number(service.price);
        const customPrice =
            input.customPrice === '' || input.customPrice == null
                ? null
                : Number(input.customPrice);
        const selectedPrice =
            discountPercentage > 0 ? price : customPrice > 0 ? customPrice : price;
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
        discountPercentage > 0
            ? totalAmount - (totalAmount * discountPercentage) / 100
            : customTotal;

    return {
        instruments,
        totalAmount,
        discountedAmount,
    };
};

const listEnquiries = async (req, res) => {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };

    if (req.query.status && req.query.status !== 'All') {
        filter.status = req.query.status;
    }

    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 }).lean();
    res.json({
        success: true,
        enquiries: enquiries.map(toClientEnquiry),
    });
};

const createEnquiry = async (req, res) => {
    if (!req.user.isProfileComplete()) {
        throw new AppError(
            'Add your company, designation, and phone number before submitting an enquiry.',
            400,
            'PROFILE_INCOMPLETE'
        );
    }

    const body = req.validated.body;
    const discountPercentage =
        body.discountPercentage === '' || body.discountPercentage == null
            ? null
            : Number(body.discountPercentage);
    const pricing = await buildInstrumentLines(
        body.instruments,
        Number(discountPercentage || 0)
    );
    const enquiryNumber = await getNextEnquiryNumber();

    const enquiry = await Enquiry.create({
        enquiryNumber,
        user: req.user._id,
        userName: req.user.name,
        companyName: body.companyName.trim(),
        address: body.address.trim(),
        contactPerson: body.contactPerson.trim(),
        designation: body.designation.trim(),
        phone: body.phone.trim(),
        fax: body.fax?.trim() || '',
        email: body.email.trim().toLowerCase(),
        placeOfCalibration: body.placeOfCalibration,
        instruments: pricing.instruments,
        comments: body.comments?.trim() || '',
        totalAmount: pricing.totalAmount,
        discountPercentage,
        discountedAmount: pricing.discountedAmount,
        status: 'Pending',
        isSeen: false,
    });

    sendEnquiryNotification(enquiry).catch((error) => {
        console.error('Failed to send enquiry notification:', error);
    });

    sendPushNotificationsToAdmins({
        title: 'New enquiry submitted',
        body: `${enquiry.enquiryNumber} was submitted by ${enquiry.userName} from ${enquiry.companyName}.`,
        data: {
            type: 'enquiry:created',
            enquiryNumber: enquiry.enquiryNumber,
            status: enquiry.status,
        },
    }).catch((error) => {
        console.error('Failed to send admin push notification:', error);
    });

    const payload = toClientEnquiry(enquiry);
    emitToAdmins('enquiry:created', payload);
    emitToUser(req.user._id, 'enquiry:created', payload);

    res.status(201).json({
        success: true,
        enquiry: payload,
        enquiryNumber,
    });
};

const getEnquiry = async (req, res) => {
    const enquiry = await Enquiry.findOne({
        enquiryNumber: req.params.enquiryNumber,
    });

    if (!enquiry) {
        throw new AppError('Enquiry not found.', 404, 'ENQUIRY_NOT_FOUND');
    }

    const isOwner = enquiry.user.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
        throw new AppError('Access denied.', 403, 'ACCESS_DENIED');
    }

    if (req.user.role === 'admin' && !enquiry.isSeen) {
        enquiry.isSeen = true;
        await enquiry.save();
    }

    res.json({
        success: true,
        enquiry: toClientEnquiry(enquiry),
    });
};

const updateStatus = async (req, res) => {
    const enquiry = await Enquiry.findOneAndUpdate(
        { enquiryNumber: req.params.enquiryNumber },
        { status: req.validated.body.status },
        { new: true, runValidators: true }
    );

    if (!enquiry) {
        throw new AppError('Enquiry not found.', 404, 'ENQUIRY_NOT_FOUND');
    }

    const payload = toClientEnquiry(enquiry);
    emitToAdmins('enquiry:updated', payload);
    emitToUser(enquiry.user, 'enquiry:updated', payload);

    sendPushNotificationToUser(enquiry.user, {
        title: 'Enquiry status updated',
        body: `${enquiry.enquiryNumber} is now ${enquiry.status}.`,
        data: {
            type: 'enquiry:status',
            enquiryNumber: enquiry.enquiryNumber,
            status: enquiry.status,
        },
    }).catch((error) => {
        console.error('Failed to send user push notification:', error);
    });

    res.json({
        success: true,
        enquiry: payload,
    });
};

const markSeen = async (req, res) => {
    const enquiry = await Enquiry.findOneAndUpdate(
        { enquiryNumber: req.params.enquiryNumber },
        { isSeen: true },
        { new: true }
    );

    if (!enquiry) {
        throw new AppError('Enquiry not found.', 404, 'ENQUIRY_NOT_FOUND');
    }

    const payload = toClientEnquiry(enquiry);
    emitToAdmins('enquiry:updated', payload);

    res.json({
        success: true,
        enquiry: payload,
    });
};

const deleteEnquiry = async (req, res) => {
    const enquiry = await Enquiry.findOne({
        enquiryNumber: req.params.enquiryNumber,
    });

    if (!enquiry) {
        throw new AppError('Enquiry not found.', 404, 'ENQUIRY_NOT_FOUND');
    }

    const isOwner = enquiry.user.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && (!isOwner || enquiry.status !== 'Pending')) {
        throw new AppError(
            'Only pending enquiries can be deleted by their owner.',
            403,
            'DELETE_NOT_ALLOWED'
        );
    }

    await enquiry.deleteOne();

    const deletedPayload = {
        enquiryNumber: enquiry.enquiryNumber,
        id: enquiry._id.toString(),
    };

    emitToAdmins('enquiry:deleted', deletedPayload);
    emitToUser(enquiry.user, 'enquiry:deleted', deletedPayload);

    if (req.user.role === 'admin') {
        sendPushNotificationToUser(enquiry.user, {
            title: 'Enquiry removed',
            body: `${enquiry.enquiryNumber} was removed from the enquiry list.`,
            data: {
                type: 'enquiry:deleted',
                enquiryNumber: enquiry.enquiryNumber,
                status: enquiry.status,
            },
        }).catch((error) => {
            console.error('Failed to send user deletion push notification:', error);
        });
    } else {
        sendPushNotificationsToAdmins({
            title: 'Enquiry deleted',
            body: `${enquiry.enquiryNumber} was deleted by ${enquiry.userName}.`,
            data: {
                type: 'enquiry:deleted',
                enquiryNumber: enquiry.enquiryNumber,
                status: enquiry.status,
            },
        }).catch((error) => {
            console.error('Failed to send admin deletion push notification:', error);
        });
    }

    res.json({ success: true });
};

module.exports = {
    createEnquiry,
    createEnquirySchema,
    deleteEnquiry,
    getEnquiry,
    listEnquiries,
    markSeen,
    statusSchema,
    toClientEnquiry,
    updateStatus,
};
