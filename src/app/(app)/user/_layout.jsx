import { Stack } from 'expo-router';
import React from 'react';

const UsersStack = () => {
    return (
        <Stack>
            <Stack.Screen name='index' options={{ title: 'Profile' }} />
            <Stack.Screen name='usersList' options={{ title: 'User List' }} />
        </Stack>
    );
};

export default UsersStack;
