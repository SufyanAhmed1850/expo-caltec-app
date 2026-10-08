import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiRequest } from './apiClient';

const PUSH_TOKEN_STORAGE_KEY = 'caltec.expoPushToken';

export const getStoredPushToken = async () =>
    AsyncStorage.getItem(PUSH_TOKEN_STORAGE_KEY);

export const storePushToken = async (token) => {
    if (!token) {
        await AsyncStorage.removeItem(PUSH_TOKEN_STORAGE_KEY);
        return;
    }

    await AsyncStorage.setItem(PUSH_TOKEN_STORAGE_KEY, token);
};

export const clearStoredPushToken = async () => {
    await AsyncStorage.removeItem(PUSH_TOKEN_STORAGE_KEY);
};

export const registerPushTokenOnServer = async (payload) => {
    await apiRequest('/users/me/push-tokens', {
        method: 'POST',
        body: payload,
    });
};

export const unregisterPushTokenOnServer = async (token) => {
    if (!token) {
        return;
    }

    await apiRequest('/users/me/push-tokens', {
        method: 'DELETE',
        body: { token },
    });
};

export const unregisterStoredPushTokenAsync = async () => {
    const storedToken = await getStoredPushToken();
    if (!storedToken) {
        return;
    }

    try {
        await unregisterPushTokenOnServer(storedToken);
    } finally {
        await clearStoredPushToken();
    }
};
