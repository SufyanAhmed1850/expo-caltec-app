import { Slot, Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { AuthContextProvider, useAuth } from '@context/authContext';

const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    const segment = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (typeof isAuthenticated == 'undefined') return;
        const inApp = segment[0] == 'home';
        if (isAuthenticated && !inApp) {
            // redirect to home
            router.replace('home');
        } else if (isAuthenticated == false) {
            // redirect to sign in
            router.replace('signUp');
        }
    }, [isAuthenticated]);

    return <Slot />;
};

const RootLayout = () => {
    return (
        <AuthContextProvider>
            <MainLayout />
        </AuthContextProvider>
    );
};

export default RootLayout;
