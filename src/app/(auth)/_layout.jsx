import React from 'react';
import {
    Image,
    StyleSheet,
    useColorScheme,
    useWindowDimensions,
    View,
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, usePathname, useRouter } from 'expo-router';

import { getAppPalette } from '@constants/appTheme';
import { IconSolarArrowLeft } from '@constants/SvgIcons';
import { useAuth } from '@context/authContext';

const AuthLayout = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuth();
    const systemScheme = useColorScheme();
    const { height, width } = useWindowDimensions();
    const colors = getAppPalette(systemScheme === 'dark' ? 'dark' : 'light');
    const isCompactWidth = width < 370;
    const isShortScreen = height < 720;
    const showBack = !pathname.includes('/signIn');

    const handleBack = async () => {
        if (pathname.includes('/verify-email')) {
            await logout();
            router.replace('/(auth)/signIn');
            return;
        }

        router.replace('/(auth)/signIn');
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.page }]}>
            <View
                style={[
                    styles.header,
                    isShortScreen && styles.headerShort,
                ]}
            >
                <View style={styles.headerRow}>
                    {showBack ? (
                        <TouchableRipple
                            onPress={handleBack}
                            style={[
                                styles.backButton,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                    shadowColor: colors.shadow,
                                    shadowOpacity: colors.isDark ? 0.28 : 0.16,
                                },
                            ]}
                            borderless
                            rippleColor={
                                colors.isDark
                                    ? 'rgba(255,255,255,0.08)'
                                    : 'rgba(73, 99, 186, 0.12)'
                            }
                        >
                            <IconSolarArrowLeft
                                size={21}
                                width={21}
                                height={21}
                                pathStroke={colors.text}
                            />
                        </TouchableRipple>
                    ) : (
                        <View style={styles.backButtonSpacer} />
                    )}

                    <Image
                        source={require('@assets/images/logo.png')}
                        style={[
                            styles.logo,
                            isCompactWidth && styles.logoCompact,
                        ]}
                        resizeMode='contain'
                    />

                    <View style={styles.backButtonSpacer} />
                </View>
            </View>

            <View style={styles.stackArea}>
                <Stack
                    screenOptions={{
                        animation: 'none',
                        animationTypeForReplace: 'pop',
                        headerShown: false,
                        navigationBarColor: colors.page,
                        contentStyle: { backgroundColor: colors.page },
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        width: '100%',
        maxWidth: 440,
        alignSelf: 'center',
        paddingHorizontal: 24,
        paddingTop: 34,
        paddingBottom: 22,
    },
    headerShort: {
        paddingTop: 18,
        paddingBottom: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
        elevation: 3,
    },
    backButtonSpacer: {
        width: 44,
        height: 44,
    },
    logo: {
        width: 150,
        height: 55,
    },
    logoCompact: {
        width: 132,
        height: 48,
    },
    stackArea: {
        flex: 1,
    },
});

export default AuthLayout;
