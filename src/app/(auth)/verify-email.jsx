import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import {
    AuthCodeInput,
    AuthMessage,
    AuthPrimaryButton,
    AuthScaffold,
    AuthTextButton,
    useAuthTheme,
} from '@components/auth/AuthScaffold';
import { IconSolarShieldCheck } from '@constants/SvgIcons';
import { useAuth } from '@context/authContext';

const VerificationIntro = ({ emailAddress }) => {
    const colors = useAuthTheme();

    return (
        <>
            <View style={[styles.iconBadge, { backgroundColor: colors.note }]}>
                <IconSolarShieldCheck
                    width={30}
                    height={30}
                    pathStroke={colors.primary}
                />
            </View>

            <Text style={[styles.sheetTitle, { color: colors.text }]}>
                Check your email
            </Text>
            <Text style={[styles.sheetSubtitle, { color: colors.muted }]}>
                We sent a 6 digit verification code to
            </Text>
            <Text style={[styles.emailText, { color: colors.primary }]}>
                {emailAddress || 'your email address'}
            </Text>
        </>
    );
};

const ResendRow = ({ isSending, onResendPress, disabled }) => {
    const colors = useAuthTheme();

    return (
        <View style={styles.resendRow}>
            <Text style={[styles.resendMuted, { color: colors.muted }]}>
                Do not receive code?
            </Text>
            <AuthTextButton
                onPress={onResendPress}
                disabled={disabled}
                emphasis
            >
                {isSending ? 'Sending...' : 'Resend Now'}
            </AuthTextButton>
        </View>
    );
};

const MissingEmailText = () => {
    const colors = useAuthTheme();

    return (
        <Text style={[styles.helperText, { color: colors.secondary }]}>
            Sign in or register again so we know where to send the code.
        </Text>
    );
};

const VerifyEmail = () => {
    const {
        authUser,
        pendingVerificationEmail,
        resendVerificationEmail,
        verifyEmail,
        logout,
        isLoading,
    } = useAuth();
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [code, setCode] = useState('');

    const emailAddress = useMemo(
        () => authUser?.email ?? pendingVerificationEmail,
        [authUser?.email, pendingVerificationEmail]
    );

    const handleUseAnotherAccount = async () => {
        await logout();
        router.replace('/(auth)/signIn');
    };

    const handleResendVerification = async () => {
        setError('');
        const response = await resendVerificationEmail(emailAddress);

        if (response.success) {
            setMessage(response.msg);
            return;
        }

        setMessage('');
        setError(response.msg);
    };

    const handleVerifyCode = async () => {
        setMessage('');
        setError('');

        if (code.trim().length !== 6) {
            setError('Enter the 6 digit verification code.');
            return;
        }

        const response = await verifyEmail(emailAddress, code.trim());

        if (response.success) {
            router.replace(response.nextPath ?? '/(app)/home');
            return;
        }

        setError(response.msg);
    };
    const isVerificationReady =
        Boolean(emailAddress) &&
        code.length === 6 &&
        !isLoading.verifyEmail;

    return (
        <AuthScaffold
            enterFrom='right'
            exitTo='right'
            title='Verify your account'
            subtitle='Enter the code we sent to your email to unlock protected Caltec access.'
        >
            <VerificationIntro emailAddress={emailAddress} />

            <AuthMessage message={message} />
            <AuthMessage message={error} tone='error' />

            <AuthCodeInput
                label='Verification Code'
                value={code}
                onChangeText={(value) => {
                    setCode(value);
                    setError('');
                }}
                error={code.length > 0 && code.length < 6 ? error : ''}
            />

            <AuthPrimaryButton
                label='Verify Email'
                onPress={handleVerifyCode}
                loading={isLoading.verifyEmail}
                disabled={!isVerificationReady}
            />

            <ResendRow
                onResendPress={handleResendVerification}
                disabled={!emailAddress || isLoading.resendVerification}
                isSending={isLoading.resendVerification}
            />

            {!emailAddress && <MissingEmailText />}

            <AuthTextButton onPress={handleUseAnotherAccount}>
                Use Another Account
            </AuthTextButton>
        </AuthScaffold>
    );
};

const styles = StyleSheet.create({
    iconBadge: {
        alignSelf: 'center',
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -4,
        marginBottom: 15,
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
    },
    sheetSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    emailText: {
        fontSize: 15,
        fontWeight: '800',
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 18,
    },
    resendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        marginTop: 8,
    },
    resendMuted: {
        fontSize: 13,
        fontWeight: '600',
    },
    helperText: {
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center',
        marginTop: 5,
    },
});

export default VerifyEmail;
