const { z } = require('zod');
const mongoose = require('mongoose');

const AppError = require('../utils/AppError');
const Service = require('../models/Service');
const { emitToAdmins } = require('../sockets/socketHub');

const serviceSchema = z.object({
    body: z.object({
        category: z.string().trim().min(1, 'Category is required.'),
        name: z.string().trim().min(1, 'Service name is required.'),
        price: z.coerce.number().min(0, 'Price must be zero or greater.'),
        currency: z.string().trim().min(1).default('PKR').optional(),
    }),
});

const ensureValidServiceId = (id) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new AppError('Service not found.', 404, 'SERVICE_NOT_FOUND');
    }
};

const ensureUniqueActiveService = async ({ category, name, excludeId }) => {
    const query = {
        category,
        name,
        isActive: true,
    };

    if (excludeId) {
        query._id = { $ne: excludeId };
    }

    const duplicate = await Service.findOne(query).lean();

    if (duplicate) {
        throw new AppError(
            'A service with this category and name already exists.',
            409,
            'SERVICE_ALREADY_EXISTS'
        );
    }
};

const listServices = async (req, res) => {
    const filter = { isActive: true };
    if (req.query.category) {
        filter.category = req.query.category;
    }

    const services = await Service.find(filter)
        .sort({ category: 1, name: 1 })
        .lean();

    res.json({
        success: true,
        services: services.map((service) => ({
            id: service._id.toString(),
            ...service,
            _id: undefined,
        })),
    });
};

const listCategories = async (_req, res) => {
    const categories = await Service.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', servicesCount: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, name: '$_id', servicesCount: 1 } },
    ]);

    res.json({ success: true, categories });
};

const createService = async (req, res) => {
    const { category, name, price, currency = 'PKR' } = req.validated.body;
    await ensureUniqueActiveService({ category, name });

    const inactiveService = await Service.findOne({
        category,
        name,
        isActive: false,
    });
    const service =
        inactiveService ||
        new Service({
            category,
            name,
            createdBy: req.user._id,
        });

    service.set({
        price,
        currency,
        isActive: true,
        updatedBy: req.user._id,
    });
    await service.save();

    emitToAdmins('service:changed', {
        action: 'created',
        serviceId: service._id.toString(),
    });

    res.status(201).json({
        success: true,
        service: { id: service._id.toString(), ...service.toObject(), _id: undefined },
    });
};

const updateService = async (req, res) => {
    const { category, name, price, currency = 'PKR' } = req.validated.body;
    ensureValidServiceId(req.params.id);
    await ensureUniqueActiveService({
        category,
        name,
        excludeId: req.params.id,
    });

    const service = await Service.findByIdAndUpdate(
        req.params.id,
        {
            category,
            name,
            price,
            currency,
            updatedBy: req.user._id,
        },
        { new: true, runValidators: true }
    );

    if (!service) {
        throw new AppError('Service not found.', 404, 'SERVICE_NOT_FOUND');
    }

    emitToAdmins('service:changed', {
        action: 'updated',
        serviceId: service._id.toString(),
    });

    res.json({
        success: true,
        service: { id: service._id.toString(), ...service.toObject(), _id: undefined },
    });
};

const deleteService = async (req, res) => {
    ensureValidServiceId(req.params.id);

    const service = await Service.findByIdAndUpdate(
        req.params.id,
        { isActive: false, updatedBy: req.user._id },
        { new: true }
    );

    if (!service) {
        throw new AppError('Service not found.', 404, 'SERVICE_NOT_FOUND');
    }

    emitToAdmins('service:changed', {
        action: 'deleted',
        serviceId: service._id.toString(),
    });

    res.json({ success: true });
};

module.exports = {
    createService,
    deleteService,
    listCategories,
    listServices,
    serviceSchema,
    updateService,
};
