const http = require('http');

const createApp = require('./app/createApp');
const env = require('./config/env');
const { connectDatabase } = require('./config/database');
const { initializeSocket } = require('./sockets/socketHub');

const startServer = async () => {
    await connectDatabase();

    const app = createApp();
    const httpServer = http.createServer(app);
    initializeSocket(httpServer, env.clientOrigin);

    httpServer.listen(env.port, () => {
        console.log(`Caltec API listening on port ${env.port}`);
    });
};

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
