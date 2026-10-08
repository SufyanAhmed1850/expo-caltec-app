import React, {
    cloneElement,
    createContext,
    isValidElement,
    useContext,
    useRef,
    useState,
} from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    useWindowDimensions,
    View,
} from 'react-native';
import Animated, {
    Easing,
    FadeIn,
    Keyframe,
    Layout,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { TouchableRipple } from 'react-native-paper';

import { Colors } from '@constants/Colors';
import { getAppPalette } from '@constants/appTheme';

const AUTH_MOTION = {
    item: FadeIn.duration(180)
        .easing(Easing.out(Easing.cubic))
        .withInitialValues({
            opacity: 0,
            transform: [{ translateY: 6 }],
        }),
    message: FadeIn.duration(160)
        .easing(Easing.out(Easing.cubic))
        .withInitialValues({
            opacity: 0,
            transform: [{ translateY: 4 }],
        }),
    layout: Layout.duration(220).easing(Easing.out(Easing.cubic)),
};

const getAuthPalette = (mode = 'light') => {
    const palette = getAppPalette(mode);

    return {
        ...palette,
        pageDeep: palette.isDark ? '#111826' : '#E4EAF5',
        sheet: palette.card,
        field: palette.input,
        fieldFocused: palette.isDark ? '#242B3A' : Colors.light.white90,
        note: palette.isDark ? '#17243A' : Colors.light.blue10,
        errorSoft: palette.isDark ? '#351D27' : '#FDECF0',
        successSoft: palette.isDark ? '#173227' : Colors.light.green10,
        disabled: palette.isDark ? '#2D3544' : '#CAD3E0',
    };
};

const AuthThemeContext = createContext(getAuthPalette('light'));
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const useAuthTheme = () => useContext(AuthThemeContext);

export const AuthScaffold = ({
    children,
    enterFrom = 'right',
    exitTo = 'left',
    footer,
    subtitle,
    title,
}) => {
    const { height, width } = useWindowDimensions();
    const systemScheme = useColorScheme();
    const colors = getAuthPalette(systemScheme === 'dark' ? 'dark' : 'light');
    const isCompactWidth = width < 370;
    const isShortScreen = height < 720;
    const enterOffset = enterFrom === 'left' ? -42 : 42;
    const exitOffset = exitTo === 'left' ? -42 : 42;
    const sheetEnterAnimation = new Keyframe({
        0: {
            opacity: 0.5,
            transform: [{ translateX: enterOffset }, { scale: 0.992 }],
            easing: Easing.out(Easing.cubic),
        },
        100: {
            opacity: 1,
            transform: [{ translateX: 0 }, { scale: 1 }],
        },
    }).duration(240);
    const sheetExitAnimation = new Keyframe({
        0: {
            opacity: 1,
            transform: [{ translateX: 0 }, { scale: 1 }],
            easing: Easing.in(Easing.cubic),
        },
        100: {
            opacity: 0,
            transform: [{ translateX: exitOffset }, { scale: 0.992 }],
        },
    }).duration(190);

    return (
        <AuthThemeContext.Provider value={colors}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.container, { backgroundColor: colors.page }]}
            >
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.scrollContent,
                        { backgroundColor: colors.page },
                        isCompactWidth && styles.scrollContentCompact,
                        isShortScreen && styles.scrollContentShort,
                    ]}
                >
                    <View style={styles.body}>
                        <Animated.View
                            entering={sheetEnterAnimation}
                            exiting={sheetExitAnimation}
                            layout={AUTH_MOTION.layout}
                            style={[
                                styles.sheet,
                                {
                                    backgroundColor: colors.sheet,
                                    borderColor: colors.border,
                                    shadowColor: colors.isDark
                                        ? 'transparent'
                                        : colors.shadow,
                                    shadowOffset: colors.isDark
                                        ? { width: 0, height: 0 }
                                        : { width: 0, height: 18 },
                                    shadowOpacity: colors.isDark ? 0 : 0.2,
                                    shadowRadius: colors.isDark ? 0 : 28,
                                    elevation: colors.isDark ? 0 : 8,
                                },
                            ]}
                        >
                            {!!title && (
                                <Text
                                    style={[
                                        styles.heroTitle,
                                        { color: colors.text },
                                        isCompactWidth &&
                                            styles.heroTitleCompact,
                                    ]}
                                >
                                    {title}
                                </Text>
                            )}
                            {!!subtitle && (
                                <Text
                                    style={[
                                        styles.heroSubtitle,
                                        { color: colors.muted },
                                    ]}
                                >
                                    {subtitle}
                                </Text>
                            )}
                            {children}
                        </Animated.View>

                        {footer ? (
                            <View
                                style={[
                                    styles.footer,
                                    { backgroundColor: colors.page },
                                ]}
                            >
                                {footer}
                            </View>
                        ) : null}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </AuthThemeContext.Provider>
    );
};

