import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { Colors } from "@constants/Colors";

const Card = ({ icon, title, description, onViewCatalog }) => {
    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <Image source={icon} style={styles.icon} resizeMode="contain" />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <Button
                rippleColor={Colors.light.black10}
                mode="outlined"
                onPress={onViewCatalog}
                style={styles.button}
                labelStyle={styles.buttonLabel}
            >
                View Catalog
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        gap: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 24,
        width: 300,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginHorizontal: 10,
    },
    iconContainer: {
        alignItems: "center",
    },
    icon: {
        height: 48,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        color: "#1A1A1A",
        fontFamily: "System",
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: "#666666",
        textAlign: "justify",
        alignSelf: "center",
        flex: 1,
    },
    button: {
        marginTop: 12,
    },
    buttonLabel: {
        color: "#02203C",
    },
});

export default Card;
