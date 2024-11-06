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
                headerStyle: {
                    backgroundColor: Colors.light.red90,
                },
                headerTintColor: Colors.light.background,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerTitleAlign: 'center',
                tabBarStyle: {
                    backgroundColor: Colors.light.background,
                    height: 72,
                    borderTopWidth: 1,
                    borderTopColor: Colors.light.black10,
                },
                tabBarHideOnKeyboard: true,
                tabBarActiveTintColor: Colors.light.red90,
                tabBarInactiveTintColor: Colors.light.black30,
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name='home/index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={styles.tab}>
                            <IconHome
                                width={24}
                                height={24}
                                fill={focused && Colors.light.red90}
                                pathStroke={
                                    focused ? Colors.light.red90 : '#9E9E9E'
                                }
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
                                fill={focused && Colors.light.red90}
                                pathStroke={
                                    focused ? Colors.light.red90 : '#9E9E9E'
                                }
                            />
                            <Text style={{ color, fontSize: 12, marginTop: 2 }}>
                                Services
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name='enquiry'
                options={{
                    headerShown: false,
                    title: 'Enquiry',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={styles.tab}>
                            <IconEnquiry
                                width={24}
                                height={24}
                                fill={focused && Colors.light.red90}
                                pathStroke={
                                    focused ? Colors.light.red90 : '#9E9E9E'
                                }
                            />
                            <Text style={{ color, fontSize: 12, marginTop: 2 }}>
                                Enquiry
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name='user'
                options={{
                    headerShown: false,
                    title: 'Profile',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={styles.tab}>
                            <IconProfile
                                width={24}
                                height={24}
                                fill={focused && Colors.light.red90}
                                pathStroke={
                                    focused ? Colors.light.red90 : '#9E9E9E'
                                }
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
