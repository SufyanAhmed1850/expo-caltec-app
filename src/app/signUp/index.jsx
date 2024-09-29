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
} from 'react-native';
import { useAuth } from '@context/authContext';
import { useRouter } from 'expo-router';
import { Colors } from '@constants/Colors';
import {
    IconMail,
    IconLock,
    IconProfile,
    IconPhone,
    IconShow,
    IconHide,
} from '@constants/SvgIcons';
import { Ionicons } from '@expo/vector-icons';

const SignUp = () => {
    const { register } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignUp = async () => {
        if (
            !email ||
            !password ||
            !confirmPassword ||
            !name ||
            !companyName ||
            !phone
        ) {
            Alert.alert('Sign Up', 'Please fill all the fields!', [
                { text: 'OK' },
            ]);
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Sign Up', 'Passwords do not match!', [{ text: 'OK' }]);
            return;
        }
        setIsLoading(true);
        let response = await register(
            email,
            password,
            name,
            companyName,
            phone
        );
        setIsLoading(false);
        if (!response.success) {
            Alert.alert('Sign Up', response.msg, [{ text: 'OK' }]);
        }
    };

    const handleLoginRedirect = () => {
        router.replace('signIn');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Text style={styles.title}>Sign Up</Text>
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
                        <View style={styles.inputWrapper}>
                            <IconLock
                                width={24}
                                height={24}
                                pathStroke={Colors.light.black30}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Confirm Password'
                                placeholderTextColor={Colors.light.black30}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                                onPress={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? (
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
                        <View style={styles.inputWrapper}>
                            <IconProfile
                                width={24}
                                height={24}
                                pathStroke={Colors.light.black30}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Full Name'
                                placeholderTextColor={Colors.light.black30}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                        <View style={styles.inputWrapper}>
                            <Ionicons
                                name='business-outline'
                                size={24}
                                color={Colors.light.black30}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Company Name'
                                placeholderTextColor={Colors.light.black30}
                                value={companyName}
                                onChangeText={setCompanyName}
                            />
                        </View>
                        <View style={styles.inputWrapper}>
                            <IconPhone
                                width={24}
                                height={24}
                                pathStroke={Colors.light.black30}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Phone Number'
                                placeholderTextColor={Colors.light.black30}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType='phone-pad'
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSignUp}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Signing Up...' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLoginRedirect}
                    >
                        <Text style={styles.loginButtonText}>
                            Already have an account? Log In
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
    loginButton: {
        padding: 10,
        alignItems: 'center',
    },
    loginButtonText: {
        color: Colors.light.red90,
        fontSize: 16,
    },
});

export default SignUp;
