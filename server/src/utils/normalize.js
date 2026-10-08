const normalizeEmail = (value = '') => value.trim().toLowerCase();

const normalizeName = (value = '') => value.trim().replace(/\s+/g, ' ');

module.exports = {
    normalizeEmail,
    normalizeName,
};
