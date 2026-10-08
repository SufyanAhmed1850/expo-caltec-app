const AppError = require('../utils/AppError');

const errorHandler = (error, _req, res, _next) => {
    const statusCode = error.statusCode || 500;
    const publicError =
        error instanceof AppError || error.isOperational
            ? error
            : new AppError('Something went wrong.', statusCode);

    if (statusCode >= 500) {
        console.error(error);
    }

    res.status(publicError.statusCode || 500).json({
        success: false,
        code: publicError.code || 'SERVER_ERROR',
        message: publicError.message || 'Something went wrong.',
    });
};

module.exports = errorHandler;
