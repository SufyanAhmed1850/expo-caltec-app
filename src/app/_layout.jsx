import React from 'react';
import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';

import LoadingScreen from '@components/LoadingScreen';
import { AuthContextProvider, useAuth } from '@context/authContext';
import { EnquiryProvider } from '@context/enquiryContext';
import { PushNotificationProvider } from '@context/pushNotificationContext';
import { ServiceProvider } from '@context/serviceContext';
import Toast from 'react-native-toast-message';

const RootNavigator = () => {
    const { authStatus } = useAuth();

    if (authStatus === 'loading') {
        return <LoadingScreen />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />

            <Stack.Protected guard={authStatus === 'authenticated'}>
                <Stack.Screen name='(app)' />
            </Stack.Protected>

            <Stack.Protected guard={authStatus !== 'authenticated'}>
                <Stack.Screen name='(auth)' />
            </Stack.Protected>
        </Stack>
    );
};

const RootLayout = () => {
    return (
        <AuthContextProvider>
            <ServiceProvider>
                <EnquiryProvider>
                    <PushNotificationProvider>
                        <PaperProvider>
                            <RootNavigator />
                            <Toast />
                        </PaperProvider>
                    </PushNotificationProvider>
                </EnquiryProvider>
            </ServiceProvider>
        </AuthContextProvider>
    );
};

export default RootLayout;
