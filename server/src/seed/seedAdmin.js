const env = require('../config/env');
const { connectDatabase, disconnectDatabase } = require('../config/database');
const User = require('../models/User');

const seedAdmin = async () => {
    if (!env.adminEmail) {
        throw new Error('ADMIN_EMAIL is required to seed an admin.');
    }

    const user = await User.findOne({ email: env.adminEmail });
    if (!user) {
        throw new Error(
            `No user exists with ${env.adminEmail}. Register that email first, then rerun npm run seed:admin.`
        );
    }

    user.role = 'admin';
    user.emailVerified = true;
    user.verificationCodeHash = null;
    user.verificationCodeExpiresAt = null;
    await user.save();

    console.log(`${env.adminEmail} is now an admin.`);
};

if (require.main === module) {
    connectDatabase()
        .then(seedAdmin)
        .then(disconnectDatabase)
        .catch(async (error) => {
            console.error('Failed to seed admin:', error);
            await disconnectDatabase();
            process.exit(1);
        });
}

module.exports = seedAdmin;
