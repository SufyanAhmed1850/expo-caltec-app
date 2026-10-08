import { router } from 'expo-router';
import Constants from 'expo-constants';
import { useCallback, useEffect, useRef } from 'react';

import { useAuth } from '@context/authContext';
import {
    registerForDevicePushTokenAsync,
    syncPushTokenWithServer,
} from '@/src/lib/pushNotifications';
import {
    clearStoredPushToken,
    getStoredPushToken,
    unregisterPushTokenOnServer,
} from '@/src/lib/pushTokenRegistration';

const buildNotificationRoute = (notificationData = {}) => {
    const enquiryNumber =
        typeof notificationData.enquiryNumber === 'string'
            ? notificationData.enquiryNumber.trim()
            : '';

    if (enquiryNumber) {
        return {
            pathname: '/(app)/enquiry/[enquiry]',
            params: { enquiry: enquiryNumber },
        };
    }

    return null;
};

const isExpoGo = Constants.appOwnership === 'expo';

const getNotificationsAsync = async () => import('expo-notifications');

const PushNotificationProviderInner = ({ children }) => {
    const { authStatus, userProfile } = useAuth();
    const handledResponseIds = useRef(new Set());

    const handleNotificationResponse = useCallback((response) => {
        const identifier =
            response?.notification?.request?.identifier ||
            response?.notification?.request?.content?.data?.id;

        if (identifier && handledResponseIds.current.has(identifier)) {
            return;
        }

        if (identifier) {
            handledResponseIds.current.add(identifier);
        }

        const route = buildNotificationRoute(
            response?.notification?.request?.content?.data
        );

        if (route && authStatus === 'authenticated') {
            router.navigate(route);
        }
    }, [authStatus]);

    useEffect(() => {
        let cancelled = false;

        const syncPushToken = async () => {
            if (authStatus !== 'authenticated' || !userProfile?.id) {
                handledResponseIds.current.clear();
                return;
            }

            try {
                const { token } = await registerForDevicePushTokenAsync();

                if (cancelled) {
                    return;
                }

                if (!token) {
                    const previousToken = await getStoredPushToken();
                    if (previousToken) {
                        await unregisterPushTokenOnServer(previousToken);
                    }
                    await clearStoredPushToken();
                    return;
                }

                await syncPushTokenWithServer(token);
            } catch (error) {
                console.error('Failed to register push notifications:', error);
            }
        };

        syncPushToken();

        let tokenSubscription;

        getNotificationsAsync()
            .then((Notifications) => {
                if (cancelled) {
                    return;
                }

                tokenSubscription = Notifications.addPushTokenListener(
                    async ({ data }) => {
                        try {
                            await syncPushTokenWithServer(data);
                        } catch (error) {
                            console.error(
                                'Failed to sync refreshed push token:',
                                error
                            );
                        }
                    }
                );
            })
            .catch((error) => {
                console.error('Failed to subscribe to push token changes:', error);
            });

        return () => {
            cancelled = true;
            tokenSubscription?.remove();
        };
    }, [authStatus, userProfile?.id]);

    useEffect(() => {
        let mounted = true;

        let responseSubscription;

        getNotificationsAsync()
            .then((Notifications) => {
                if (!mounted) {
                    return;
                }

                Notifications.getLastNotificationResponseAsync()
                    .then((response) => {
                        if (mounted && response) {
                            handleNotificationResponse(response);
                        }
                    })
                    .catch((error) => {
                        console.error(
                            'Failed to restore notification response:',
                            error
                        );
                    });

                responseSubscription =
                    Notifications.addNotificationResponseReceivedListener(
                        handleNotificationResponse
                    );
            })
            .catch((error) => {
                console.error('Failed to subscribe to notification responses:', error);
            });

        return () => {
            mounted = false;
            responseSubscription?.remove();
        };
    }, [handleNotificationResponse]);

    return children;
};

export const PushNotificationProvider = ({ children }) => {
    if (isExpoGo) {
        return children;
    }

    return (
        <PushNotificationProviderInner>{children}</PushNotificationProviderInner>
    );
};
