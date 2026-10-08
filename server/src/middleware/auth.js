const AppError = require('../utils/AppError');
const User = require('../models/User');
const { verifyAccessToken } = require('../services/tokenService');

const authenticate = async (req, _res, next) => {
    try {
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : null;

        if (!token) {
            throw new AppError('Authentication required.', 401, 'AUTH_REQUIRED');
        }

        const payload = verifyAccessToken(token);
        const user = await User.findById(payload.sub);

        if (!user || !user.emailVerified) {
            throw new AppError('Authentication required.', 401, 'AUTH_REQUIRED');
        }

        req.user = user;
        next();
    } catch (error) {
        next(
            error instanceof AppError
                ? error
                : new AppError('Authentication required.', 401, 'AUTH_REQUIRED')
        );
    }
};

const requireAdmin = (req, _res, next) => {
    if (req.user?.role !== 'admin') {
        next(new AppError('Admin access required.', 403, 'ADMIN_REQUIRED'));
        return;
    }

    next();
};

module.exports = {
    authenticate,
    requireAdmin,
};
