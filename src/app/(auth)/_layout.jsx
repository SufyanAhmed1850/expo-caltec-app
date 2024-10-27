import React from 'react';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@constants/Colors';

const AuthLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: Colors.light.red90 },
                headerTintColor: '#fff',
                animation: 'slide_from_right',
                navigationBarColor: Colors.light.background,
                headerTitleStyle: { fontWeight: 'bold' },
                headerTitleAlign: 'center',
                headerLeft: ({ canGoBack }) =>
                    canGoBack ? (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons
                                name='chevron-back'
                                size={24}
                                color='#fff'
                            />
                        </TouchableOpacity>
                    ) : null,
            }}
        >
            <Stack.Screen
                name='signIn/index'
                options={{
                    title: 'Sign In',
                }}
            />
            <Stack.Screen
                name='signUp/index'
                options={{
                    title: 'Sign Up',
                }}
            />
        </Stack>
    );
};

export default AuthLayout;