export const AuthModeTabs = ({ active, onLoginPress, onSignUpPress }) => {
    const colors = useAuthTheme();
    const loginActive = active === 'login';
    const signupActive = active === 'signup';

    return (
        <View style={[styles.modeTabs, { backgroundColor: colors.field }]}>
            <TouchableRipple
                onPress={onLoginPress}
                style={[
                    styles.modeTab,
                    loginActive && {
                        backgroundColor: colors.primary,
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: colors.isDark ? 0.12 : 0.18,
                        shadowRadius: 10,
                        elevation: 2,
                    },
                ]}
                rippleColor='rgba(17, 28, 34, 0.08)'
                borderless
            >
                <Text
                    style={[
                        styles.modeText,
                        {
                            color: loginActive ? colors.white : colors.muted,
                        },
                    ]}
                >
                    Login
                </Text>
            </TouchableRipple>

            <TouchableRipple
                onPress={onSignUpPress}
                style={[
                    styles.modeTab,
                    signupActive && {
                        backgroundColor: colors.primary,
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: colors.isDark ? 0.12 : 0.18,
                        shadowRadius: 10,
                        elevation: 2,
                    },
                ]}
                rippleColor='rgba(17, 28, 34, 0.08)'
                borderless
            >
                <Text
                    style={[
                        styles.modeText,
                        {
                            color: signupActive ? colors.white : colors.muted,
                        },
                    ]}
                >
                    Sign Up
                </Text>
            </TouchableRipple>
        </View>
    );
};

export const AuthField = ({
    autoCapitalize = 'none',
    autoComplete,
    autoCorrect = false,
    error,
    icon,
    keyboardType,
    label,
    onChangeText,
    placeholder,
    rightAccessory,
    secureTextEntry,
    textContentType,
    value,
}) => {
    const colors = useAuthTheme();
    const [focused, setFocused] = useState(false);
    const focusProgress = useSharedValue(0);

    const animatedShellStyle = useAnimatedStyle(() => ({
        transform: [{ scale: 1 + focusProgress.value * 0.01 }],
        shadowOpacity: focusProgress.value * (colors.isDark ? 0.08 : 0.14),
        elevation: focusProgress.value ? 2 : 0,
    }));

    const handleFocus = () => {
        setFocused(true);
        focusProgress.value = withTiming(1, {
            duration: 170,
            easing: Easing.out(Easing.cubic),
        });
    };

    const handleBlur = () => {
        setFocused(false);
        focusProgress.value = withTiming(0, {
            duration: 150,
            easing: Easing.out(Easing.cubic),
        });
    };

    return (
        <Animated.View
            entering={AUTH_MOTION.item}
            layout={AUTH_MOTION.layout}
            style={styles.fieldGroup}
        >
            <Text style={[styles.fieldLabel, { color: colors.text }]}>
                {label}
            </Text>
            <Animated.View
                style={[
                    styles.fieldShell,
                    {
                        backgroundColor: focused
                            ? colors.fieldFocused
                            : colors.field,
                        borderColor: error
                            ? colors.danger
                            : focused
                              ? colors.primary
                              : 'transparent',
                        shadowColor: colors.primary,
                    },
                    animatedShellStyle,
                ]}
            >
                {icon ? (
                    <View style={styles.fieldIcon}>
                        {isValidElement(icon)
                            ? cloneElement(icon, { pathStroke: colors.muted })
                            : icon}
                    </View>
                ) : null}
                <TextInput
                    style={[styles.fieldInput, { color: colors.text }]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.muted}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={autoCorrect}
                    autoComplete={autoComplete}
                    textContentType={textContentType}
                />
                {rightAccessory ? (
                    <View style={styles.fieldAccessory}>{rightAccessory}</View>
                ) : null}
            </Animated.View>
            {!!error && (
                <Animated.Text
                    entering={AUTH_MOTION.message}
                    style={[styles.errorText, { color: colors.danger }]}
                >
                    {error}
                </Animated.Text>
            )}
        </Animated.View>
    );
};

