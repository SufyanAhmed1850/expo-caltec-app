import React from 'react';
import { Text, View } from 'react-native';
import {
    IconHome,
    IconServices,
    IconEnquiry,
    IconProfile,
} from '@constants/SvgIcons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    height: 72,
                },
                tabBarActiveTintColor: '#000000',
                tabBarInactiveTintColor: '#9e9e9e',
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View
                            style={{
                                flex: 1,
                                aspectRatio: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <IconHome
                                width={24}
                                height={24}
                                fill={focused ? '#212121' : 'none'}
                            />
                            <Text style={{ color, fontSize: 12, marginTop: 2 }}>
                                Home
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name='services/index'
                options={{
                    title: 'Services',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View
                            style={{
                                flex: 1,
                                aspectRatio: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <IconServices
                                width={24}
                                height={24}
                                fill={focused ? '#212121' : 'none'}
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
                        <View
                            style={{
                                flex: 1,
                                aspectRatio: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <IconEnquiry
                                width={24}
                                height={24}
                                fill={focused ? '#212121' : 'none'}
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
                        <View
                            style={{
                                flex: 1,
                                aspectRatio: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <IconProfile
                                width={24}
                                height={24}
                                fill={focused ? '#212121' : 'none'}
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
