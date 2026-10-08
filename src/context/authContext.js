import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import { apiRequest } from '@/src/lib/apiClient';
import { unregisterStoredPushTokenAsync } from '@/src/lib/pushTokenRegistration';
import { clearTokens, getTokens, saveTokens } from '@/src/lib/tokenStorage';
import { connectSocket, disconnectSocket } from '@/src/lib/socketClient';
import {
    getFriendlyAuthErrorMessage,
    getLocalPasswordValidationMessage,
    getRedirectPathForAuthStatus,
    isProfileComplete,
    normalizeEmail,
    normalizeName,
    PENDING_VERIFICATION_EMAIL_KEY,
} from '@context/authUtils';

export const AuthContext = createContext();

const DEFAULT_LOADING_STATE = {
    login: false,
    register: false,
    logout: false,
    refreshProfile: false,
    updateProfile: false,
    updateSettings: false,
    resetPassword: false,
    confirmPasswordReset: false,
    verifyPasswordResetCode: false,
    resendVerification: false,
    verifyEmail: false,
    checkVerification: false,
};

const normalizeUser = (user = null) => {
    if (!user) {
        return null;
    }

    const companyName =
        typeof user.companyName === 'string' ? user.companyName.trim() : '';
    const designation =
        typeof user.designation === 'string' ? user.designation.trim() : '';
    const phone = typeof user.phone === 'string' ? user.phone.trim() : '';
    const uid = user.uid || user.id || user._id || '';

    return {
        ...user,
        id: uid,
        uid,
        userId: uid,
        name: normalizeName(user.name || ''),
        email: normalizeEmail(user.email || ''),
        role: user.role === 'admin' ? 'admin' : 'user',
        emailVerified: Boolean(user.emailVerified),
        profileCompleted: Boolean(
            user.profileCompleted ??
                isProfileComplete({
                    companyName,
                    designation,
                    phone,
                })
        ),
        companyName,
        designation,
        phone,
        profileImage: user.profileImage || null,
        notificationsPaused: Boolean(user.notificationsPaused),
        themePreference: ['system', 'light', 'dark'].includes(
            user.themePreference
        )
            ? user.themePreference
            : 'system',
    };
};

const getImageName = (uri) => {
    const fallback = `profile-${Date.now()}.jpg`;
    return uri?.split('/').pop()?.split('?')[0] || fallback;
};

const getImageType = (uri) => {
    const extension = getImageName(uri).split('.').pop()?.toLowerCase();

    if (extension === 'png') {
        return 'image/png';
    }

    if (extension === 'webp') {
        return 'image/webp';
    }

    return 'image/jpeg';
};

