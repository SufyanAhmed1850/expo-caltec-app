import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { AuthContextProvider, useAuth } from '@context/authContext';
import { ServiceProvider } from '@context/serviceContext';
import { EnquiryProvider } from '@context/enquiryContext';
import LoadingScreen from '@components/LoadingScreen';

const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (typeof isAuthenticated === 'undefined') return;

        if (!isReady) {
            setIsReady(true);
            return;
        }

        console.log('Current segments:', segments);

        const inAuthGroup = segments[0] === '(auth)';
        const isNotFound = segments[0] === '+not-found';
        const isOnboarding = segments[0] === 'onboarding';

        if (isAuthenticated === true) {
            // User is signed in
            if (inAuthGroup || isNotFound || isOnboarding) {
                router.replace('/(app)/home');
            }
        } else if (isAuthenticated === false) {
            // User is signed out
            if ((!inAuthGroup && !isOnboarding) || isNotFound) {
                router.replace('/onboarding');
            }
        }
    }, [isAuthenticated, segments, isReady, router]);

    if (!isReady) {
        return <LoadingScreen />;
    }

    return <Slot />;
};

const RootLayout = () => {
    return (
        <AuthContextProvider>
            <ServiceProvider>
                <EnquiryProvider>
                    <MainLayout />
                </EnquiryProvider>
            </ServiceProvider>
        </AuthContextProvider>
    );
};

export default RootLayout;
