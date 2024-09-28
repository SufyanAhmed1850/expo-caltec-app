import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
    IconHome,
    IconServices,
    IconEnquiry,
    IconProfile,
} from '@constants/SvgIcons';
import { Colors } from '@constants/Colors';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    height: 72,
                },
                tabBarHideOnKeyboard: true,
                tabBarActiveTintColor: Colors.light.red90,
                tabBarInactiveTintColor: '#9e9e9e',
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={styles.tab}>
                            <IconHome
                                width={24}
                                height={24}
                                fill={focused ? Colors.light.red90 : '#9e9e9e'}
                            />
                            <Text style={{ color, fontSize: 12, marginTop: 2 }}>
                                Home
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name='services'
                options={{
                    headerShown: false,
                    title: 'Services',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={styles.tab}>
                            <IconServices
                                width={24}
                                height={24}
                                fill={focused ? Colors.light.red90 : '#9e9e9e'}
                            />
                            <Text style={{ color, fontSize: 12, marginTop: 2 }}>
                                Services
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name='enquiry/index'
                options={{
                    title: 'Enquiry',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={styles.tab}>
                            <IconEnquiry
                                width={24}
                                height={24}
                                fill={focused ? Colors.light.red90 : '#9e9e9e'}
                            />
                            <Text style={{ color, fontSize: 12, marginTop: 2 }}>
                                Enquiry
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name='user/index'
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={styles.tab}>
                            <IconProfile
                                width={24}
                                height={24}
                                fill={focused ? Colors.light.red90 : '#9e9e9e'}
                            />
                            <Text style={{ color, fontSize: 12, marginTop: 2 }}>
                                Profile
                            </Text>
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
