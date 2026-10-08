const express = require('express');
const multer = require('multer');

const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { authenticate, requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/userController');

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.use(authenticate);
router.get('/me', asyncHandler(controller.getMe));
router.patch(
    '/me',
    upload.single('avatar'),
    validate(controller.updateProfileSchema),
    asyncHandler(controller.updateMe)
);
router.patch(
    '/me/settings',
    validate(controller.updateSettingsSchema),
    asyncHandler(controller.updateSettings)
);
router.post(
    '/me/push-tokens',
    validate(controller.pushTokenSchema),
    asyncHandler(controller.registerPushToken)
);
router.delete(
    '/me/push-tokens',
    validate(controller.pushTokenSchema),
    asyncHandler(controller.removePushToken)
);
router.get('/', requireAdmin, asyncHandler(controller.listUsers));

module.exports = router;
