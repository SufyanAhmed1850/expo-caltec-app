const crypto = require('crypto');
const env = require('../config/env');

const generateCode = () =>
    crypto.randomInt(100000, 1000000).toString().padStart(6, '0');

const hashCode = (code) =>
    crypto
        .createHash('sha256')
        .update(`${String(code).trim()}:${env.codePepper}`)
        .digest('hex');

const minutesFromNow = (minutes) =>
    new Date(Date.now() + minutes * 60 * 1000);

module.exports = {
    generateCode,
    hashCode,
    minutesFromNow,
};
