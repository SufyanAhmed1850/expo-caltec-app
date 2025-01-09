import CardSlider from "@/src/components/CardSlider";
import ImageSlider from "@/src/components/ImageSlider";
import CertifiedSection from "@/src/components/CertifiedSection";
import LocationSection from "@/src/components/LocationSection";
import { Colors } from "@/src/constants/Colors";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Home() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>
                Welcome to Caltec Instrument Services Co.
            </Text>
            <Text style={styles.description}>
                Caltec Instrument Services offers its customers an all-inclusive
                instrumentation service. Our business truly believes in quality
                management, which will continually deliver products and services
                that satisfy clients and comply to regulatory requirements.
            </Text>
            <ImageSlider />
            <Text style={styles.sectionTitle}>About Caltec</Text>
            <Text style={styles.description}>
                A specialised organisation called Caltec Instrument Services
                provides on-site servicing, installation, and calibration
                services for a variety of industrial instruments. This entails
                things like conductivity, humidity, flow level, temperature,
                pressure, and other parameters are included.
            </Text>
            <Text style={styles.description}>
                We also provide, install, and equip a wide variety of
                instrumentation to meet customer needs, and we would be
                delighted to have the chance to talk about any needs your
                company may have and provide an acceptable quote.
            </Text>
            <Text style={styles.description}>
                In Pakistan, Caltec Instrument Services is active. Hospitals,
                pharmaceuticals, fertiliser, textiles, cement, oil and gas, food
                processors, breweries, and dairies are just a few of the many
                industries we serve as clients.
            </Text>
            <CardSlider />
            <CertifiedSection />
            <LocationSection />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    title: {
        paddingHorizontal: 20,
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 10,
        color: "#02203C",
    },
    description: {
        paddingHorizontal: 20,
        fontSize: 16,
        color: Colors.light.black60,
        marginBottom: 15,
    },
    sectionTitle: {
        paddingHorizontal: 20,
        marginBottom: 10,
        paddingHorizontal: 20,
        fontSize: 24,
        fontWeight: "500",
        color: "#02203C",
    },
    listItem: {
        fontSize: 16,
        color: Colors.light.black60,
        marginBottom: 5,
        paddingLeft: 15,
    },
});
