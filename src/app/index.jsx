import React, { useEffect } from 'react';
import { router, useRootNavigationState } from 'expo-router';

import LoadingScreen from '@components/LoadingScreen';
import { useAuth } from '@context/authContext';
import { getRedirectPathForAuthStatus } from '@context/authUtils';

export default function Index() {
    const { authStatus } = useAuth();
    const rootNavigationState = useRootNavigationState();

    useEffect(() => {
        if (authStatus === 'loading' || !rootNavigationState?.key) {
            return;
        }

        router.replace(getRedirectPathForAuthStatus(authStatus));
    }, [authStatus, rootNavigationState?.key]);

    return <LoadingScreen />;
}
