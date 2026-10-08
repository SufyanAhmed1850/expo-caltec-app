const argon2 = require('argon2');
const { z } = require('zod');

const AppError = require('../utils/AppError');
const User = require('../models/User');
const toPublicUser = require('../utils/publicUser');
const { generateCode, hashCode, minutesFromNow } = require('../utils/codes');
const { normalizeEmail, normalizeName } = require('../utils/normalize');
const {
    hashToken,
    issueTokenPair,
    verifyRefreshToken,
} = require('../services/tokenService');
const {
    sendPasswordResetCode,
    sendVerificationCode,
} = require('../services/emailService');

const passwordSchema = z
    .string()
    .min(8, 'Password must include at least 8 characters.')
    .regex(/[A-Z]/, 'Password must include an uppercase letter.')
    .regex(/[0-9]/, 'Password must include a number.');

const RESET_CODE_RESEND_COOLDOWN_MS = 60 * 1000;

const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name is required.'),
        email: z.string().email('Enter a valid email address.'),
        password: passwordSchema,
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Enter a valid email address.'),
        password: z.string().min(1, 'Password is required.'),
    }),
});

const emailCodeSchema = z.object({
    body: z.object({
        email: z.string().email('Enter a valid email address.'),
        code: z.string().length(6, 'Enter the 6 digit code.'),
    }),
});

const emailSchema = z.object({
    body: z.object({
        email: z.string().email('Enter a valid email address.'),
    }),
});

const resetPasswordSchema = z.object({
    body: z.object({
        email: z.string().email('Enter a valid email address.'),
        code: z.string().length(6, 'Enter the 6 digit code.'),
        password: passwordSchema,
    }),
});

const refreshSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(10, 'Refresh token is required.'),
    }),
});

const createVerificationCode = async (user) => {
    const code = generateCode();
    user.verificationCodeHash = hashCode(code);
    user.verificationCodeExpiresAt = minutesFromNow(15);
    await user.save();
    await sendVerificationCode(user, code);
};

const register = async (req, res) => {
    const { name, email, password } = req.validated.body;
    const normalizedEmail = normalizeEmail(email);
    const normalizedName = normalizeName(name);

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        throw new AppError(
            'An account already exists for this email.',
            409,
            'EMAIL_EXISTS'
        );
    }

    const passwordHash = await argon2.hash(password);
    const user = await User.create({
        name: normalizedName,
        email: normalizedEmail,
        passwordHash,
        role: 'user',
        emailVerified: false,
        profileCompleted: false,
    });

    await createVerificationCode(user);

    res.status(201).json({
        success: true,
        authStatus: 'unverified',
        pendingVerificationEmail: normalizedEmail,
        user: toPublicUser(user),
        message: 'Verification code sent. Please verify your email.',
    });
};

const login = async (req, res) => {
    const { email, password } = req.validated.body;
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await argon2.verify(user.passwordHash, password))) {
        throw new AppError(
            'Email or password is incorrect.',
            401,
            'INVALID_CREDENTIALS'
        );
    }

    if (!user.emailVerified) {
        res.json({
            success: true,
            authStatus: 'unverified',
            pendingVerificationEmail: normalizedEmail,
            message: 'Verify your email before accessing the app.',
        });
        return;
    }

    const tokens = await issueTokenPair(user);
    res.json({
        success: true,
        authStatus: 'authenticated',
        user: toPublicUser(user),
        tokens,
    });
};

const verifyEmail = async (req, res) => {
    const { email, code } = req.validated.body;
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (
        !user ||
        !user.verificationCodeHash ||
        user.verificationCodeHash !== hashCode(code) ||
        !user.verificationCodeExpiresAt ||
        user.verificationCodeExpiresAt < new Date()
    ) {
        throw new AppError(
            'The verification code is invalid or expired.',
            400,
            'INVALID_VERIFICATION_CODE'
        );
    }

    user.emailVerified = true;
    user.verificationCodeHash = null;
    user.verificationCodeExpiresAt = null;
    await user.save();

    const tokens = await issueTokenPair(user);
    res.json({
        success: true,
        authStatus: 'authenticated',
        user: toPublicUser(user),
        tokens,
    });
};

