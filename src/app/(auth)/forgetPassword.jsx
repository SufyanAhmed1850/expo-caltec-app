import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { TouchableRipple } from "react-native-paper";

import {
    AuthCodeInput,
    AuthField,
    AuthMessage,
    AuthPrimaryButton,
    AuthScaffold,
    AuthTextButton,
    useAuthTheme,
} from "@components/auth/AuthScaffold";
import {
    IconSolarEye,
    IconSolarEyeClosed,
    IconSolarLetter,
    IconSolarLockPassword,
} from "@constants/SvgIcons";
import { useAuth } from "@context/authContext";
import {
    getLocalPasswordValidationMessage,
    isValidEmailFormat,
} from "@context/authUtils";

const RESEND_COOLDOWN_SECONDS = 60;

const PasswordVisibilityToggle = ({ onPress, visible }) => {
    const colors = useAuthTheme();

    return (
        <TouchableRipple
            onPress={onPress}
            rippleColor={
                colors.isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0, 0, 0, 0.08)"
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

const EmailSentCard = ({ email }) => {
    const colors = useAuthTheme();

    return (
        <View style={styles.emailSentCard}>
            <View style={[styles.mailBadge, { backgroundColor: colors.note }]}>
                <IconSolarLetter
                    width={28}
                    height={28}
                    pathStroke={colors.primary}
                />
            </View>
            <Text style={[styles.sheetTitle, { color: colors.text }]}>
                Check your email
            </Text>
            <Text style={[styles.sheetSubtitle, { color: colors.muted }]}>
                We sent a reset code to {email.trim()}.
            </Text>
        </View>
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

const ForgotPassword = () => {
    const {
        resetPassword,
        confirmPasswordReset,
        verifyPasswordResetCode,
        isLoading,
    } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetStep, setResetStep] = useState("email");
    const [resendCooldown, setResendCooldown] = useState(0);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (resendCooldown <= 0) {
            return undefined;
        }

        const timerId = setTimeout(() => {
            setResendCooldown((seconds) => Math.max(seconds - 1, 0));
        }, 1000);

        return () => clearTimeout(timerId);
    }, [resendCooldown]);

    const handleReturnToLogin = () => {
        router.replace("/(auth)/signIn");
    };

    const handleResetPassword = async () => {
        if (!email.trim()) {
            setError("Email is required.");
            setMessage("");
            return;
        }

        if (!isValidEmailFormat(email)) {
            setError("Enter a valid email address.");
            setMessage("");
            return;
        }

        setError("");
        const response = await resetPassword(email);

        if (response.success) {
            setMessage(response.msg);
            setResendCooldown(RESEND_COOLDOWN_SECONDS);
            setResetStep("code");
            return;
        }

        setMessage("");
        setError(response.msg);
    };

    const handleContinueFromCode = async () => {
        if (code.trim().length !== 6) {
            setError("Enter the 6 digit reset code.");
            return;
        }

        setError("");
        setMessage("");
        const response = await verifyPasswordResetCode(email, code.trim());

        if (response.success) {
            setResetStep("password");
            return;
        }

        setError(response.msg);
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0 || isLoading.resetPassword) {
            return;
        }

        setError("");
        setMessage("");
        const response = await resetPassword(email);

        if (response.success) {
            setCode("");
            setMessage(response.msg);
            setResendCooldown(RESEND_COOLDOWN_SECONDS);
            return;
        }

        setError(response.msg);
    };

    const handleConfirmReset = async () => {
        const passwordError = getLocalPasswordValidationMessage(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setError("");
        const response = await confirmPasswordReset(
            email,
            code.trim(),
            password,
        );

        if (response.success) {
            setMessage(response.msg);
            setTimeout(() => router.replace("/(auth)/signIn"), 900);
            return;
        }

        setMessage("");
        setError(response.msg);
    };

    const passwordIcon = (
        <IconSolarLockPassword
            width={22}
            height={22}
        />
    );
    const isEmailReady = isValidEmailFormat(email) && !isLoading.resetPassword;
    const isCodeReady = code.length === 6;
    const isResendDisabled = resendCooldown > 0 || isLoading.resetPassword;
    const passwordMeetsPolicy =
        password.length > 0 && !getLocalPasswordValidationMessage(password);
    const isResetReady =
        isCodeReady &&
        passwordMeetsPolicy &&
        password === confirmPassword &&
        !isLoading.confirmPasswordReset;

    return (
        <AuthScaffold
            enterFrom="right"
            exitTo="right"
            title={resetStep === "email" ? "Forgot password?" : undefined}
            subtitle={
                resetStep === "email"
                    ? "Enter your email and we will send a secure reset code if the account exists."
                    : undefined
            }
        >
            {resetStep === "email" ? (
                <>
                    <AuthMessage message={message} />
                    <AuthMessage message={error} tone="error" />

                    <AuthField
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={(value) => {
                            setEmail(value);
                            setError("");
                            setMessage("");
                        }}
                        keyboardType="email-address"
                        autoComplete="email"
                        textContentType="emailAddress"
                        icon={
                            <IconSolarLetter
                                width={22}
                                height={22}
                            />
                        }
                    />

                    <AuthPrimaryButton
                        label="Continue"
                        onPress={handleResetPassword}
                        loading={isLoading.resetPassword}
                        disabled={!isEmailReady}
                    />
                </>
            ) : null}

            {resetStep === "code" ? (
                <>
                    <EmailSentCard email={email} />

                    <AuthMessage message={message} />
                    <AuthMessage message={error} tone="error" />

                    <AuthCodeInput
                        label="Reset Code"
                        value={code}
                        onChangeText={(value) => {
                            setCode(value);
                            setError("");
                        }}
                    />

                    <AuthPrimaryButton
                        label="Continue"
                        onPress={handleContinueFromCode}
                        loading={isLoading.verifyPasswordResetCode}
                        disabled={
                            !isCodeReady || isLoading.verifyPasswordResetCode
                        }
                    />

                    <AuthTextButton
                        onPress={handleResendCode}
                        disabled={isResendDisabled}
                        emphasis={!isResendDisabled}
                    >
                        {resendCooldown > 0
                            ? `Resend code in ${resendCooldown}s`
                            : "Resend code"}
                    </AuthTextButton>
                </>
            ) : null}

            {resetStep === "password" ? (
                <>
                    <AuthMessage message={message} />
                    <AuthMessage message={error} tone="error" />

                    <AuthField
                        label="Password"
                        placeholder="Enter your new password"
                        value={password}
                        onChangeText={(value) => {
                            setPassword(value);
                            setError("");
                        }}
                        secureTextEntry={!showPassword}
                        autoComplete="new-password"
                        textContentType="newPassword"
                        icon={passwordIcon}
                        rightAccessory={
                            <PasswordVisibilityToggle
                                onPress={() => setShowPassword((prev) => !prev)}
                                visible={showPassword}
                            />
                        }
                    />

                    <AuthField
                        label="Confirm Password"
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChangeText={(value) => {
                            setConfirmPassword(value);
                            setError("");
                        }}
                        secureTextEntry={!showConfirmPassword}
                        autoComplete="new-password"
                        textContentType="newPassword"
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
                        label="Reset Password"
                        onPress={handleConfirmReset}
                        loading={isLoading.confirmPasswordReset}
                        disabled={!isResetReady}
                    />
                </>
            ) : null}

            <AuthTextButton onPress={handleReturnToLogin}>
                Back to Login
            </AuthTextButton>
        </AuthScaffold>
    );
};

const styles = StyleSheet.create({
    sheetTitle: {
        fontSize: 20,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 8,
    },
    sheetSubtitle: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: "center",
        marginBottom: 22,
    },
    emailSentCard: {
        alignItems: "center",
        marginTop: -4,
        marginBottom: 4,
    },
    mailBadge: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },
    noteBox: {
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 8,
    },
    noteText: {
        fontSize: 12,
        lineHeight: 17,
        textAlign: "center",
        fontWeight: "600",
    },
});

export default ForgotPassword;
