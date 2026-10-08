const express = require('express');

const authRoutes = require('./authRoutes');
const enquiryRoutes = require('./enquiryRoutes');
const serviceRoutes = require('./serviceRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.get('/health', (_req, res) => {
    res.json({ success: true, status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/services', serviceRoutes);
router.use('/enquiries', enquiryRoutes);

module.exports = router;
