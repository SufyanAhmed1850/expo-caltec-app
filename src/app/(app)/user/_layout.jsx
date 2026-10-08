import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import {
    AppTypography,
    getAppPalette,
    resolveThemePreference,
} from '@constants/appTheme';
import { useAuth } from '@context/authContext';

const UsersStack = () => {
    const systemScheme = useColorScheme();
    const { userProfile } = useAuth();
    const resolvedTheme = resolveThemePreference(
        userProfile?.themePreference || 'system',
        systemScheme
    );
    const colors = getAppPalette(resolvedTheme);

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.card },
                headerTitleAlign: 'center',
                headerTintColor: colors.text,
                animation: 'slide_from_right',
                navigationBarColor: colors.card,
                headerTitleStyle: AppTypography.cardTitle,
            }}
        >
            <Stack.Screen
                name='index'
                options={{ headerShown: false, title: 'Profile' }}
            />
            <Stack.Screen
                name='usersList'
                options={{ headerShown: false, title: 'Users' }}
            />
        </Stack>
    );
};

export default UsersStack;