export const AuthCodeInput = ({
    error,
    label = 'Code',
    length = 6,
    onChangeText,
    value,
}) => {
    const colors = useAuthTheme();
    const inputRef = useRef(null);
    const digits = Array.from({ length }, (_, index) => value[index] || '');

    const handleChangeText = (nextValue) => {
        onChangeText(nextValue.replace(/\D/g, '').slice(0, length));
    };

    return (
        <Animated.View
            entering={AUTH_MOTION.item}
            layout={AUTH_MOTION.layout}
            style={styles.fieldGroup}
        >
            <Text
                style={[
                    styles.fieldLabel,
                    styles.centerLabel,
                    { color: colors.text },
                ]}
            >
                {label}
            </Text>
            <Pressable
                onPress={() => inputRef.current?.focus()}
                style={styles.codeRow}
            >
                {digits.map((digit, index) => (
                    <Animated.View
                        key={`${index}-${digit || 'empty'}`}
                        layout={AUTH_MOTION.layout}
                        style={[
                            styles.codeBox,
                            {
                                backgroundColor:
                                    index === value.length
                                        ? colors.fieldFocused
                                        : colors.field,
                                borderColor: error
                                    ? colors.danger
                                    : index === value.length
                                      ? colors.primary
                                      : 'transparent',
                            },
                        ]}
                    >
                        <Text style={[styles.codeDigit, { color: colors.text }]}>
                            {digit || '-'}
                        </Text>
                    </Animated.View>
                ))}
            </Pressable>
            <TextInput
                ref={inputRef}
                value={value}
                onChangeText={handleChangeText}
                keyboardType='number-pad'
                textContentType='oneTimeCode'
                maxLength={length}
                style={styles.hiddenCodeInput}
            />
            {!!error && (
                <Animated.Text
                    entering={AUTH_MOTION.message}
                    style={[
                        styles.errorText,
                        styles.centerText,
                        { color: colors.danger },
                    ]}
                >
                    {error}
                </Animated.Text>
            )}
        </Animated.View>
    );
};

export const AuthMessage = ({ message, tone = 'info' }) => {
    const colors = useAuthTheme();

    if (!message) {
        return null;
    }

    return (
        <Animated.View
            entering={AUTH_MOTION.message}
            layout={AUTH_MOTION.layout}
            style={[
                styles.messageBanner,
                {
                    backgroundColor:
                        tone === 'error' ? colors.errorSoft : colors.successSoft,
                },
            ]}
        >
            <Text
                style={[
                    styles.messageText,
                    {
                        color:
                            tone === 'error' ? colors.danger : colors.success,
                    },
                ]}
            >
                {message}
            </Text>
        </Animated.View>
    );
};

export const AuthPrimaryButton = ({
    disabled,
    label,
    loading,
    onPress,
}) => {
    const colors = useAuthTheme();
    const isDisabled = Boolean(disabled || loading);
    const scale = useSharedValue(1);
    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        if (!isDisabled) {
            scale.value = withSpring(0.975, { damping: 13, stiffness: 260 });
        }
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 12, stiffness: 240 });
    };

    return (
        <AnimatedPressable
            accessibilityRole='button'
            accessibilityState={{
                busy: Boolean(loading),
                disabled: isDisabled,
            }}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
                styles.primaryButton,
                isDisabled
                    ? {
                          backgroundColor: colors.disabled,
                          shadowOpacity: 0,
                          elevation: 0,
                      }
                    : {
                          backgroundColor: colors.primary,
                          shadowColor: colors.primary,
                          shadowOffset: { width: 0, height: 12 },
                          shadowOpacity: colors.isDark ? 0.1 : 0.24,
                          shadowRadius: colors.isDark ? 12 : 18,
                          elevation: colors.isDark ? 2 : 6,
                      },
                animatedButtonStyle,
            ]}
            onPress={onPress}
            disabled={isDisabled}
        >
            {loading ? (
                <ActivityIndicator color={Colors.light.white90} />
            ) : (
                <Text
                    style={[
                        styles.primaryButtonText,
                        isDisabled && styles.primaryButtonTextDisabled,
                    ]}
                >
                    {label}
                </Text>
            )}
        </AnimatedPressable>
    );
};

