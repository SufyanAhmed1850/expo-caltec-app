import { Stack } from 'expo-router';
import React from 'react';

const ServicesStack = () => {
    return (
        <Stack>
            <Stack.Screen name='index' options={{ title: 'Services' }} />
        </Stack>
    );
};

export default ServicesStack;
