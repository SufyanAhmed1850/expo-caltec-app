import React from "react";
import { View, Text, StyleSheet, Image, Linking } from "react-native";
import { Button } from "react-native-paper";
import Feather from "@expo/vector-icons/Feather";
import locationImage from "@assets/images/location.png";
import { Colors } from "../constants/Colors";

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/fe4fo2UhhSy1xoqu5";

const LocationSection = () => {
    const handleOpenMaps = async () => {
        try {
            const supported = await Linking.canOpenURL(GOOGLE_MAPS_URL);
            if (supported) {
                await Linking.openURL(GOOGLE_MAPS_URL);
            } else {
                console.error("Cannot open URL:", GOOGLE_MAPS_URL);
            }
        } catch (error) {
            console.error("Error opening URL:", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Where to Find Us</Text>
                <View style={styles.mapContainer}>
                    <Image
                        source={locationImage}
                        style={styles.mapImage}
                        resizeMode="cover"
                    />
                </View>
                <Button
                    rippleColor={Colors.light.whiteOpacity35}
                    mode="contained"
                    onPress={handleOpenMaps}
                    style={styles.button}
                    icon={({ size, color }) => (
                        <Feather
                            name="map-pin"
                            size={size}
                            color={Colors.light.white90}
                        />
                    )}
                >
                    View in Google Maps
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        paddingBottom: 60,
        width: "100%",
    },
    content: {
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 24,
        color: "#02203C",
        textAlign: "center",
    },
    mapContainer: {
        width: "100%",
        maxWidth: 600,
        aspectRatio: 1,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    mapImage: {
        width: "100%",
        height: "100%",
    },
    button: {
        borderRadius: 8,
        backgroundColor: "#02203C",
    },
});

export default LocationSection;
