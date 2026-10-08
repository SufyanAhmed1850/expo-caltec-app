import React from 'react';
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';
import TestRenderer, { act } from 'react-test-renderer';

import { AuthContextProvider, useAuth } from '../authContext';

const mockApiRequest = jest.fn();
const mockGetTokens = jest.fn();
const mockSaveTokens = jest.fn();
const mockClearTokens = jest.fn();
const mockConnectSocket = jest.fn();
const mockDisconnectSocket = jest.fn();
const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();

jest.mock('@/src/lib/apiClient', () => ({
    apiRequest: (...args) => mockApiRequest(...args),
}));

jest.mock('@/src/lib/tokenStorage', () => ({
    clearTokens: (...args) => mockClearTokens(...args),
    getTokens: (...args) => mockGetTokens(...args),
    saveTokens: (...args) => mockSaveTokens(...args),
}));

jest.mock('@/src/lib/socketClient', () => ({
    connectSocket: (...args) => mockConnectSocket(...args),
    disconnectSocket: (...args) => mockDisconnectSocket(...args),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: (...args) => mockGetItem(...args),
    setItem: (...args) => mockSetItem(...args),
    removeItem: (...args) => mockRemoveItem(...args),
}));

describe('AuthContextProvider', () => {
    let contextValue;
    let testRenderer;

    const TestConsumer = () => {
        contextValue = useAuth();
        return null;
    };

    const renderProvider = async () => {
        await act(async () => {
            testRenderer = TestRenderer.create(
                <AuthContextProvider>
                    <TestConsumer />
                </AuthContextProvider>
            );
        });

        await act(async () => {
            await Promise.resolve();
        });
    };

    beforeEach(() => {
        contextValue = undefined;
        jest.clearAllMocks();
        mockGetItem.mockResolvedValue(null);
        mockSetItem.mockResolvedValue(undefined);
        mockRemoveItem.mockResolvedValue(undefined);
        mockGetTokens.mockResolvedValue({
            accessToken: null,
            refreshToken: null,
        });
        mockSaveTokens.mockResolvedValue(undefined);
        mockClearTokens.mockResolvedValue(undefined);
        mockConnectSocket.mockResolvedValue(undefined);
    });

    afterEach(() => {
        if (testRenderer) {
            act(() => {
                testRenderer.unmount();
            });
            testRenderer = undefined;
        }
    });

    it('registers a user and enters verification state', async () => {
        mockApiRequest.mockResolvedValue({
            success: true,
            authStatus: 'unverified',
            message: 'Verification code sent.',
        });

        await renderProvider();

        let response;
        await act(async () => {
            response = await contextValue.register(
                '  New   User  ',
                ' NEW.User@example.com ',
                'Password1!'
            );
        });

        expect(response).toMatchObject({
            success: true,
            nextStep: 'verifyEmail',
        });
        expect(mockApiRequest).toHaveBeenCalledWith('/auth/register', {
            method: 'POST',
            body: {
                name: 'New User',
                email: 'new.user@example.com',
                password: 'Password1!',
            },
            auth: false,
        });
        expect(contextValue.authStatus).toBe('unverified');
        expect(contextValue.pendingVerificationEmail).toBe(
            'new.user@example.com'
        );
    });

    it('keeps unverified users out of authenticated state on sign in', async () => {
        mockApiRequest.mockResolvedValue({
            success: true,
            authStatus: 'unverified',
            message: 'Verify your email before accessing the app.',
        });

        await renderProvider();

        let response;
        await act(async () => {
            response = await contextValue.login(
                'VERIFY.ME@example.com',
                'Password1!'
            );
        });

        expect(response).toMatchObject({
            success: false,
            nextStep: 'verifyEmail',
        });
        expect(contextValue.authStatus).toBe('unverified');
        expect(contextValue.pendingVerificationEmail).toBe(
            'verify.me@example.com'
        );
    });

    it('verifies a code and stores the authenticated session', async () => {
        mockApiRequest.mockResolvedValue({
            success: true,
            authStatus: 'authenticated',
            tokens: {
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
            },
            user: {
                id: 'user-1',
                name: 'Verified User',
                email: 'verified@example.com',
                role: 'user',
                emailVerified: true,
                profileCompleted: true,
                companyName: 'Caltec',
                designation: 'Manager',
                phone: '123456789',
            },
        });

        await renderProvider();

        let response;
        await act(async () => {
            response = await contextValue.verifyEmail(
                'verified@example.com',
                '123456'
            );
        });

        expect(response).toMatchObject({
            success: true,
            verified: true,
            nextPath: '/(app)/home',
        });
        expect(mockSaveTokens).toHaveBeenCalledWith({
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
        });
        expect(mockConnectSocket).toHaveBeenCalled();
        expect(contextValue.authStatus).toBe('authenticated');
        expect(contextValue.userProfile).toMatchObject({
            uid: 'user-1',
            emailVerified: true,
            profileCompleted: true,
            companyName: 'Caltec',
            designation: 'Manager',
            phone: '123456789',
        });
    });

    it('restores a persisted session with the refresh token', async () => {
        mockGetTokens.mockResolvedValue({
            accessToken: null,
            refreshToken: 'refresh-token',
        });
        mockApiRequest.mockResolvedValue({
            success: true,
            authStatus: 'authenticated',
            tokens: {
                accessToken: 'new-access-token',
                refreshToken: 'new-refresh-token',
            },
            user: {
                id: 'user-2',
                name: 'Returning User',
                email: 'returning@example.com',
                role: 'user',
                emailVerified: true,
            },
        });

        await renderProvider();

        expect(mockApiRequest).toHaveBeenCalledWith('/auth/refresh', {
            method: 'POST',
            body: { refreshToken: 'refresh-token' },
            auth: false,
        });
        expect(contextValue.authStatus).toBe('authenticated');
        expect(contextValue.authUser.email).toBe('returning@example.com');
    });

    it('requests and confirms a password reset code', async () => {
        mockApiRequest
            .mockResolvedValueOnce({
                success: true,
                message:
                    'If an account exists for this email, a reset code has been sent.',
            })
            .mockResolvedValueOnce({
                success: true,
                message: 'Reset code verified. Create a new password.',
            })
            .mockResolvedValueOnce({
                success: true,
                message: 'Password updated. Please sign in with your new password.',
            });

        await renderProvider();

        let requestResponse;
        await act(async () => {
            requestResponse =
                await contextValue.resetPassword('missing@example.com');
        });

        let verifyResponse;
        await act(async () => {
            verifyResponse = await contextValue.verifyPasswordResetCode(
                'missing@example.com',
                '123456'
            );
        });

        let confirmResponse;
        await act(async () => {
            confirmResponse = await contextValue.confirmPasswordReset(
                'missing@example.com',
                '123456',
                'Password1!'
            );
        });

        expect(requestResponse.success).toBe(true);
        expect(verifyResponse.success).toBe(true);
        expect(confirmResponse.success).toBe(true);
        expect(mockApiRequest).toHaveBeenNthCalledWith(
            1,
            '/auth/forgot-password',
            {
                method: 'POST',
                body: { email: 'missing@example.com' },
                auth: false,
            }
        );
        expect(mockApiRequest).toHaveBeenNthCalledWith(
            2,
            '/auth/verify-reset-code',
            {
                method: 'POST',
                body: {
                    email: 'missing@example.com',
                    code: '123456',
                },
                auth: false,
            }
        );
        expect(mockApiRequest).toHaveBeenNthCalledWith(
            3,
            '/auth/reset-password',
            {
                method: 'POST',
                body: {
                    email: 'missing@example.com',
                    code: '123456',
                    password: 'Password1!',
                },
                auth: false,
            }
        );
    });

    it('updates profile settings', async () => {
        mockApiRequest.mockResolvedValue({
            success: true,
            message: 'Settings updated successfully.',
            user: {
                id: 'user-settings',
                name: 'Settings User',
                email: 'settings@example.com',
                role: 'user',
                notificationsPaused: true,
                themePreference: 'dark',
            },
        });

        await renderProvider();

        let response;
        await act(async () => {
            response = await contextValue.updateSettings({
                notificationsPaused: true,
                themePreference: 'dark',
            });
        });

        expect(response.success).toBe(true);
        expect(contextValue.userProfile).toMatchObject({
            notificationsPaused: true,
            themePreference: 'dark',
        });
        expect(mockApiRequest).toHaveBeenCalledWith('/users/me/settings', {
            method: 'PATCH',
            body: {
                notificationsPaused: true,
                themePreference: 'dark',
            },
        });
    });
});
