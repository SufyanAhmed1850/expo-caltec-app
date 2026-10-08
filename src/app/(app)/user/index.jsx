import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Linking,
    Modal,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { useAuth } from '@context/authContext';
import { Colors } from '@/src/constants/Colors';
import {
    AppRadii,
    AppSpacing,
    AppTypography,
    getAppPalette,
} from '@constants/appTheme';
import {
    IconPhone,
    IconProfile,
    IconSolarArrowLeftAlt,
    IconSolarArrowRightAlt,
    IconSolarBellOff,
    IconSolarBuildings,
    IconSolarCamera,
    IconSolarChevronDown,
    IconSolarDocumentText,
    IconSolarGlobal,
    IconSolarLetter,
    IconSolarLogout,
    IconSolarMoon,
    IconSolarQuestionCircle,
    IconSolarShieldCheck,
    IconSolarUsersGroupRounded,
} from '@constants/SvgIcons';

const THEME_OPTIONS = [
    {
        label: 'System',
        value: 'system',
        description: 'Follow your device appearance',
    },
    {
        label: 'Light',
        value: 'light',
        description: 'Keep Caltec bright and clean',
    },
    {
        label: 'Dark',
        value: 'dark',
        description: 'Use a darker low-glare layout',
    },
];

const getInitials = (name = '') => {
    const initials = name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');

    return initials || 'C';
};

const formatThemeLabel = (preference) =>
    THEME_OPTIONS.find((option) => option.value === preference)?.label ||
    'System';

const Section = ({ children, style }) => (
    <View style={[styles.section, style]}>{children}</View>
);

const SettingRow = ({
    colors,
    destructive,
    icon,
    label,
    onPress,
    right,
    subtitle,
}) => {
    const content = (
        <View style={styles.settingRowInner}>
            <View
                style={[
                    styles.settingIcon,
                    { backgroundColor: colors.cardSoft },
                    destructive && { backgroundColor: '#FDECF0' },
                ]}
            >
                {icon}
            </View>
            <View style={styles.settingTextWrap}>
                <Text
                    style={[
                        styles.settingLabel,
                        { color: destructive ? colors.danger : colors.text },
                    ]}
                >
                    {label}
                </Text>
                {!!subtitle && (
                    <Text style={[styles.settingSubtitle, { color: colors.muted }]}>
                        {subtitle}
                    </Text>
                )}
            </View>
            {right || (
                <IconSolarArrowRightAlt
                    size={18}
                    width={18}
                    height={18}
                    pathStroke={colors.muted}
                />
            )}
        </View>
    );

    if (!onPress) {
        return <View style={styles.settingRow}>{content}</View>;
    }

    return (
        <Pressable
            accessibilityRole='button'
            onPress={onPress}
            style={({ pressed }) => [
                styles.settingRow,
                pressed && styles.pressed,
            ]}
        >
            {content}
        </Pressable>
    );
};

const InfoInput = ({
    colors,
    editable = true,
    icon,
    keyboardType,
    label,
    onChangeText,
    placeholder,
    value,
}) => (
    <View style={[styles.inputRow, { borderColor: colors.border }]}>
        <View style={styles.inputLabelWrap}>
            {icon}
            <Text style={[styles.inputLabel, { color: colors.muted }]}>
                {label}
            </Text>
        </View>
        <TextInput
            value={value}
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            onChangeText={onChangeText}
            editable={editable}
            keyboardType={keyboardType}
            style={[
                styles.input,
                { color: editable ? colors.text : colors.muted },
            ]}
        />
    </View>
);