export const AuthTextButton = ({
    children,
    disabled,
    emphasis = false,
    onPress,
}) => {
    const colors = useAuthTheme();
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={() => {
                if (!disabled) {
                    scale.value = withSequence(
                        withTiming(0.97, { duration: 90 }),
                        withTiming(1, {
                            duration: 140,
                            easing: Easing.out(Easing.cubic),
                        })
                    );
                }
            }}
            disabled={disabled}
            style={[
                styles.textButton,
                disabled && styles.textButtonDisabled,
                animatedStyle,
            ]}
        >
            <Text
                style={[
                    styles.textButtonLabel,
                    {
                        color: emphasis ? colors.primary : colors.muted,
                    },
                ]}
            >
                {children}
            </Text>
        </AnimatedPressable>
    );
};

export const authUi = getAuthPalette('light');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 24,
    },
    scrollContentCompact: {
        paddingHorizontal: 16,
    },
    scrollContentShort: {
        paddingTop: 6,
        paddingBottom: 14,
    },
    body: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    heroTitle: {
        fontSize: 25,
        fontWeight: '800',
        letterSpacing: 0.2,
        lineHeight: 33,
        marginBottom: 8,
        textAlign: 'center',
    },
    heroTitleCompact: {
        fontSize: 22,
        lineHeight: 29,
    },
    heroSubtitle: {
        fontSize: 13,
        lineHeight: 19,
        textAlign: 'center',
        marginBottom: 22,
    },
    sheet: {
        width: '100%',
        maxWidth: 440,
        alignSelf: 'center',
        marginTop: 0,
        borderRadius: 32,
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 18,
        borderWidth: StyleSheet.hairlineWidth,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 22,
    },
    modeTabs: {
        flexDirection: 'row',
        borderRadius: 999,
        padding: 4,
        marginBottom: 18,
    },
    modeTab: {
        flex: 1,
        minHeight: 44,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modeText: {
        fontSize: 15,
        fontWeight: '600',
    },
    fieldGroup: {
        marginBottom: 14,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 9,
    },
    centerLabel: {
        textAlign: 'center',
    },
    fieldShell: {
        minHeight: 58,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 22,
        paddingHorizontal: 16,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
    },
    fieldIcon: {
        marginRight: 10,
    },
    fieldInput: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 12,
    },
    fieldAccessory: {
        marginLeft: 8,
    },
    errorText: {
        fontSize: 12,
        lineHeight: 17,
        marginTop: 7,
    },
    centerText: {
        textAlign: 'center',
    },
    codeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    codeBox: {
        flex: 1,
        minHeight: 56,
        borderRadius: 17,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    codeDigit: {
        fontSize: 22,
        fontWeight: '800',
    },
    hiddenCodeInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
    },
    messageBanner: {
        borderRadius: 18,
        padding: 13,
        marginBottom: 15,
    },
    messageText: {
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
        fontWeight: '600',
    },
    primaryButton: {
        minHeight: 56,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        overflow: 'hidden',
    },
    primaryButtonText: {
        color: Colors.light.white90,
        fontSize: 16,
        fontWeight: '800',
    },
    primaryButtonTextDisabled: {
        color: 'rgba(255,255,255,0.82)',
    },
    textButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 11,
        paddingHorizontal: 6,
        alignSelf: 'center',
    },
    textButtonDisabled: {
        opacity: 0.45,
    },
    textButtonLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
});
