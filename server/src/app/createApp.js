const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const env = require('../config/env');
const apiRoutes = require('../routes');
const errorHandler = require('../middleware/errorHandler');

const createApp = () => {
    const app = express();

    app.use(helmet());
    app.use(
        cors({
            origin: env.clientOrigin === '*' ? true : env.clientOrigin,
            credentials: true,
        })
    );
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true }));

    if (env.nodeEnv !== 'test') {
        app.use(morgan('dev'));
    }

    app.use(
        '/api/auth',
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            standardHeaders: true,
            legacyHeaders: false,
        })
    );

    app.use('/api', apiRoutes);
    app.use(errorHandler);

    return app;
};

module.exports = createApp;
