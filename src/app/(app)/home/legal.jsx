import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { IconDownload } from "@constants/SvgIcons.js";

const CERTIFICATES = [
    {
        id: "srb",
        title: "SRB Number",
        value: "S8238184-7",
    },
    {
        id: "gst",
        title: "GST Number",
        value: "GST8238184-7",
    },
    {
        id: "pra",
        title: "PRA Number",
        value: "8238184",
    },
    {
        id: "ntn",
        title: "NTN Number",
        value: "8238184-7",
    },
];

const BANK_DETAILS = {
    bankName: "Meezan Bank ",
    accountTitle: "Caltec Instrument Services Co.",
    accountNumber: "0109-0107559032",
};

const DownloadSection = () => {
    const handleDownload = (url) => {
        // Handle download functionality
        console.log("Downloading:", url);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Certificates Section */}
                <View style={styles.certificatesContainer}>
                    {CERTIFICATES.map((cert) => (
                        <View key={cert.id} style={styles.certificateRow}>
                            <Text style={styles.certificateText}>
                                {cert.title}
                            </Text>
                            <Text style={styles.certificateValue}>
                                {cert.value}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Bank Details Section */}
                <Card style={styles.bankCard}>
                    <Card.Content>
                        <Text style={styles.bankTitle}>Bank Details</Text>
                        <View style={styles.bankDetails}>
                            <View style={styles.bankRow}>
                                <Text style={styles.bankLabel}>Bank Name:</Text>
                                <Text style={styles.bankValue}>
                                    {BANK_DETAILS.bankName}
                                </Text>
                            </View>
                            <View style={styles.bankRow}>
                                <Text style={styles.bankLabel}>
                                    Account Title:
                                </Text>
                                <Text style={styles.bankValue}>
                                    {BANK_DETAILS.accountTitle}
                                </Text>
                            </View>
                            <View style={styles.bankRow}>
                                <Text style={styles.bankLabel}>
                                    Account Number:
                                </Text>
                                <Text style={styles.bankValue}>
                                    {BANK_DETAILS.accountNumber}
                                </Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 60,
        width: "100%",
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        maxWidth: 800,
        width: "100%",
        alignSelf: "center",
    },
    certificatesContainer: {
        marginBottom: 32,
    },
    certificateRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    certificateText: {
        fontSize: 16,
        color: "#02203C",
        fontWeight: "500",
    },
    certificateValue: {
        opacity: 0.8,
    },
    bankCard: {
        borderRadius: 12,
        elevation: 3,
        backgroundColor: "#FFFFFF",
    },
    bankTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#02203C",
        marginBottom: 16,
    },
    bankDetails: {
        gap: 12,
    },
    bankRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    bankLabel: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
    },
    bankValue: {
        fontSize: 14,
        color: "#02203C",
        fontWeight: "600",
    },
});

export default DownloadSection;
