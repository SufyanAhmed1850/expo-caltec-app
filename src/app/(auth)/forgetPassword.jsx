import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    SafeAreaView,
    Image,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { useAuth } from '@context/authContext';
import { useRouter } from 'expo-router';
import { Colors } from '@constants/Colors';
import { IconMail } from '@constants/SvgIcons';
import { TouchableRipple } from 'react-native-paper';

const { width } = Dimensions.get('window');

const ForgotPassword = () => {
    const { resetPassword } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Forgot Password', 'Please enter your email address', [
                { text: 'OK' },
            ]);
            return;
        }
        setIsLoading(true);
        let response = await resetPassword(email);
        setIsLoading(false);
        if (response.success) {
            Alert.alert(
                'Forgot Password',
                'Password reset email sent. Please check your inbox.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } else {
            Alert.alert('Forgot Password', response.msg, [{ text: 'OK' }]);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    keyboardShouldPersistTaps='always'
                    contentContainerStyle={styles.scrollView}
                >
                    <Image
                        source={require('@assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode='contain'
                    />
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.description}>
                        Enter your email address and we'll send you a link to
                        reset your password.
                    </Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <IconMail
                                width={24}
                                height={24}
                                pathStroke={Colors.light.black30}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Enter your email'
                                placeholderTextColor={Colors.light.black30}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType='email-address'
                                autoCapitalize='none'
                            />
                        </View>
                    </View>
                    <TouchableRipple
                        style={styles.button}
                        onPress={handleResetPassword}
                        disabled={isLoading}
                        rippleColor='rgba(255, 255, 255, 0.32)'
                    >
                        {isLoading ? (
                            <ActivityIndicator
                                color={Colors.light.background}
                            />
                        ) : (
                            <Text style={styles.buttonText}>
                                Reset Password
                            </Text>
                        )}
                    </TouchableRipple>
                    <TouchableRipple
                        style={styles.backButton}
                        onPress={() => router.back()}
                        rippleColor='rgba(230, 88, 112, 0.32)'
                    >
                        <Text style={styles.backButtonText}>
                            Back to Sign In
                        </Text>
                    </TouchableRipple>
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
        justifyContent: 'center',
        padding: 24,
    },
    logo: {
        marginVertical: 46,
        alignSelf: 'center',
        width: width * 0.6,
        height: width * 0.2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: Colors.light.black60,
        marginBottom: 24,
        textAlign: 'center',
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
        marginBottom: 16,
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
    backButton: {
        padding: 10,
        alignItems: 'center',
    },
    backButtonText: {
        color: Colors.light.red90,
        fontSize: 16,
    },
});

export default ForgotPassword;
