import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { AuthContextProvider, useAuth } from "@context/authContext";
import { ServiceProvider } from "@context/serviceContext";
import { EnquiryProvider } from "@context/enquiryContext";
import LoadingScreen from "@components/LoadingScreen";
import { Provider as PaperProvider } from "react-native-paper";

const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (typeof isAuthenticated === "undefined") return;

        if (!isReady) {
            setIsReady(true);
            return;
        }

        console.log("Current segments:", segments);

        const inAuthGroup = segments[0] === "(auth)";
        const isNotFound = segments[0] === "+not-found";
        const requiresAuth =
            segments.includes("enquiry") || segments.includes("user");

        if (isAuthenticated === false && requiresAuth) {
            // User is not signed in but tries to access protected routes
            router.replace("/(auth)/signIn");
        } else if (isAuthenticated === true && inAuthGroup) {
            // User is signed in but on auth routes
            router.replace("/(app)/home");
        } else if (isNotFound) {
            // Handle not found routes
            router.replace("/(app)/home");
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
                    <PaperProvider>
                        <MainLayout />
                    </PaperProvider>
                </EnquiryProvider>
            </ServiceProvider>
        </AuthContextProvider>
    );
};

export default RootLayout;
