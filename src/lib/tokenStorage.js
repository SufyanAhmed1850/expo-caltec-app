import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'caltec.access-token';
const REFRESH_TOKEN_KEY = 'caltec.refresh-token';

const canUseSecureStore = async () => {
    if (Platform.OS === 'web') {
        return false;
    }

    try {
        return await SecureStore.isAvailableAsync();
    } catch (_error) {
        return false;
    }
};

const getItem = async (key) => {
    if (await canUseSecureStore()) {
        return SecureStore.getItemAsync(key);
    }

    return AsyncStorage.getItem(key);
};

const setItem = async (key, value) => {
    if (await canUseSecureStore()) {
        await SecureStore.setItemAsync(key, value);
        return;
    }

    await AsyncStorage.setItem(key, value);
};

const deleteItem = async (key) => {
    if (await canUseSecureStore()) {
        await SecureStore.deleteItemAsync(key);
        return;
    }

    await AsyncStorage.removeItem(key);
};

export const getTokens = async () => ({
    accessToken: await getItem(ACCESS_TOKEN_KEY),
    refreshToken: await getItem(REFRESH_TOKEN_KEY),
});

export const saveTokens = async (tokens = {}) => {
    if (tokens.accessToken) {
        await setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    }

    if (tokens.refreshToken) {
        await setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
};

export const clearTokens = async () => {
    await Promise.all([deleteItem(ACCESS_TOKEN_KEY), deleteItem(REFRESH_TOKEN_KEY)]);
};
