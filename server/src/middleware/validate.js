const AppError = require('../utils/AppError');

const validate = (schema) => (req, _res, next) => {
    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
    });

    if (!result.success) {
        const firstIssue = result.error.issues[0];
        next(
            new AppError(
                firstIssue?.message || 'Invalid request.',
                400,
                'VALIDATION_ERROR'
            )
        );
        return;
    }

    req.validated = result.data;
    next();
};

module.exports = validate;
