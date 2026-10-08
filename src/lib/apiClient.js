import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { clearTokens, getTokens, saveTokens } from './tokenStorage';

const getDefaultApiUrl = () => {
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:4000/api';
    }

    return 'http://localhost:4000/api';
};

export const API_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    Constants.expoConfig?.extra?.apiUrl ||
    getDefaultApiUrl();

export const SOCKET_URL = API_URL.replace(/\/api\/?$/, '');

export class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = data?.code;
        this.data = data;
    }
}

let refreshPromise;

const parseResponse = async (response) => {
    const text = await response.text();
    if (!text) {
        return {};
    }

    try {
        return JSON.parse(text);
    } catch (_error) {
        return { message: text };
    }
};

const buildHeaders = async ({ auth, formData, headers }) => {
    const nextHeaders = { ...(headers || {}) };

    if (!formData) {
        nextHeaders['Content-Type'] = 'application/json';
    }

    if (auth) {
        const { accessToken } = await getTokens();
        if (accessToken) {
            nextHeaders.Authorization = `Bearer ${accessToken}`;
        }
    }

    return nextHeaders;
};

const refreshAccessToken = async () => {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const { refreshToken } = await getTokens();
            if (!refreshToken) {
                throw new ApiError('Session expired.', 401, {
                    code: 'NO_REFRESH_TOKEN',
                });
            }

            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });
            const data = await parseResponse(response);

            if (!response.ok) {
                await clearTokens();
                throw new ApiError(
                    data.message || 'Session expired.',
                    response.status,
                    data
                );
            }

            await saveTokens(data.tokens);
            return data;
        })().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
};

export const apiRequest = async (path, options = {}) => {
    const {
        method = 'GET',
        body,
        formData,
        auth = true,
        headers,
        retry = true,
    } = options;

    const requestOptions = {
        method,
        headers: await buildHeaders({ auth, formData, headers }),
    };

    if (formData) {
        requestOptions.body = formData;
    } else if (body !== undefined) {
        requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${path}`, requestOptions);
    const data = await parseResponse(response);

    if (response.status === 401 && auth && retry) {
        await refreshAccessToken();
        return apiRequest(path, { ...options, retry: false });
    }

    if (!response.ok) {
        throw new ApiError(
            data.message || 'Something went wrong. Please try again.',
            response.status,
            data
        );
    }

    return data;
};