const ThemePicker = ({
    colors,
    onClose,
    onSelect,
    selectedTheme,
    visible,
}) => (
    <Modal
        transparent
        visible={visible}
        animationType='fade'
        onRequestClose={onClose}
    >
        <Pressable
            style={styles.modalScrim}
            onPress={onClose}
        >
            <Pressable
                style={[
                    styles.themeSheet,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    },
                ]}
                onPress={(event) => event.stopPropagation()}
            >
                <View style={styles.sheetHandle} />
                <Text style={[styles.sheetTitle, { color: colors.text }]}>
                    App appearance
                </Text>
                <Text style={[styles.sheetCopy, { color: colors.muted }]}>
                    Choose a theme, or let Caltec follow your device.
                </Text>

                {THEME_OPTIONS.map((option) => {
                    const selected = option.value === selectedTheme;

                    return (
                        <Pressable
                            key={option.value}
                            accessibilityRole='button'
                            onPress={() => onSelect(option.value)}
                            style={[
                                styles.themeOption,
                                { borderColor: colors.border },
                                selected && {
                                    borderColor: colors.primary,
                                    backgroundColor: colors.isDark
                                        ? '#222A3A'
                                        : '#EEF4FF',
                                },
                            ]}
                        >
                            <View>
                                <Text
                                    style={[
                                        styles.themeOptionTitle,
                                        { color: colors.text },
                                    ]}
                                >
                                    {option.label}
                                </Text>
                                <Text
                                    style={[
                                        styles.themeOptionCopy,
                                        { color: colors.muted },
                                    ]}
                                >
                                    {option.description}
                                </Text>
                            </View>
                            {selected && (
                                <View
                                    style={[
                                        styles.themeSelectedDot,
                                        { backgroundColor: colors.primary },
                                    ]}
                                />
                            )}
                        </Pressable>
                    );
                })}
            </Pressable>
        </Pressable>
    </Modal>
);

const getDialogTone = (colors, tone) => {
    if (tone === 'danger') {
        return {
            accent: colors.danger,
            soft: colors.isDark ? '#351D27' : '#FFF0F3',
            gradient: [colors.danger, '#F07B8E'],
        };
    }

    if (tone === 'success') {
        return {
            accent: colors.success,
            soft: colors.isDark ? '#173227' : '#EAF8F1',
            gradient: [colors.success, '#34C587'],
        };
    }

    return {
        accent: colors.primary,
        soft: colors.isDark ? '#17243A' : '#EEF4FF',
        gradient: [colors.primary, '#4DA8FF'],
    };
};

