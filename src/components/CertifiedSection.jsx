import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { Portal, Modal } from "react-native-paper";
import ISO9001 from "@assets/images/ISO_9001-2015.png";
import ISO9001Cert from "@assets/images/ISO-9001.jpg";
import ISO14001 from "@assets/images/ISO_14001-2015.png";
import ISO45001Cert from "@assets/images/ISO-45001.jpg";
import ISO45001 from "@assets/images/ISO_45001-2018.png";
import ISO14001Cert from "@assets/images/ISO-14001.jpg";

const { width } = Dimensions.get("window");

const BADGES = [
    {
        id: "45001",
        title: "ISO 45001:2018",
        image: ISO45001,
        certificateImage: ISO45001Cert,
    },
    {
        id: "9001",
        title: "ISO 9001:2015",
        image: ISO9001,
        certificateImage: ISO9001Cert,
    },
    {
        id: "14001",
        title: "ISO 14001:2015",
        image: ISO14001,
        certificateImage: ISO14001Cert,
    },
];

const CertifiedSection = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);

    const handleBadgePress = (badge) => {
        setSelectedCertificate(badge.certificateImage);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Certified Excellence</Text>
                <Text style={styles.subtitle}>
                    We are certified by TUV Austria, ensuring compliance with
                    international standards, including ISO 9001:2015, ISO
                    14001:2015, and ISO 45001:2018.
                </Text>

                <View style={styles.badgesContainer}>
                    {BADGES.map((badge) => (
                        <TouchableOpacity
                            key={badge.id}
                            style={styles.badgeWrapper}
                            onPress={() => handleBadgePress(badge)}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={badge.image}
                                style={styles.badgeImage}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <Portal>
                <Modal
                    visible={modalVisible}
                    onDismiss={() => setModalVisible(false)}
                    contentContainerStyle={styles.modalContainer}
                >
                    {selectedCertificate && (
                        <Image
                            source={selectedCertificate}
                            style={styles.certificateImage}
                            resizeMode="contain"
                        />
                    )}
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        marginBottom: 24,
        width: "100%",
    },
    content: {
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 8,
        color: "#02203C",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        color: "#7C8E9A",
        textAlign: "center",
        marginBottom: 24,
        maxWidth: 800,
    },
    badgesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 8,
        width: "100%",
        maxWidth: 1200,
    },
    badgeWrapper: {
        overflow: "hidden",
        borderRadius: 12,
    },
    badgeImage: {
        width: Math.min(width * 0.25, 180),
        height: Math.min(width * 0.25, 180),
        borderRadius: 12,
    },
    modalContainer: {
        backgroundColor: "white",
        margin: 20,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    certificateImage: {
        width: "100%",
        height: "75%",
    },
});

export default CertifiedSection;
