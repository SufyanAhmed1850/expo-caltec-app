import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { useAuth } from '@context/authContext';
import { getAppPalette, resolveThemePreference } from '@constants/appTheme';

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext(Navigator);

const PillTabBar = ({ colors, descriptors, navigation, state }) => (
    <View style={[styles.tabBarWrap, { backgroundColor: colors.page }]}>
        <View
            style={[
                styles.tabTrack,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                },
            ]}
        >
            {state.routes.map((route, index) => {
                const focused = state.index === index;
                const options = descriptors[route.key]?.options || {};
                const label = options.title || route.name;

                return (
                    <Pressable
                        key={route.key}
                        accessibilityRole='tab'
                        accessibilityState={focused ? { selected: true } : undefined}
                        onPress={() => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!focused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params);
                            }
                        }}
                        style={({ pressed }) => [
                            styles.tabPill,
                            focused && { backgroundColor: colors.primary },
                            pressed && styles.pressed,
                        ]}
                    >
                        <Text
                            style={[
                                styles.label,
                                {
                                    color: focused ? colors.white : colors.muted,
                                },
                            ]}
                        >
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    </View>
);

const Layout = () => {
    const { userProfile } = useAuth();
    const systemScheme = useColorScheme();
    const resolvedTheme = resolveThemePreference(
        userProfile?.themePreference || 'system',
        systemScheme
    );
    const colors = getAppPalette(resolvedTheme);

    return (
        <MaterialTopTabs
            tabBar={(props) => <PillTabBar {...props} colors={colors} />}
            screenOptions={{
                lazy: true,
                sceneStyle: {
                    backgroundColor: colors.page,
                },
            }}
        >
            <MaterialTopTabs.Screen name='index' options={{ title: 'Overview' }} />
            <MaterialTopTabs.Screen
                name='contact'
                options={{ title: 'Contact' }}
            />
        </MaterialTopTabs>
    );
};

const styles = StyleSheet.create({
    tabBarWrap: {
        paddingHorizontal: 18,
        paddingTop: 10,
        paddingBottom: 10,
    },
    tabTrack: {
        height: 44,
        borderRadius: 999,
        borderWidth: 1,
        padding: 4,
        flexDirection: 'row',
        gap: 4,
    },
    tabPill: {
        flex: 1,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'capitalize',
    },
    pressed: {
        opacity: 0.86,
    },
});

export default Layout;
