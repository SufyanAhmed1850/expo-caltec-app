const env = require('../config/env');
const PushToken = require('../models/PushToken');
const User = require('../models/User');

let expoClientPromise;

const getExpoClient = async () => {
    if (!expoClientPromise) {
        expoClientPromise = import('expo-server-sdk').then(({ Expo }) => ({
            Expo,
            client: new Expo(
                env.expoAccessToken ? { accessToken: env.expoAccessToken } : undefined
            ),
        }));
    }

    return expoClientPromise;
};

const DEFAULT_CHANNEL_ID = 'default';

const isTokenUsable = async (token) => {
    const { Expo } = await getExpoClient();
    return typeof token === 'string' && Expo.isExpoPushToken(token);
};

const buildMessages = async (pushTokens, payload) => {
    const invalidTokens = new Set();
    const messages = [];

    for (const pushTarget of pushTokens) {
        const token = pushTarget?.token?.trim();
        if (!token) {
            continue;
        }

        if (!(await isTokenUsable(token))) {
            invalidTokens.add(token);
            continue;
        }

        messages.push({
            to: token,
            sound: 'default',
            priority: 'high',
            channelId: DEFAULT_CHANNEL_ID,
            title: payload.title,
            body: payload.body,
            data: payload.data || {},
        });
    }

    return { messages, invalidTokens };
};

const removeInvalidTokens = async (tokens = []) => {
    if (!tokens.length) {
        return;
    }

    await PushToken.deleteMany({ token: { $in: tokens } });
};

const pruneInvalidTokensFromTickets = async (tickets, messageChunk) => {
    const { client } = await getExpoClient();
    const invalidTokens = [];
    const receiptTokenPairs = [];

    tickets.forEach((ticket, index) => {
        const token = messageChunk[index]?.to;
        if (!token) {
            return;
        }

        if (ticket.status === 'ok' && ticket.id) {
            receiptTokenPairs.push({ receiptId: ticket.id, token });
            return;
        }

        if (ticket.details?.error === 'DeviceNotRegistered') {
            invalidTokens.push(token);
        }
    });

    if (receiptTokenPairs.length) {
        const receiptIds = receiptTokenPairs.map((item) => item.receiptId);
        const receiptTokenMap = new Map(
            receiptTokenPairs.map((item) => [item.receiptId, item.token])
        );

        for (const receiptChunk of client.chunkPushNotificationReceiptIds(
            receiptIds
        )) {
            try {
                const receipts =
                    await client.getPushNotificationReceiptsAsync(receiptChunk);

                Object.entries(receipts || {}).forEach(([receiptId, receipt]) => {
                    if (receipt?.details?.error === 'DeviceNotRegistered') {
                        const staleToken = receiptTokenMap.get(receiptId);
                        if (staleToken) {
                            invalidTokens.push(staleToken);
                        }
                    }
                });
            } catch (error) {
                console.error('Failed to read Expo push receipts:', error);
            }
        }
    }

    if (invalidTokens.length) {
        await removeInvalidTokens([...new Set(invalidTokens)]);
    }
};

const sendPushNotificationsToUsers = async (pushTokens, payload) => {
    if (env.nodeEnv === 'test') {
        return { sent: 0 };
    }

    const { client } = await getExpoClient();
    const { messages, invalidTokens } = await buildMessages(pushTokens, payload);

    if (invalidTokens.size) {
        await removeInvalidTokens([...invalidTokens]);
    }

    if (!messages.length) {
        return { sent: 0 };
    }

    let sent = 0;

    for (const messageChunk of client.chunkPushNotifications(messages)) {
        try {
            const tickets = await client.sendPushNotificationsAsync(messageChunk);
            sent += tickets.length;
            await pruneInvalidTokensFromTickets(tickets, messageChunk);
        } catch (error) {
            console.error('Failed to send Expo push notification chunk:', error);
        }
    }

    return { sent };
};

const sendPushNotificationsToAdmins = async (payload) => {
    const admins = await User.find({
        role: 'admin',
        notificationsPaused: { $ne: true },
    })
        .select('_id')
        .lean();

    if (!admins.length) {
        return { sent: 0 };
    }

    const adminPushTokens = await PushToken.find({
        user: { $in: admins.map((admin) => admin._id) },
    }).lean();

    return sendPushNotificationsToUsers(adminPushTokens, payload);
};

const sendPushNotificationToUser = async (userId, payload) => {
    const user = await User.findOne({
        _id: userId,
        notificationsPaused: { $ne: true },
    })
        .select('_id')
        .lean();

    if (!user) {
        return { sent: 0 };
    }

    const userPushTokens = await PushToken.find({
        user: user._id,
    }).lean();

    return sendPushNotificationsToUsers(userPushTokens, payload);
};

module.exports = {
    sendPushNotificationToUser,
    sendPushNotificationsToAdmins,
    sendPushNotificationsToUsers,
};
