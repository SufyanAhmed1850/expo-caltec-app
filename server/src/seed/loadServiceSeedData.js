const serviceSeedData = require('./serviceSeedData');

const loadServiceSeedData = () => {
    const servicesByKey = new Map();

    for (const service of serviceSeedData) {
        const category = service.category?.trim();
        const name = service.name?.trim();

        if (!category || !name) {
            continue;
        }

        servicesByKey.set(`${category.toLowerCase()}::${name.toLowerCase()}`, {
            category,
            name,
            price: Number(service.price || 0),
            currency: service.currency?.trim() || 'PKR',
        });
    }

    return Array.from(servicesByKey.values());
};

module.exports = loadServiceSeedData;
