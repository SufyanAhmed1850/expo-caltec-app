const { Server } = require('socket.io');
const User = require('../models/User');
const { verifyAccessToken } = require('../services/tokenService');

let io;

const initializeSocket = (httpServer, corsOrigin) => {
    io = new Server(httpServer, {
        cors: {
            origin: corsOrigin === '*' ? true : corsOrigin,
            credentials: true,
        },
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                throw new Error('Missing socket token.');
            }

            const payload = verifyAccessToken(token);
            const user = await User.findById(payload.sub);
            if (!user || !user.emailVerified) {
                throw new Error('Invalid socket user.');
            }

            socket.user = user;
            next();
        } catch (error) {
            next(error);
        }
    });

    io.on('connection', (socket) => {
        socket.join(`user:${socket.user._id}`);
        if (socket.user.role === 'admin') {
            socket.join('admins');
        }
    });

    return io;
};

const emitToAdmins = (event, payload) => {
    io?.to('admins').emit(event, payload);
};

const emitToUser = (userId, event, payload) => {
    io?.to(`user:${userId}`).emit(event, payload);
};

module.exports = {
    emitToAdmins,
    emitToUser,
    initializeSocket,
};
