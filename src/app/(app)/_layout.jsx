import React from 'react';
import { StyleSheet, useColorScheme, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    IconHome,
    IconServices,
    IconEnquiry,
    IconProfile,
} from '@constants/SvgIcons';
import { useAuth } from '@context/authContext';
import { Tabs } from 'expo-router';
import {
    AppTypography,
    getAppPalette,
    resolveThemePreference,
} from '@constants/appTheme';

const TAB_ICON_SIZE = 24;

const renderTabIcon = (Icon, getActiveInnerStroke) => {
    const TabIcon = ({ color, focused }) => (
        <Icon
            width={TAB_ICON_SIZE}
            height={TAB_ICON_SIZE}
            fill={focused ? color : undefined}
            pathStroke={color}
            innerStroke={focused ? getActiveInnerStroke?.() || color : color}
            secondaryStroke={focused ? getActiveInnerStroke?.() || color : color}
        />
    );

    TabIcon.displayName = 'TabIcon';
    return TabIcon;
};

export default function TabsLayout() {
    const insets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();
    const systemScheme = useColorScheme();
    const { userProfile } = useAuth();

    const isCompactWidth = width < 360;
    const isShortScreen = height < 700;
    const bottomPadding = Math.max(insets.bottom, 8);
    const themePreference = userProfile?.themePreference || 'system';
    const resolvedTheme = resolveThemePreference(themePreference, systemScheme);
    const tabColors = getAppPalette(resolvedTheme);
    const inactiveTint = resolvedTheme === 'dark' ? '#7F8CA3' : '#7C8491';
    const activeIconInnerStroke = tabColors.card;

    return (
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: tabColors.page,
                },
                headerShadowVisible: false,
                headerTintColor: tabColors.text,
                headerTitleStyle: {
                    color: tabColors.text,
                    ...AppTypography.cardTitle,
                },
                headerTitleAlign: 'center',
                tabBarStyle: {
                    backgroundColor: tabColors.card,
                    height: (isShortScreen ? 56 : 60) + bottomPadding,
                    paddingTop: isShortScreen ? 6 : 7,
                    paddingBottom: bottomPadding,
                    borderTopWidth: 1,
                    borderTopColor: tabColors.border,
                    shadowOpacity: 0,
                    shadowRadius: 0,
                    elevation: 0,
                },
                tabBarItemStyle: styles.tabItem,
                tabBarIconStyle: styles.tabIcon,
                tabBarLabelPosition: 'below-icon',
                tabBarLabelStyle: [
                    styles.tabLabel,
                    isCompactWidth && styles.compactTabLabel,
                ],
                tabBarHideOnKeyboard: true,
                tabBarActiveTintColor: tabColors.primary,
                tabBarInactiveTintColor: inactiveTint,
            }}
        >
            <Tabs.Screen
                name='home'
                options={{
                    title: 'Home',
                    tabBarIcon: renderTabIcon(IconHome),
                }}
            />
            <Tabs.Screen
                name='services'
                options={{
                    headerShown: false,
                    title: 'Services',
                    tabBarIcon: renderTabIcon(
                        IconServices,
                        () => activeIconInnerStroke
                    ),
                }}
            />
            <Tabs.Screen
                name='enquiry'
                options={{
                    headerShown: false,
                    title: 'Enquiry',
                    tabBarIcon: renderTabIcon(
                        IconEnquiry,
                        () => activeIconInnerStroke
                    ),
                }}
            />
            <Tabs.Screen
                name='user'
                options={{
                    headerShown: false,
                    title: 'Profile',
                    tabBarIcon: renderTabIcon(IconProfile),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabItem: {
        minWidth: 0,
        paddingHorizontal: 2,
    },
    tabIcon: {
        marginTop: 2,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '700',
        lineHeight: 13,
        marginTop: 3,
        includeFontPadding: false,
        textAlign: 'center',
    },
    compactTabLabel: {
        fontSize: 10,
        lineHeight: 12,
    },
});
