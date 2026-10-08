import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { TouchableRipple } from 'react-native-paper';

import {
    AuthField,
    AuthMessage,
    AuthPrimaryButton,
    AuthScaffold,
    AuthTextButton,
    useAuthTheme,
} from '@components/auth/AuthScaffold';
import {
    IconSolarEye,
    IconSolarEyeClosed,
    IconSolarLetter,
    IconSolarLockPassword,
} from '@constants/SvgIcons';
import { useAuth } from '@context/authContext';
import { isValidEmailFormat } from '@context/authUtils';

const PasswordVisibilityToggle = ({ onPress, visible }) => {
    const colors = useAuthTheme();

    return (
        <TouchableRipple
            onPress={onPress}
            rippleColor={
                colors.isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0, 0, 0, 0.08)'
            }
            borderless
        >
            {visible ? (
                <IconSolarEyeClosed
                    width={22}
                    height={22}
                    pathStroke={colors.muted}
                />
            ) : (
                <IconSolarEye
                    width={22}
                    height={22}
                    pathStroke={colors.muted}
                />
            )}
        </TouchableRipple>
    );
};

const ForgotRow = ({ onForgotPress }) => {
    const colors = useAuthTheme();

    return (
        <View style={styles.forgotRow}>
            <Text style={[styles.helperText, { color: colors.muted }]}>
                Email verification required
            </Text>
            <AuthTextButton onPress={onForgotPress} emphasis>
                Forgot Password?
            </AuthTextButton>
        </View>
    );
};

const SignIn = () => {
    const { login, pendingVerificationEmail, isLoading } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [formMessage, setFormMessage] = useState('');

    useEffect(() => {
        if (!email && pendingVerificationEmail) {
            setEmail(pendingVerificationEmail);
        }
    }, [email, pendingVerificationEmail]);

    const clearMessages = (field, value) => {
        if (field === 'email') {
            setEmail(value);
        }

        if (field === 'password') {
            setPassword(value);
        }

        setErrors((prev) => ({ ...prev, [field]: '' }));
        setFormMessage('');
    };

    const validateForm = () => {
        const nextErrors = {};

        if (!email.trim()) {
            nextErrors.email = 'Email is required.';
        } else if (!isValidEmailFormat(email)) {
            nextErrors.email = 'Enter a valid email address.';
        }

        if (!password) {
            nextErrors.password = 'Password is required.';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSignIn = async () => {
        if (!validateForm()) {
            return;
        }

        const response = await login(email, password);

        if (response.success) {
            router.replace('/(app)/home');
            return;
        }

        if (response.nextStep === 'verifyEmail') {
            router.replace('/(auth)/verify-email');
            return;
        }

        setFormMessage(response.msg);
    };

    const isSignInReady =
        isValidEmailFormat(email) && Boolean(password) && !isLoading.login;

    return (
        <AuthScaffold
            enterFrom='left'
            exitTo='left'
            title={'Welcome to\nCaltec login now!'}
        >
            <AuthMessage message={formMessage} tone='error' />

            <AuthField
                label='Email'
                placeholder='Enter your email'
                value={email}
                onChangeText={(value) => clearMessages('email', value)}
                keyboardType='email-address'
                autoComplete='email'
                textContentType='emailAddress'
                error={errors.email}
                icon={
                    <IconSolarLetter
                        width={22}
                        height={22}
                    />
                }
            />

            <AuthField
                label='Password'
                placeholder='Enter your password'
                value={password}
                onChangeText={(value) => clearMessages('password', value)}
                secureTextEntry={!showPassword}
                autoComplete='password'
                textContentType='password'
                error={errors.password}
                icon={
                    <IconSolarLockPassword
                        width={22}
                        height={22}
                    />
                }
                rightAccessory={
                    <PasswordVisibilityToggle
                        onPress={() => setShowPassword((prev) => !prev)}
                        visible={showPassword}
                    />
                }
            />

            <ForgotRow
                onForgotPress={() => router.replace('/(auth)/forgetPassword')}
            />

            <AuthPrimaryButton
                label='Login'
                onPress={handleSignIn}
                loading={isLoading.login}
                disabled={!isSignInReady}
            />

            <AuthTextButton
                onPress={() => router.replace('/(auth)/signUp')}
                emphasis
            >
                Do not have an account? Sign Up
            </AuthTextButton>
        </AuthScaffold>
    );
};

const styles = StyleSheet.create({
    forgotRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 0,
        marginBottom: 10,
    },
    helperText: {
        fontSize: 12,
        fontWeight: '600',
    },
});

export default SignIn;