const AppDialog = ({ colors, dialog, onClose }) => {
    if (!dialog) {
        return null;
    }

    const tone = getDialogTone(colors, dialog.tone);
    const DialogIcon = dialog.icon;
    const handlePrimaryPress = () => {
        onClose();
        dialog.onPrimary?.();
    };
    const handleSecondaryPress = () => {
        onClose();
        dialog.onSecondary?.();
    };

    return (
        <Modal
            transparent
            visible
            animationType='fade'
            statusBarTranslucent
            navigationBarTranslucent
            onRequestClose={onClose}
        >
            <Pressable
                style={styles.dialogScrim}
                onPress={dialog.dismissible === false ? undefined : onClose}
            >
                <Pressable
                    style={[
                        styles.dialogCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            shadowColor: colors.shadow,
                        },
                    ]}
                    onPress={(event) => event.stopPropagation()}
                >
                    <View
                        style={[
                            styles.dialogAccent,
                            { backgroundColor: tone.soft },
                        ]}
                    >
                        <View
                            style={[
                                styles.dialogAccentDot,
                                { backgroundColor: tone.accent },
                            ]}
                        >
                            {!!DialogIcon && (
                                <DialogIcon
                                    width={21}
                                    height={21}
                                    pathStroke={Colors.light.white90}
                                />
                            )}
                        </View>
                    </View>
                    <Text style={[styles.dialogTitle, { color: colors.text }]}>
                        {dialog.title}
                    </Text>
                    {!!dialog.message && (
                        <Text
                            style={[
                                styles.dialogMessage,
                                { color: colors.secondary },
                            ]}
                        >
                            {dialog.message}
                        </Text>
                    )}
                    <View style={styles.dialogActions}>
                        <Pressable
                            accessibilityRole='button'
                            onPress={handlePrimaryPress}
                            style={({ pressed }) => [
                                styles.dialogPrimaryButton,
                                pressed && styles.pressed,
                            ]}
                        >
                            <LinearGradient
                                colors={tone.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.dialogPrimaryGradient}
                            >
                                <Text style={styles.dialogPrimaryText}>
                                    {dialog.primaryLabel || 'OK'}
                                </Text>
                            </LinearGradient>
                        </Pressable>

                        {!!dialog.secondaryLabel && (
                            <Pressable
                                accessibilityRole='button'
                                onPress={handleSecondaryPress}
                                style={({ pressed }) => [
                                    styles.dialogSecondaryButton,
                                    {
                                        borderColor: colors.border,
                                        backgroundColor: colors.cardSoft,
                                    },
                                    pressed && styles.pressed,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.dialogSecondaryText,
                                        { color: colors.text },
                                    ]}
                                >
                                    {dialog.secondaryLabel}
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default function Profile() {
    const systemScheme = useColorScheme();
    const {
        authUser,
        userProfile,
        logout,
        updateProfile,
        updateSettings,
        isLoading,
        refreshProfile,
    } = useAuth();
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [designation, setDesignation] = useState('');
    const [phone, setPhone] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [themePickerVisible, setThemePickerVisible] = useState(false);
    const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
    const [dialog, setDialog] = useState(null);
    const isAdmin = userProfile?.role === 'admin';
    const themePreference = userProfile?.themePreference || 'system';
    const resolvedTheme =
        themePreference === 'system' ? systemScheme || 'light' : themePreference;
    const colors = getAppPalette(resolvedTheme);

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name || '');
            setCompanyName(userProfile.companyName || '');
            setDesignation(userProfile.designation || '');
            setPhone(userProfile.phone || '');
            setProfileImage(userProfile.profileImage || null);
            setIsFormChanged(false);
        }
    }, [userProfile]);

    const showDialog = useCallback((options) => {
        setDialog(options);
    }, []);

    const closeDialog = useCallback(() => {
        setDialog(null);
    }, []);

    const handleLogout = useCallback(async () => {
        const response = await logout();
        if (!response.success) {
            showDialog({
                title: 'Could not log out',
                message: response.msg,
                primaryLabel: 'OK',
                tone: 'danger',
                icon: IconSolarLogout,
            });
        }
    }, [logout, showDialog]);

    const confirmLogout = () => {
        showDialog({
            title: 'Log out?',
            message: 'You will be logged out of Caltec on this device only.',
            primaryLabel: 'Log out',
            secondaryLabel: 'Cancel',
            tone: 'danger',
            icon: IconSolarLogout,
            onPrimary: handleLogout,
        });
    };

    const handleImagePick = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            showDialog({
                title: 'Photo access needed',
                message:
                    'Allow photo access from settings to update your profile picture.',
                primaryLabel: 'OK',
                icon: IconSolarCamera,
            });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            setIsFormChanged(true);
        }
    };

    const handleUpdate = async () => {
        const response = await updateProfile(
            name,
            companyName,
            designation,
            phone,
            profileImage
        );

        if (response.success) {
            showDialog({
                title: 'Profile saved',
                message: response.msg,
                primaryLabel: 'Great',
                tone: 'success',
                icon: IconSolarShieldCheck,
            });
            setIsFormChanged(false);
            return;
        }

        showDialog({
            title: 'Could not save profile',
            message: response.msg,
            primaryLabel: 'OK',
            tone: 'danger',
            icon: IconSolarDocumentText,
        });
    };

    const onRefresh = useCallback(async () => {
        const response = await refreshProfile();
        if (!response.success) {
            showDialog({
                title: 'Could not refresh profile',
                message: response.msg,
                primaryLabel: 'OK',
                tone: 'danger',
                icon: IconSolarDocumentText,
            });
        }
    }, [refreshProfile, showDialog]);

    const handleInputChange = (field, value) => {
        if (field === 'name') {
            setName(value);
        }

        if (field === 'companyName') {
            setCompanyName(value);
        }

        if (field === 'designation') {
            setDesignation(value);
        }

        if (field === 'phone') {
            setPhone(value);
        }

        setIsFormChanged(true);
    };

    const updateUserSettings = async (settings) => {
        const response = await updateSettings(settings);
        if (!response.success) {
            showDialog({
                title: 'Settings not saved',
                message: response.msg,
                primaryLabel: 'OK',
                tone: 'danger',
                icon: IconSolarDocumentText,
            });
        }

        return response;
    };

    const handleToggleNotifications = async (value) => {
        await updateUserSettings({ notificationsPaused: value });
    };

    const handleThemeSelect = async (value) => {
        setThemePickerVisible(false);
        await updateUserSettings({ themePreference: value });
    };

    const openWebsite = async (path = '') => {
        try {
            await Linking.openURL(`https://caltec.com.pk/${path}`);
        } catch {
            showDialog({
                title: 'Could not open website',
                message:
                    'Please check your connection and try opening the Caltec website again.',
                primaryLabel: 'OK',
                tone: 'danger',
                icon: IconSolarGlobal,
            });
        }
    };

    const showFaq = () => {
        showDialog({
            title: 'FAQ',
            message:
                'For service questions, quotation status, or calibration support, use the enquiry screen or contact Caltec through the official website.',
            primaryLabel: 'Contact Caltec',
            secondaryLabel: 'Close',
            icon: IconSolarQuestionCircle,
            onPrimary: () => openWebsite('contact-us/'),
        });
    };

    const showTerms = () => {
        showDialog({
            title: 'Terms of service',
            message:
                'Use Caltec services responsibly. Keep enquiry and profile details accurate so the team can prepare quotations and service support.',
            primaryLabel: 'Got it',
            icon: IconSolarDocumentText,
        });
    };

    const showPolicy = () => {
        showDialog({
            title: 'User policy',
            message:
                'Caltec uses account details to manage enquiries, quotations, calibration requests, and service communication.',
            primaryLabel: 'OK',
            icon: IconSolarShieldCheck,
        });
    };

    return (
        <SafeAreaView
            edges={['top', 'left', 'right']}
            style={[styles.safeArea, { backgroundColor: colors.page }]}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading.refreshProfile}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                        />
                    }
                >
                    <View style={styles.header}>
                        <TouchableOpacity
                            accessibilityRole='button'
                            accessibilityLabel='Go back'
                            style={[
                                styles.headerButton,
                                { backgroundColor: colors.card },
                            ]}
                            onPress={() =>
                                router.canGoBack()
                                    ? router.back()
                                    : router.navigate('/(app)/home')
                            }
                        >
                            <IconSolarArrowLeftAlt
                                width={23}
                                height={23}
                                pathStroke={colors.text}
                            />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>
                            Settings
                        </Text>
                        <View style={styles.headerSpacer} />
                    </View>

                    {!userProfile?.profileCompleted && (
                        <View
                            style={[
                                styles.noticeCard,
                                { backgroundColor: colors.card },
                                colors.isDark && styles.darkCardSurface,
                            ]}
                        >
                            <Text style={[styles.noticeTitle, { color: colors.text }]}>
                                Complete your profile
                            </Text>
                            <Text
                                style={[
                                    styles.noticeText,
                                    { color: colors.secondary },
                                ]}
                            >
                                Add your company, designation, and phone number
                                before submitting your first enquiry.
                            </Text>
                        </View>
                    )}

                    <View
                        style={[
                            styles.profileSection,
                            styles.profileCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                shadowColor: colors.shadow,
                            },
                            colors.isDark && styles.profileCardDark,
                        ]}
                    >
                        <View style={styles.avatarButton}>
                            <TouchableOpacity
                                accessibilityRole='button'
                                accessibilityLabel='Preview profile photo'
                                activeOpacity={0.82}
                                onPress={() => setImagePreviewVisible(true)}
                            >
                                {profileImage ? (
                                    <Image
                                        source={{ uri: profileImage }}
                                        style={styles.avatar}
                                    />
                                ) : (
                                    <View
                                        style={[
                                            styles.avatar,
                                            { backgroundColor: colors.primary },
                                        ]}
                                    >
                                        <Text style={styles.avatarInitials}>
                                            {getInitials(
                                                name || userProfile?.name
                                            )}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                accessibilityRole='button'
                                accessibilityLabel='Change profile photo'
                                style={[
                                    styles.cameraBadge,
                                    { backgroundColor: colors.accent },
                                ]}
                                onPress={handleImagePick}
                                activeOpacity={0.82}
                            >
                                <IconSolarCamera
                                    width={16}
                                    height={16}
                                    pathStroke={colors.white}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.profileCopy}>
                            <Text style={[styles.profileName, { color: colors.text }]}>
                                {name || 'Your Name'}
                            </Text>
                            <Text
                                style={[
                                    styles.profileMeta,
                                    { color: colors.secondary },
                                ]}
                            >
                                {authUser?.email ?? userProfile?.email ?? 'email'}
                            </Text>
                        </View>
                    </View>

                    <Section style={{ backgroundColor: colors.card }}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Edit profile
                        </Text>
                        <InfoInput
                            colors={colors}
                            label='Full name'
                            value={name}
                            placeholder='Your name'
                            onChangeText={(text) =>
                                handleInputChange('name', text)
                            }
                            icon={
                                <IconProfile
                                    width={19}
                                    height={19}
                                    pathStroke={colors.muted}
                                />
                            }
                        />
                        <InfoInput
                            colors={colors}
                            label='Company'
                            value={companyName}
                            placeholder='Company name'
                            onChangeText={(text) =>
                                handleInputChange('companyName', text)
                            }
                            icon={
                                <IconSolarBuildings
                                    width={19}
                                    height={19}
                                    pathStroke={colors.muted}
                                />
                            }
                        />
                        <InfoInput
                            colors={colors}
                            label='Designation'
                            value={designation}
                            placeholder='Your role'
                            onChangeText={(text) =>
                                handleInputChange('designation', text)
                            }
                            icon={
                                <IconSolarUsersGroupRounded
                                    width={19}
                                    height={19}
                                    pathStroke={colors.muted}
                                />
                            }
                        />
                        <InfoInput
                            colors={colors}
                            label='Phone'
                            value={phone}
                            placeholder='0000-0000-000'
                            keyboardType='phone-pad'
                            onChangeText={(text) =>
                                handleInputChange('phone', text)
                            }
                            icon={
                                <IconPhone
                                    width={19}
                                    height={19}
                                    pathStroke={colors.muted}
                                />
                            }
                        />
                        <InfoInput
                            colors={colors}
                            label='Email'
                            value={authUser?.email ?? userProfile?.email ?? ''}
                            editable={false}
                            icon={
                                <IconSolarLetter
                                    width={19}
                                    height={19}
                                    pathStroke={colors.muted}
                                />
                            }
                        />

                        <TouchableOpacity
                            accessibilityRole='button'
                            style={[
                                styles.primaryButton,
                                { backgroundColor: colors.primary },
                                (!isFormChanged || isLoading.updateProfile) &&
                                    styles.disabledButton,
                            ]}
                            onPress={handleUpdate}
                            disabled={!isFormChanged || isLoading.updateProfile}
                        >
                            {isLoading.updateProfile ? (
                                <ActivityIndicator color={colors.white} />
                            ) : (
                                <Text style={styles.primaryButtonText}>
                                    Save Changes
                                </Text>
                            )}
                        </TouchableOpacity>
                    </Section>

                    <Section style={{ backgroundColor: colors.card }}>
                        <SettingRow
                            colors={colors}
                            label='Pause notifications'
                            subtitle={
                                userProfile?.notificationsPaused
                                    ? 'Notifications are currently paused'
                                    : 'Keep service and enquiry alerts active'
                            }
                            icon={
                                <IconSolarBellOff
                                    width={19}
                                    height={19}
                                    pathStroke={colors.secondary}
                                />
                            }
                            right={
                                <Switch
                                    value={Boolean(userProfile?.notificationsPaused)}
                                    onValueChange={handleToggleNotifications}
                                    disabled={isLoading.updateSettings}
                                    trackColor={{
                                        false: colors.border,
                                        true: Colors.light.blue60,
                                    }}
                                    thumbColor={
                                        userProfile?.notificationsPaused
                                            ? colors.primary
                                            : colors.white
                                    }
                                />
                            }
                        />
                        <SettingRow
                            colors={colors}
                            label='Appearance'
                            subtitle={`Current: ${formatThemeLabel(themePreference)}`}
                            onPress={() => setThemePickerVisible(true)}
                            icon={
                                <IconSolarMoon
                                    width={19}
                                    height={19}
                                    pathStroke={colors.secondary}
                                />
                            }
                            right={
                                <View style={styles.rowValue}>
                                    <Text
                                        style={[
                                            styles.rowValueText,
                                            { color: colors.primary },
                                        ]}
                                    >
                                        {formatThemeLabel(themePreference)}
                                    </Text>
                                    <IconSolarChevronDown
                                        width={17}
                                        height={17}
                                        pathStroke={colors.primary}
                                    />
                                </View>
                            }
                        />
                    </Section>

                    <Section style={{ backgroundColor: colors.card }}>
                        <SettingRow
                            colors={colors}
                            label='FAQ'
                            onPress={showFaq}
                            icon={
                                <IconSolarQuestionCircle
                                    width={19}
                                    height={19}
                                    pathStroke={colors.secondary}
                                />
                            }
                        />
                        <SettingRow
                            colors={colors}
                            label='Terms of service'
                            onPress={showTerms}
                            icon={
                                <IconSolarDocumentText
                                    width={19}
                                    height={19}
                                    pathStroke={colors.secondary}
                                />
                            }
                        />
                        <SettingRow
                            colors={colors}
                            label='User policy'
                            onPress={showPolicy}
                            icon={
                                <IconSolarShieldCheck
                                    width={19}
                                    height={19}
                                    pathStroke={colors.secondary}
                                />
                            }
                        />
                        <SettingRow
                            colors={colors}
                            label='Contact Caltec'
                            subtitle='Open the official website'
                            onPress={() => openWebsite('contact-us/')}
                            icon={
                                <IconSolarGlobal
                                    width={19}
                                    height={19}
                                    pathStroke={colors.secondary}
                                />
                            }
                        />
                    </Section>

                    {isAdmin && (
                        <TouchableOpacity
                            accessibilityRole='button'
                            style={[
                                styles.adminButton,
                                { backgroundColor: colors.card },
                            ]}
                            onPress={() => router.navigate('/(app)/user/usersList')}
                        >
                            <IconSolarUsersGroupRounded
                                width={20}
                                height={20}
                                pathStroke={colors.primary}
                            />
                            <Text
                                style={[
                                    styles.adminButtonText,
                                    { color: colors.primary },
                                ]}
                            >
                                View All Users
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        accessibilityRole='button'
                        style={[
                            styles.logoutButton,
                            { backgroundColor: colors.card },
                        ]}
                        onPress={confirmLogout}
                    >
                        <IconSolarLogout
                            width={20}
                            height={20}
                            pathStroke={colors.danger}
                        />
                        <Text
                            style={[
                                styles.logoutButtonText,
                                { color: colors.danger },
                            ]}
                        >
                            Log Out
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            <ThemePicker
                colors={colors}
                visible={themePickerVisible}
                selectedTheme={themePreference}
                onClose={() => setThemePickerVisible(false)}
                onSelect={handleThemeSelect}
            />

            <AppDialog
                colors={colors}
                dialog={dialog}
                onClose={closeDialog}
            />

            <Modal
                transparent
                visible={imagePreviewVisible}
                animationType='fade'
                onRequestClose={() => setImagePreviewVisible(false)}
            >
                <Pressable
                    style={styles.previewScrim}
                    onPress={() => setImagePreviewVisible(false)}
                >
                    <Pressable onPress={(event) => event.stopPropagation()}>
                        {profileImage ? (
                            <Image
                                source={{ uri: profileImage }}
                                style={styles.previewImage}
                            />
                        ) : (
                            <View
                                style={[
                                    styles.previewImage,
                                    styles.previewInitialsWrap,
                                    { backgroundColor: colors.primary },
                                ]}
                            >
                                <Text style={styles.previewInitials}>
                                    {getInitials(name || userProfile?.name)}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        paddingHorizontal: AppSpacing.screenX,
        paddingTop: AppSpacing.screenTop,
        paddingBottom: 0,
    },
    header: {
        minHeight: 46,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    headerButton: {
        width: 42,
        height: 42,
        borderRadius: AppRadii.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        ...AppTypography.cardTitle,
    },
    headerSpacer: {
        width: 42,
    },
    noticeCard: {
        borderRadius: AppRadii.xl,
        padding: AppSpacing.card,
        marginBottom: AppSpacing.sectionGap,
    },
    noticeTitle: {
        ...AppTypography.cardTitle,
        marginBottom: 6,
    },
    noticeText: {
        ...AppTypography.body,
    },
    section: {
        borderRadius: AppRadii.xl,
        marginBottom: AppSpacing.sectionGap,
        overflow: 'hidden',
    },
    profileSection: {
        borderRadius: AppRadii.xl,
        marginBottom: AppSpacing.sectionGap,
    },
    profileCard: {
        minHeight: 104,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        padding: 16,
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.14,
        shadowRadius: 24,
        elevation: 5,
    },
    profileCardDark: {
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        borderColor: 'rgba(255,255,255,0.04)',
    },
    darkCardSurface: {
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.04)',
    },
    avatarButton: {
        width: 72,
        height: 72,
        marginRight: 14,
        zIndex: 1,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitials: {
        color: Colors.light.white90,
        fontSize: 24,
        fontWeight: '900',
    },
    cameraBadge: {
        position: 'absolute',
        right: -1,
        bottom: -1,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewScrim: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.72)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    previewImage: {
        width: 300,
        height: 300,
        borderRadius: 150,
    },
    previewInitialsWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewInitials: {
        color: Colors.light.white90,
        fontSize: 74,
        fontWeight: '900',
    },
    profileCopy: {
        flex: 1,
        minWidth: 0,
        zIndex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 5,
    },
    profileMeta: {
        fontSize: 13,
        lineHeight: 18,
    },
    sectionTitle: {
        ...AppTypography.cardTitle,
        paddingHorizontal: AppSpacing.card,
        paddingTop: AppSpacing.card,
        paddingBottom: 4,
    },
    inputRow: {
        minHeight: 58,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputLabelWrap: {
        width: 118,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '700',
    },
    input: {
        flex: 1,
        minHeight: 48,
        textAlign: 'right',
        fontSize: 15,
        fontWeight: '600',
    },
    primaryButton: {
        minHeight: 54,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16,
        marginTop: 18,
    },
    disabledButton: {
        opacity: 0.45,
    },
    primaryButtonText: {
        color: Colors.light.white90,
        fontSize: 16,
        fontWeight: '900',
    },
    settingRow: {
        minHeight: 64,
        justifyContent: 'center',
    },
    settingRowInner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    pressed: {
        opacity: 0.76,
    },
    settingIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingTextWrap: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '900',
    },
    settingSubtitle: {
        marginTop: 3,
        ...AppTypography.caption,
        fontWeight: '600',
    },
    rowValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rowValueText: {
        fontSize: 13,
        fontWeight: '800',
    },
    adminButton: {
        minHeight: 54,
        borderRadius: 22,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 14,
    },
    adminButtonText: {
        fontSize: 15,
        fontWeight: '900',
    },
    logoutButton: {
        minHeight: 54,
        borderRadius: 22,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
        marginBottom: 12,
    },
    logoutButtonText: {
        fontSize: 15,
        fontWeight: '900',
    },
    modalScrim: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.44)',
        justifyContent: 'flex-end',
        padding: 18,
    },
    themeSheet: {
        borderRadius: 28,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 18,
        paddingBottom: 22,
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.2,
        shadowRadius: 30,
        elevation: 12,
    },
    sheetHandle: {
        width: 44,
        height: 5,
        borderRadius: 3,
        backgroundColor: Colors.light.black10,
        alignSelf: 'center',
        marginBottom: 16,
    },
    sheetTitle: {
        ...AppTypography.sectionTitle,
        marginBottom: 6,
    },
    sheetCopy: {
        ...AppTypography.body,
        marginBottom: 14,
    },
    themeOption: {
        minHeight: 66,
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    themeOptionTitle: {
        fontSize: 15,
        fontWeight: '900',
        marginBottom: 3,
    },
    themeOptionCopy: {
        fontSize: 12,
        lineHeight: 16,
    },
    themeSelectedDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    dialogScrim: {
        flex: 1,
        backgroundColor: 'rgba(3,8,16,0.78)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 22,
    },
    dialogCard: {
        width: '100%',
        maxWidth: 356,
        borderRadius: 28,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 22,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.25,
        shadowRadius: 32,
        elevation: 18,
        overflow: 'hidden',
    },
    dialogAccent: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    dialogAccentDot: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dialogTitle: {
        ...AppTypography.sectionTitle,
        textAlign: 'center',
        marginBottom: 8,
    },
    dialogMessage: {
        ...AppTypography.body,
        textAlign: 'center',
    },
    dialogActions: {
        width: '100%',
        marginTop: 22,
        gap: 10,
    },
    dialogPrimaryButton: {
        borderRadius: 18,
        overflow: 'hidden',
    },
    dialogPrimaryGradient: {
        minHeight: 52,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dialogPrimaryText: {
        color: Colors.light.white90,
        fontSize: 15,
        fontWeight: '900',
    },
    dialogSecondaryButton: {
        minHeight: 50,
        borderRadius: 18,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dialogSecondaryText: {
        fontSize: 15,
        fontWeight: '900',
    },
});
