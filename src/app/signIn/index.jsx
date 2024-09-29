import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    SafeAreaView,
    Pressable,
} from 'react-native';
import { useAuth } from '@context/authContext';
import { useRouter } from 'expo-router';
import { Colors } from '@constants/Colors';
import { IconMail, IconLock, IconShow, IconHide } from '@constants/SvgIcons';

const SignIn = () => {
    const { login } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Sign In', 'Please enter both email and password!', [
                { text: 'OK' },
            ]);
            return;
        }
        setIsLoading(true);
        let response = await login(email, password);
        setIsLoading(false);
        if (!response.success) {
            Alert.alert('Sign In', response.msg, [{ text: 'OK' }]);
        } else {
            router.replace('home');
        }
    };

    const handleSignUpRedirect = () => {
        router.replace('signUp');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Text style={styles.title}>Sign In</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <IconMail
                                width={24}
                                height={24}
                                pathStroke={Colors.light.black30}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Email'
                                placeholderTextColor={Colors.light.black30}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType='email-address'
                                autoCapitalize='none'
                            />
                        </View>
                        <View style={styles.inputWrapper}>
                            <IconLock
                                width={24}
                                height={24}
                                pathStroke={Colors.light.black30}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Password'
                                placeholderTextColor={Colors.light.black30}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <IconHide
                                        width={24}
                                        height={24}
                                        pathStroke={Colors.light.black30}
                                    />
                                ) : (
                                    <IconShow
                                        width={24}
                                        height={24}
                                        pathStroke={Colors.light.black30}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Pressable
                        style={styles.button}
                        onPress={handleSignIn}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Text>
                    </Pressable>
                    <TouchableOpacity
                        style={styles.signUpButton}
                        onPress={handleSignUpRedirect}
                    >
                        <Text style={styles.signUpButtonText}>
                            Don't have an account? Sign Up
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: Colors.light.text,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        borderWidth: 1,
        borderColor: Colors.light.black30,
        borderRadius: 99,
        marginBottom: 10,
        padding: 14,
    },
    input: {
        flex: 1,
        paddingLeft: 10,
        fontSize: 16,
        color: Colors.light.text,
    },
    button: {
        backgroundColor: Colors.light.red90,
        padding: 15,
        borderRadius: 99,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: Colors.light.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    signUpButton: {
        padding: 10,
        alignItems: 'center',
    },
    signUpButtonText: {
        color: Colors.light.red90,
        fontSize: 16,
    },
});

export default SignIn;
