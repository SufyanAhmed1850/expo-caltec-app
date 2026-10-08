import React from 'react';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';

import { useAuth } from '@context/authContext';
import {
    getAppPalette,
    resolveThemePreference,
} from '@constants/appTheme';

const ServicesStack = () => {
    const systemScheme = useColorScheme();
    const { userProfile } = useAuth();
    const resolvedTheme = resolveThemePreference(
        userProfile?.themePreference,
        systemScheme
    );
    const colors = getAppPalette(resolvedTheme);

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: colors.page },
                navigationBarColor: colors.page,
            }}
        >
            <Stack.Screen name='index' />
            <Stack.Screen name='[category]' />
        </Stack>
    );
};

export default ServicesStack;