const resendVerification = async (req, res) => {
    const normalizedEmail = normalizeEmail(req.validated.body.email);
    const user = await User.findOne({ email: normalizedEmail });

    if (user && !user.emailVerified) {
        await createVerificationCode(user);
    }

    res.json({
        success: true,
        message: 'If an account needs verification, a fresh code has been sent.',
    });
};

const forgotPassword = async (req, res) => {
    const normalizedEmail = normalizeEmail(req.validated.body.email);
    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
        const lastSentAt = user.resetPasswordCodeSentAt?.getTime() || 0;
        const canSendResetCode =
            Date.now() - lastSentAt >= RESET_CODE_RESEND_COOLDOWN_MS;

        if (canSendResetCode) {
            const code = generateCode();
            user.resetPasswordCodeHash = hashCode(code);
            user.resetPasswordCodeExpiresAt = minutesFromNow(15);
            user.resetPasswordCodeSentAt = new Date();
            await user.save();
            await sendPasswordResetCode(user, code);
        }
    }

    res.json({
        success: true,
        message: 'If an account exists for this email, a reset code has been sent.',
    });
};

const verifyResetCode = async (req, res) => {
    const { email, code } = req.validated.body;
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (
        !user ||
        !user.resetPasswordCodeHash ||
        user.resetPasswordCodeHash !== hashCode(code) ||
        !user.resetPasswordCodeExpiresAt ||
        user.resetPasswordCodeExpiresAt < new Date()
    ) {
        throw new AppError(
            'The reset code is invalid or expired.',
            400,
            'INVALID_RESET_CODE'
        );
    }

    res.json({
        success: true,
        message: 'Reset code verified. Create a new password.',
    });
};

const resetPassword = async (req, res) => {
    const { email, code, password } = req.validated.body;
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (
        !user ||
        !user.resetPasswordCodeHash ||
        user.resetPasswordCodeHash !== hashCode(code) ||
        !user.resetPasswordCodeExpiresAt ||
        user.resetPasswordCodeExpiresAt < new Date()
    ) {
        throw new AppError(
            'The reset code is invalid or expired.',
            400,
            'INVALID_RESET_CODE'
        );
    }

    user.passwordHash = await argon2.hash(password);
    user.resetPasswordCodeHash = null;
    user.resetPasswordCodeExpiresAt = null;
    user.resetPasswordCodeSentAt = null;
    user.refreshTokenHashes = [];
    await user.save();

    res.json({
        success: true,
        message: 'Password updated. Please sign in with your new password.',
    });
};

const refresh = async (req, res) => {
    const { refreshToken } = req.validated.body;
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);

    if (!user || !user.emailVerified) {
        throw new AppError('Session expired.', 401, 'INVALID_REFRESH_TOKEN');
    }

    const tokenHash = hashToken(refreshToken);
    const existingToken = user.refreshTokenHashes.find(
        (item) => item.hash === tokenHash && item.expiresAt > new Date()
    );

    if (!existingToken) {
        throw new AppError('Session expired.', 401, 'INVALID_REFRESH_TOKEN');
    }

    user.refreshTokenHashes = user.refreshTokenHashes.filter(
        (item) => item.hash !== tokenHash && item.expiresAt > new Date()
    );
    await user.save();

    const tokens = await issueTokenPair(user);
    res.json({
        success: true,
        authStatus: 'authenticated',
        user: toPublicUser(user),
        tokens,
    });
};

const logout = async (req, res) => {
    const refreshToken = req.body?.refreshToken;

    if (refreshToken && req.user) {
        const tokenHash = hashToken(refreshToken);
        req.user.refreshTokenHashes = req.user.refreshTokenHashes.filter(
            (item) => item.hash !== tokenHash
        );
        await req.user.save();
    }

    res.json({ success: true });
};

const me = async (req, res) => {
    res.json({
        success: true,
        user: toPublicUser(req.user),
    });
};

module.exports = {
    emailCodeSchema,
    emailSchema,
    forgotPassword,
    login,
    loginSchema,
    logout,
    me,
    refresh,
    refreshSchema,
    register,
    registerSchema,
    resendVerification,
    resetPassword,
    resetPasswordSchema,
    verifyResetCode,
    verifyEmail,
};
