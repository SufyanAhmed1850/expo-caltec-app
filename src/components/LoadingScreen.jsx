import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Colors } from "@constants/Colors";

const LoadingScreen = () => (
    <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.light.background,
        }}
    >
        <ActivityIndicator size="large" color={Colors.light.red90} />
        <Text style={{ marginTop: 20, fontSize: 18, color: Colors.light.text }}>
            Loading...
        </Text>
    </View>
);

export default LoadingScreen;
