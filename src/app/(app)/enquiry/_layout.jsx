import React from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';
import { Stack, router } from 'expo-router';

import { useAuth } from '@context/authContext';
import {
    AppTypography,
    getAppPalette,
    resolveThemePreference,
} from '@constants/appTheme';
import { IconSolarArrowLeftAlt } from '@constants/SvgIcons';

const EnquiryStack = () => {
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
                headerStyle: { backgroundColor: colors.page },
                headerShadowVisible: false,
                headerTitleAlign: 'center',
                headerTintColor: colors.text,
                animation: 'slide_from_right',
                navigationBarColor: colors.page,
                contentStyle: { backgroundColor: colors.page },
                headerTitleStyle: {
                    color: colors.text,
                    ...AppTypography.cardTitle,
                },
                headerLeft: ({ canGoBack }) =>
                    canGoBack ? (
                        <TouchableOpacity
                            accessibilityRole='button'
                            accessibilityLabel='Go back'
                            activeOpacity={0.78}
                            onPress={() => router.back()}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: colors.card,
                            }}
                        >
                            <IconSolarArrowLeftAlt
                                width={22}
                                height={22}
                                pathStroke={colors.text}
                            />
                        </TouchableOpacity>
                    ) : null,
            }}
        >
            <Stack.Screen name='index' options={{ title: 'Enquiries' }} />
            <Stack.Screen
                name='newEnquiry'
                options={{ title: 'Create enquiry' }}
            />
            <Stack.Screen name='[enquiry]' options={{ title: 'Enquiry' }} />
        </Stack>
    );
};

export default EnquiryStack;
