import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
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
    IconSolarUserRounded,
} from '@constants/SvgIcons';
import { useAuth } from '@context/authContext';
import {
    getLocalPasswordValidationMessage,
    isValidEmailFormat,
} from '@context/authUtils';

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

const PasswordNote = () => {
    const colors = useAuthTheme();

    return (
        <View style={[styles.noteBox, { backgroundColor: colors.note }]}>
            <Text style={[styles.noteText, { color: colors.secondary }]}>
                Password must include 8+ characters, one uppercase letter, and
                one number.
            </Text>
        </View>
    );
};

const SignUp = () => {
    const { register, isLoading } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [formMessage, setFormMessage] = useState('');

    const handleReturnToLogin = () => {
        router.replace('/(auth)/signIn');
    };

    const clearField = (field, value) => {
        if (field === 'name') {
            setName(value);
        }

        if (field === 'email') {
            setEmail(value);
        }

        if (field === 'password') {
            setPassword(value);
        }

        if (field === 'confirmPassword') {
            setConfirmPassword(value);
        }

        setErrors((prev) => ({ ...prev, [field]: '' }));
        setFormMessage('');
    };

    const validateForm = () => {
        const nextErrors = {};

        if (!name.trim()) {
            nextErrors.name = 'Full name is required.';
        }

        if (!email.trim()) {
            nextErrors.email = 'Email is required.';
        } else if (!isValidEmailFormat(email)) {
            nextErrors.email = 'Enter a valid email address.';
        }

        if (!password) {
            nextErrors.password = 'Password is required.';
        }

        if (!confirmPassword) {
            nextErrors.confirmPassword = 'Please confirm your password.';
        } else if (password !== confirmPassword) {
            nextErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSignUp = async () => {
        if (!validateForm()) {
            return;
        }

        const response = await register(name, email, password);

        if (response.success) {
            router.replace('/(auth)/verify-email');
            return;
        }

        setFormMessage(response.msg);
    };

    const passwordIcon = (
        <IconSolarLockPassword
            width={22}
            height={22}
        />
    );
    const passwordMeetsPolicy =
        password.length > 0 && !getLocalPasswordValidationMessage(password);
    const isSignUpReady =
        Boolean(name.trim()) &&
        isValidEmailFormat(email) &&
        passwordMeetsPolicy &&
        password === confirmPassword &&
        !isLoading.register;

    return (
        <AuthScaffold
            enterFrom='right'
            exitTo='right'
            title='Create an Account?'
        >
            <AuthMessage message={formMessage} tone='error' />

            <AuthField
                label='Full Name'
                placeholder='Enter your full name'
                value={name}
                onChangeText={(value) => clearField('name', value)}
                autoCapitalize='words'
                autoCorrect
                textContentType='name'
                error={errors.name}
                icon={
                    <IconSolarUserRounded
                        width={22}
                        height={22}
                    />
                }
            />

            <AuthField
                label='Email'
                placeholder='Enter your email'
                value={email}
                onChangeText={(value) => clearField('email', value)}
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
                onChangeText={(value) => clearField('password', value)}
                secureTextEntry={!showPassword}
                autoComplete='new-password'
                textContentType='newPassword'
                error={errors.password}
                icon={passwordIcon}
                rightAccessory={
                    <PasswordVisibilityToggle
                        onPress={() => setShowPassword((prev) => !prev)}
                        visible={showPassword}
                    />
                }
            />

            <AuthField
                label='Confirm Password'
                placeholder='Confirm your password'
                value={confirmPassword}
                onChangeText={(value) => clearField('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                autoComplete='new-password'
                textContentType='newPassword'
                error={errors.confirmPassword}
                icon={passwordIcon}
                rightAccessory={
                    <PasswordVisibilityToggle
                        onPress={() =>
                            setShowConfirmPassword((prev) => !prev)
                        }
                        visible={showConfirmPassword}
                    />
                }
            />

            <PasswordNote />

            <AuthPrimaryButton
                label='Register'
                onPress={handleSignUp}
                loading={isLoading.register}
                disabled={!isSignUpReady}
            />

            <AuthTextButton
                onPress={handleReturnToLogin}
                emphasis
            >
                Already have an account? Login
            </AuthTextButton>
        </AuthScaffold>
    );
};

const styles = StyleSheet.create({
    noteBox: {
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 8,
    },
    noteText: {
        fontSize: 12,
        lineHeight: 17,
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default SignUp;
