const express = require('express');

const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const controller = require('../controllers/authController');

const router = express.Router();

router.post('/register', validate(controller.registerSchema), asyncHandler(controller.register));
router.post('/login', validate(controller.loginSchema), asyncHandler(controller.login));
router.post('/verify-email', validate(controller.emailCodeSchema), asyncHandler(controller.verifyEmail));
router.post('/resend-verification', validate(controller.emailSchema), asyncHandler(controller.resendVerification));
router.post('/forgot-password', validate(controller.emailSchema), asyncHandler(controller.forgotPassword));
router.post('/verify-reset-code', validate(controller.emailCodeSchema), asyncHandler(controller.verifyResetCode));
router.post('/reset-password', validate(controller.resetPasswordSchema), asyncHandler(controller.resetPassword));
router.post('/refresh', validate(controller.refreshSchema), asyncHandler(controller.refresh));
router.post('/logout', authenticate, asyncHandler(controller.logout));
router.get('/me', authenticate, asyncHandler(controller.me));

module.exports = router;
