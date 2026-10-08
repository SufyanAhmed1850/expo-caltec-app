const express = require('express');

const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { authenticate, requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/serviceController');

const router = express.Router();

router.get('/', authenticate, asyncHandler(controller.listServices));
router.get('/categories', authenticate, asyncHandler(controller.listCategories));
router.post('/', authenticate, requireAdmin, validate(controller.serviceSchema), asyncHandler(controller.createService));
router.patch('/:id', authenticate, requireAdmin, validate(controller.serviceSchema), asyncHandler(controller.updateService));
router.delete('/:id', authenticate, requireAdmin, asyncHandler(controller.deleteService));

module.exports = router;
