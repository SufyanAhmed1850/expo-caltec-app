import { router, Stack } from 'expo-router';
import React from 'react';
import { Colors } from '@constants/Colors';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ServicesStack = () => {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: Colors.light.red90 },
                headerTitleAlign: 'center',
                headerTintColor: '#fff',
                animation: 'slide_from_right',
                navigationBarColor: Colors.light.background,
                headerTitleStyle: { fontWeight: 'bold' },
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
            <Stack.Screen name='index' options={{ title: 'Enquiries' }} />
            <Stack.Screen
                name='newEnquiry'
                options={{ title: 'Create An Enquiry' }}
            />
            <Stack.Screen name='[enquiry]' options={{ title: 'Enquiry' }} />
        </Stack>
    );
};

export default ServicesStack;
