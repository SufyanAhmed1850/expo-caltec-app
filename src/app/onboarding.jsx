import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@constants/Colors';

export default function OnboardingScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Image
                source={require('@assets/images/industry.png')}
                style={styles.icon}
            />
            <View style={styles.body}>
                <Text style={styles.heading}>Welcome to Caltec</Text>
                <Text style={styles.description}>
                    Caltec is your go-to platform for industrial calibration
                    services. Manage your calibration needs efficiently and
                    effectively with our state-of-the-art tools and expert
                    support.
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/(auth)/signUp')}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.loginButton]}
                    onPress={() => router.push('/(auth)/signIn')}
                >
                    <Text style={[styles.buttonText, styles.loginButtonText]}>
                        Log In
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.light.background,
    },
    icon: {
        objectFit: 'contain',
        flex: 3,
        width: '80%',
        marginBottom: 30,
    },
    body: {
        width: '100%',
        flex: 2,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginHorizontal: 18,
        marginBottom: 20,
        color: Colors.light.text,
    },
    description: {
        fontSize: 16,
        marginHorizontal: 18,
        marginBottom: 30,
        color: Colors.light.black60,
    },
    button: {
        width: '100%',
        backgroundColor: Colors.light.red90,
        paddingVertical: 18,
        paddingHorizontal: 36,
        borderRadius: 99,
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.light.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginButton: {
        backgroundColor: Colors.light.background,
        borderWidth: 2,
        borderColor: Colors.light.red90,
    },
    loginButtonText: {
        color: Colors.light.red90,
    },
});
