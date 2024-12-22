import React from "react";
import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { Colors } from "@/src/constants/Colors";
import {
    IconLocation,
    IconProfile,
    IconMail,
    IconPhone,
} from "@constants/SvgIcons";
import { Ionicons } from "@expo/vector-icons";

const ContactItem = ({ icon, title, text, onPress }) => (
    <TouchableRipple
        style={styles.card}
        onPress={onPress}
        rippleColor={Colors.light.black30}
        borderless
    >
        <View style={styles.cardContent}>
            <View style={styles.iconContainer}>{icon}</View>
            <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardText}>{text}</Text>
            </View>
        </View>
    </TouchableRipple>
);

export default function Contact() {
    const handlePhonePress = (number) => {
        Linking.openURL(`tel:${number}`);
    };

    const handleEmailPress = (email) => {
        Linking.openURL(`mailto:${email}`);
    };

    const handleWebsitePress = (url) => {
        Linking.openURL(url);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Contact Us</Text>
                <Text style={styles.subtitle}>
                    Get in touch with Caltec Instrument Services
                </Text>
            </View>

            <ContactItem
                icon={
                    <IconProfile
                        width={24}
                        height={24}
                        pathStroke={Colors.light.blue90}
                    />
                }
                title="Founder and CEO"
                text="Shafqat Khan Awan"
            />

            <ContactItem
                icon={
                    <IconLocation
                        width={24}
                        height={24}
                        pathStroke={Colors.light.blue90}
                    />
                }
                title="Office Address"
                text="Office No. 203, 2nd Floor, Building No. LS-1, Plot No. S/T -3/1, Sector 15 Korangi Industrial Area Karachi"
            />

            <ContactItem
                icon={
                    <Ionicons
                        name="mail-outline"
                        size={24}
                        color={Colors.light.blue90}
                    />
                }
                title="Postal Address"
                text="PO Box: 8271"
            />

            <ContactItem
                icon={
                    <IconPhone
                        width={24}
                        height={24}
                        pathStroke={Colors.light.blue90}
                    />
                }
                title="Fax"
                text="021 35167999"
                onPress={() => handlePhonePress("02135167999")}
            />

            <ContactItem
                icon={
                    <IconPhone
                        width={24}
                        height={24}
                        pathStroke={Colors.light.blue90}
                    />
                }
                title="Landline"
                text="021 35167530"
                onPress={() => handlePhonePress("02135167530")}
            />

            <ContactItem
                icon={
                    <IconPhone
                        width={24}
                        height={24}
                        pathStroke={Colors.light.blue90}
                    />
                }
                title="Mobile"
                text="+92 333 2283557"
                onPress={() => handlePhonePress("+923332283557")}
            />

            <ContactItem
                icon={
                    <Ionicons
                        name="logo-whatsapp"
                        size={24}
                        color={Colors.light.blue90}
                    />
                }
                title="WhatsApp"
                text="300 8213260"
                onPress={() =>
                    Linking.openURL("whatsapp://send?phone=+923008213260")
                }
            />

            <ContactItem
                icon={
                    <IconMail
                        width={24}
                        height={24}
                        pathStroke={Colors.light.blue90}
                    />
                }
                title="Email"
                text="info@caltec.com.pk"
                onPress={() => handleEmailPress("info@caltec.com.pk")}
            />

            <ContactItem
                icon={
                    <Ionicons
                        name="globe-outline"
                        size={24}
                        color={Colors.light.blue90}
                    />
                }
                title="Website"
                text="https://caltec.com.pk"
                onPress={() => handleWebsitePress("https://caltec.com.pk")}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        backgroundColor: Colors.light.blue90,
        padding: 20,
        paddingTop: 40,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: Colors.light.background,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.light.background,
        opacity: 0.8,
    },
    card: {
        backgroundColor: Colors.light.background,
        borderRadius: 12,
        marginHorizontal: 20,
        marginBottom: 15,
        elevation: 3,
        shadowColor: Colors.light.black30,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardContent: {
        flexDirection: "row",
        padding: 15,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.blue10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.light.blue90,
        marginBottom: 4,
    },
    cardText: {
        fontSize: 14,
        color: Colors.light.black60,
    },
});
