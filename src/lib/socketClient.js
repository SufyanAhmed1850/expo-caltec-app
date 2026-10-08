import { io } from 'socket.io-client';

import { SOCKET_URL } from './apiClient';
import { getTokens } from './tokenStorage';

let socket;
const pendingListeners = new Map();

const applyPendingListeners = () => {
    if (!socket) {
        return;
    }

    pendingListeners.forEach((handlers, event) => {
        handlers.forEach((handler) => socket.on(event, handler));
    });
};

export const connectSocket = async () => {
    const { accessToken } = await getTokens();
    if (!accessToken) {
        return null;
    }

    if (socket?.connected) {
        return socket;
    }

    socket?.disconnect();
    socket = io(SOCKET_URL, {
        transports: ['websocket'],
        auth: { token: accessToken },
    });
    applyPendingListeners();

    return socket;
};

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
};

export const addSocketListener = (event, handler) => {
    const handlers = pendingListeners.get(event) || new Set();
    handlers.add(handler);
    pendingListeners.set(event, handlers);

    if (socket) {
        socket.on(event, handler);
    }

    return () => {
        handlers.delete(handler);
        socket?.off(event, handler);
    };
};
