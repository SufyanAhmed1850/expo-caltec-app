import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Colors } from "@/src/constants/Colors";

const ServiceItem = ({ title, description }) => (
    <View style={styles.serviceItem}>
        <Text style={styles.serviceTitle}>{title}</Text>
        <Text style={styles.serviceDescription}>{description}</Text>
    </View>
);

export default function Home() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>
                Welcome to Caltec Instrument Services Ltd
            </Text>

            <Text style={styles.description}>
                Caltec Instrument Services offers its customers an all-inclusive
                instrumentation service. Our business truly believes in quality
                management, which will continually deliver products and services
                that satisfy clients and comply to regulatory requirements.
            </Text>

            <Text style={styles.sectionTitle}>Our Services</Text>

            <ServiceItem
                title="Instrument Calibration"
                description="Services for instrument calibration are often performed at the location of our client. However, our
        Karachi workshop is fully equipped to repair instruments as well."
            />

            <ServiceItem
                title="Temperature Monitoring Systems"
                description="To meet client demands, Caltec Instrument Services can provide, install, and operate a variety of
        temperature monitoring systems."
            />

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

            <Text style={styles.sectionTitle}>Our Expertise</Text>

            <Text style={styles.description}>
                Any form of pressure and vacuum gauge, including pressure/level
                transmitters and hydraulic gauges up to 400 bars of pressure,
                are implemented. Instruments for pH and conductivity are also
                frequently used.
            </Text>

            <Text style={styles.sectionTitle}>
                On-site Maintenance and Calibration
            </Text>

            <Text style={styles.listItem}>
                • Industrial instrumentation and process control
            </Text>
            <Text style={styles.listItem}>
                • All types of temperature monitoring
            </Text>
            <Text style={styles.listItem}>
                • All types of pressure gauges and transmitters
            </Text>
            <Text style={styles.listItem}>
                • Conductivity and humidity instruments
            </Text>
            <Text style={styles.listItem}>• Process control</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.light.blue90,
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: Colors.light.black60,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.light.blue90,
        marginTop: 20,
        marginBottom: 10,
    },
    serviceItem: {
        marginBottom: 15,
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.light.text,
        marginBottom: 5,
    },
    serviceDescription: {
        fontSize: 16,
        color: Colors.light.black60,
    },
    listItem: {
        fontSize: 16,
        color: Colors.light.black60,
        marginBottom: 5,
        paddingLeft: 15,
    },
});
