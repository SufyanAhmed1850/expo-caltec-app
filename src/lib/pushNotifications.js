import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

import {
    getStoredPushToken,
    registerPushTokenOnServer,
    storePushToken,
    unregisterPushTokenOnServer,
} from './pushTokenRegistration';

export const DEFAULT_NOTIFICATION_CHANNEL_ID = 'default';

let notificationsModulePromise;

const getNotificationsAsync = async () => {
    if (!notificationsModulePromise) {
        notificationsModulePromise = import('expo-notifications').then(
            (Notifications) => {
                Notifications.setNotificationHandler({
                    handleNotification: async () => ({
                        shouldPlaySound: true,
                        shouldSetBadge: false,
                        shouldShowBanner: true,
                        shouldShowList: true,
                    }),
                });

                return Notifications;
            }
        );
    }

    return notificationsModulePromise;
};

const getProjectId = () =>
    Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;

const ensureAndroidChannelAsync = async (Notifications) => {
    if (Platform.OS !== 'android') {
        return;
    }

    await Notifications.setNotificationChannelAsync(
        DEFAULT_NOTIFICATION_CHANNEL_ID,
        {
            name: 'General',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#E85D74',
            lockscreenVisibility:
                Notifications.AndroidNotificationVisibility.PUBLIC,
            showBadge: true,
        }
    );
};

const getPermissionStatusAsync = async (Notifications) => {
    const existingPermissions = await Notifications.getPermissionsAsync();
    let finalStatus = existingPermissions.status;

    if (finalStatus !== 'granted') {
        const requestedPermissions = await Notifications.requestPermissionsAsync({
            ios: {
                allowAlert: true,
                allowBadge: true,
                allowSound: true,
            },
        });
        finalStatus = requestedPermissions.status;
    }

    return finalStatus;
};

export const registerForDevicePushTokenAsync = async () => {
    if (Constants.appOwnership === 'expo') {
        return { token: null, reason: 'expo-go-unsupported' };
    }

    const Notifications = await getNotificationsAsync();

    await ensureAndroidChannelAsync(Notifications);

    const permissionStatus = await getPermissionStatusAsync(Notifications);
    if (permissionStatus !== 'granted') {
        return { token: null, reason: 'permission-denied' };
    }

    if (!Device.isDevice) {
        return { token: null, reason: 'physical-device-required' };
    }

    const projectId = getProjectId();
    if (!projectId) {
        return { token: null, reason: 'missing-project-id' };
    }

    const token = (
        await Notifications.getExpoPushTokenAsync({
            projectId,
        })
    ).data;

    return { token, reason: null };
};

const registerTokenWithMetadata = async (token) => {
    if (!token) {
        return;
    }

    await registerPushTokenOnServer({
        token,
        platform: Platform.OS,
        deviceName: Device.deviceName || '',
    });
};

export const syncPushTokenWithServer = async (token) => {
    if (!token) {
        return;
    }

    const previousToken = await getStoredPushToken();

    if (previousToken && previousToken !== token) {
        try {
            await unregisterPushTokenOnServer(previousToken);
        } catch (error) {
            console.error('Failed to unregister stale push token:', error);
        }
    }

    await registerTokenWithMetadata(token);
    await storePushToken(token);
};
