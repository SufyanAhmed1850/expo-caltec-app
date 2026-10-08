const { connectDatabase, disconnectDatabase } = require('../config/database');
const Service = require('../models/Service');
const loadServiceSeedData = require('./loadServiceSeedData');

const seedServices = async () => {
    const services = loadServiceSeedData();
    await Service.init();

    const operations = services.map((service) => ({
        updateOne: {
            filter: {
                category: service.category,
                name: service.name,
            },
            update: {
                $set: {
                    price: service.price,
                    currency: service.currency,
                    isActive: true,
                },
                $setOnInsert: {
                    category: service.category,
                    name: service.name,
                },
            },
            upsert: true,
        },
    }));

    if (operations.length > 0) {
        await Service.bulkWrite(operations, { ordered: false });
    }

    console.log(`Seeded ${services.length} unique services.`);
};

if (require.main === module) {
    connectDatabase()
        .then(seedServices)
        .then(disconnectDatabase)
        .catch(async (error) => {
            console.error('Failed to seed services:', error);
            await disconnectDatabase();
            process.exit(1);
        });
}

module.exports = seedServices;
