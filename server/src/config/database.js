const mongoose = require('mongoose');
const env = require('./env');

const connectDatabase = async (mongoUri = env.mongoUri) => {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri);
    return mongoose.connection;
};

const disconnectDatabase = async () => {
    await mongoose.disconnect();
};

module.exports = {
    connectDatabase,
    disconnectDatabase,
};