export const AuthContextProvider = ({ children }) => {
    const [authStatus, setAuthStatus] = useState('loading');
    const [authUser, setAuthUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [pendingVerificationEmail, setPendingVerificationEmail] =
        useState('');
    const [isLoading, setIsLoading] = useState(DEFAULT_LOADING_STATE);

    const setLoadingFlag = (key, value) => {
        setIsLoading((prev) => ({ ...prev, [key]: value }));
    };

    const persistPendingVerificationEmail = useCallback(async (email) => {
        const normalizedEmail = normalizeEmail(email);
        setPendingVerificationEmail(normalizedEmail);

        try {
            if (normalizedEmail) {
                await AsyncStorage.setItem(
                    PENDING_VERIFICATION_EMAIL_KEY,
                    normalizedEmail
                );
            } else {
                await AsyncStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY);
            }
        } catch (error) {
            console.error('Error persisting pending verification email:', error);
        }
    }, []);

    const setAuthenticatedSession = useCallback(
        async ({ user, tokens }) => {
            const normalizedUser = normalizeUser(user);
            if (tokens) {
                await saveTokens(tokens);
            }

            setAuthUser(normalizedUser);
            setUserProfile(normalizedUser);
            setAuthStatus('authenticated');
            await persistPendingVerificationEmail('');
            await connectSocket();

            return normalizedUser;
        },
        [persistPendingVerificationEmail]
    );

    const clearAuthenticatedSession = useCallback(async () => {
        await clearTokens();
        disconnectSocket();
        setAuthUser(null);
        setUserProfile(null);
        setAuthStatus('signedOut');
    }, []);

    useEffect(() => {
        const bootstrapSession = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem(
                    PENDING_VERIFICATION_EMAIL_KEY
                );
                if (savedEmail) {
                    setPendingVerificationEmail(savedEmail);
                }

                const { refreshToken } = await getTokens();
                if (!refreshToken) {
                    setAuthStatus(savedEmail ? 'unverified' : 'signedOut');
                    return;
                }

                const response = await apiRequest('/auth/refresh', {
                    method: 'POST',
                    body: { refreshToken },
                    auth: false,
                });
                await setAuthenticatedSession(response);
            } catch (error) {
                console.error('Error restoring auth session:', error);
                await clearAuthenticatedSession();
            }
        };

        bootstrapSession();
    }, [clearAuthenticatedSession, setAuthenticatedSession]);

    const refreshProfile = async () => {
        try {
            setLoadingFlag('refreshProfile', true);
            const response = await apiRequest('/users/me');
            const profile = normalizeUser(response.user);
            setAuthUser(profile);
            setUserProfile(profile);

            return { success: true, msg: 'Profile refreshed successfully.' };
        } catch (error) {
            return {
                success: false,
                msg: getFriendlyAuthErrorMessage(error),
            };
        } finally {
            setLoadingFlag('refreshProfile', false);
        }
    };

    const login = async (email, password) => {
        const normalizedEmail = normalizeEmail(email);

        try {
            setLoadingFlag('login', true);
            const response = await apiRequest('/auth/login', {
                method: 'POST',
                body: { email: normalizedEmail, password },
                auth: false,
            });

            if (response.authStatus === 'unverified') {
                await persistPendingVerificationEmail(normalizedEmail);
                setAuthUser({ email: normalizedEmail });
                setUserProfile(null);
                setAuthStatus('unverified');
                return {
                    success: false,
                    nextStep: 'verifyEmail',
                    msg: response.message || 'Verify your email before accessing the app.',
                };
            }

            await setAuthenticatedSession(response);
            return { success: true, nextStep: 'authenticated' };
        } catch (error) {
            return {
                success: false,
                msg: getFriendlyAuthErrorMessage(error, 'login'),
            };
        } finally {
            setLoadingFlag('login', false);
        }
    };

    const logout = async () => {
        try {
            setLoadingFlag('logout', true);
            const { refreshToken } = await getTokens();

            await unregisterStoredPushTokenAsync().catch((error) => {
                console.error('Error unregistering push token during logout:', error);
            });

            if (refreshToken) {
                await apiRequest('/auth/logout', {
                    method: 'POST',
                    body: { refreshToken },
                });
            }

            await clearAuthenticatedSession();
            await persistPendingVerificationEmail('');

            return { success: true };
        } catch (error) {
            await clearAuthenticatedSession();
            return {
                success: false,
                msg: getFriendlyAuthErrorMessage(error),
                error,
            };
        } finally {
            setLoadingFlag('logout', false);
        }
    };

    const register = async (name, email, password) => {
        const normalizedName = normalizeName(name);
        const normalizedEmail = normalizeEmail(email);
        const passwordMessage = getLocalPasswordValidationMessage(password);

        if (passwordMessage) {
            return { success: false, msg: passwordMessage };
        }

        try {
            setLoadingFlag('register', true);
            const response = await apiRequest('/auth/register', {
                method: 'POST',
                body: {
                    name: normalizedName,
                    email: normalizedEmail,
                    password,
                },
                auth: false,
            });

            await persistPendingVerificationEmail(normalizedEmail);
            setAuthUser({ email: normalizedEmail });
            setUserProfile(null);
            setAuthStatus('unverified');

            return {
                success: true,
                nextStep: 'verifyEmail',
                msg:
                    response.message ||
                    'Verification code sent. Please verify your email to continue.',
            };
        } catch (error) {
            return {
                success: false,
                msg: getFriendlyAuthErrorMessage(error, 'register'),
            };
        } finally {
            setLoadingFlag('register', false);
        }
    };

    const verifyEmail = async (email, code) => {
        const normalizedEmail = normalizeEmail(email || pendingVerificationEmail);

        try {
            setLoadingFlag('verifyEmail', true);
            const response = await apiRequest('/auth/verify-email', {
                method: 'POST',
                body: { email: normalizedEmail, code },
                auth: false,
            });

            await setAuthenticatedSession(response);
            return {
                success: true,
                verified: true,
                nextPath: getRedirectPathForAuthStatus('authenticated'),
            };
        } catch (error) {
            return {
                success: false,
                verified: false,
                msg: getFriendlyAuthErrorMessage(error, 'verifyEmail'),
            };
        } finally {
            setLoadingFlag('verifyEmail', false);
        }
    };

    const updateProfile = async (
        name,
        companyName,
        designation,
        phone,
        profileImage
    ) => {
        try {
            setLoadingFlag('updateProfile', true);

            const formData = new FormData();
            formData.append('name', normalizeName(name));
            formData.append('companyName', companyName.trim());
            formData.append('designation', designation.trim());
            formData.append('phone', phone.trim());

            if (
                profileImage &&
                profileImage !== userProfile?.profileImage &&
                !profileImage.startsWith('http')
            ) {
                formData.append('avatar', {
                    uri: profileImage,
                    name: getImageName(profileImage),
                    type: getImageType(profileImage),
                });
            }

            const response = await apiRequest('/users/me', {
                method: 'PATCH',
                formData,
            });
            const profile = normalizeUser(response.user);
            setAuthUser(profile);
            setUserProfile(profile);

            return {
                success: true,
                msg: response.message || 'Profile updated successfully.',
            };
        } catch (error) {
            console.error('Error updating profile:', error);
            return {
                success: false,
                msg: getFriendlyAuthErrorMessage(error),
            };
        } finally {
            setLoadingFlag('updateProfile', false);
        }
    };

    const updateSettings = async (settings = {}) => {
        try {
            setLoadingFlag('updateSettings', true);

            const response = await apiRequest('/users/me/settings', {
                method: 'PATCH',
                body: settings,
            });
            const profile = normalizeUser(response.user);
            setAuthUser(profile);
            setUserProfile(profile);

            return {
                success: true,
                msg: response.message || 'Settings updated successfully.',
                user: profile,
            };
        } catch (error) {
            return {
                success: false,
                msg: getFriendlyAuthErrorMessage(error),
            };
        } finally {
            setLoadingFlag('updateSettings', false);
        }
    };

    const resendVerificationEmail = async (email) => {
        const normalizedEmail = normalizeEmail(
            email || authUser?.email || pendingVerificationEmail
        );

        try {
            setLoadingFlag('resendVerification', true);
            const response = await apiRequest('/auth/resend-verification', {
                method: 'POST',
                body: { email: normalizedEmail },
                auth: false,
            });
            await persistPendingVerificationEmail(normalizedEmail);

            return {
                success: true,
                msg:
                    response.message ||
                    'If this account needs verification, a fresh code has been sent.',
            };
        } catch (error) {
            return {
                success: false,
                msg: getFriendlyAuthErrorMessage(error, 'verifyEmail'),
            };
        } finally {
            setLoadingFlag('resendVerification', false);
        }
    };

    const checkVerificationStatus = async () => ({
        success: false,
        verified: false,
        msg: 'Enter the verification code from your email to continue.',
    });

    const resetPassword = async (email) => {
        const normalizedEmail = normalizeEmail(email);

        try {
            setLoadingFlag('resetPassword', true);
            const response = await apiRequest('/auth/forgot-password', {
                method: 'POST',
                body: { email: normalizedEmail },
                auth: false,
            });
            return {
                success: true,
                msg:
                    response.message ||
                    'If an account exists for this email, a reset code has been sent.',
            };
        } catch (error) {
            return {
                success: false,
                msg: getFriendlyAuthErrorMessage(error, 'resetPassword'),
            };
        } finally {
            setLoadingFlag('resetPassword', false);
        }
    };

    const confirmPasswordReset = async (email, code, password) => {
        const normalizedEmail = normalizeEmail(email);
        const passwordMessage = getLocalPasswordValidationMessage(password);

        if (passwordMessage) {
            return { success: false, msg: passwordMessage };
        }

        try {
            setLoadingFlag('confirmPasswordReset', true);
            const response = await apiRequest('/auth/reset-password', {
                method: 'POST',
                body: { email: normalizedEmail, code, password },
                auth: false,
            });
            return {
                success: true,
                msg:
                    response.message ||
                    'Password updated. Please sign in with your new password.',
            };
        } catch (error) {
            return {
                success: false,
                msg: getFriendlyAuthErrorMessage(error, 'resetPassword'),
            };
        } finally {
            setLoadingFlag('confirmPasswordReset', false);
        }
    };

    const verifyPasswordResetCode = async (email, code) => {
        const normalizedEmail = normalizeEmail(email);

        try {
            setLoadingFlag('verifyPasswordResetCode', true);
            const response = await apiRequest('/auth/verify-reset-code', {
                method: 'POST',
                body: { email: normalizedEmail, code },
                auth: false,
            });

            return {
                success: true,
                msg:
                    response.message ||
                    'Reset code verified. Create a new password.',
            };
        } catch (error) {
            return {
                success: false,
                msg: getFriendlyAuthErrorMessage(error, 'verifyResetCode'),
            };
        } finally {
            setLoadingFlag('verifyPasswordResetCode', false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                authStatus,
                authUser,
                userProfile,
                pendingVerificationEmail,
                isLoading,
                login,
                logout,
                register,
                updateProfile,
                updateSettings,
                refreshProfile,
                resendVerificationEmail,
                checkVerificationStatus,
                verifyEmail,
                resetPassword,
                confirmPasswordReset,
                verifyPasswordResetCode,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error('useAuth must be wrapped inside AuthContextProvider');
    }
    return value;
};
