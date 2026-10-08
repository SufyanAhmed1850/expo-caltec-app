const express = require('express');

const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { authenticate, requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/enquiryController');

const router = express.Router();

router.use(authenticate);
router.get('/', asyncHandler(controller.listEnquiries));
router.post('/', validate(controller.createEnquirySchema), asyncHandler(controller.createEnquiry));
router.get('/:enquiryNumber', asyncHandler(controller.getEnquiry));
router.patch('/:enquiryNumber/status', requireAdmin, validate(controller.statusSchema), asyncHandler(controller.updateStatus));
router.patch('/:enquiryNumber/seen', requireAdmin, asyncHandler(controller.markSeen));
router.delete('/:enquiryNumber', asyncHandler(controller.deleteEnquiry));

module.exports = router;
