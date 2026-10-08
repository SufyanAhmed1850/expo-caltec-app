import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useAuth } from '@context/authContext';
import { useEnquiry } from '@/src/context/enquiryContext';
import {
    AppRadii,
    AppSpacing,
    AppTypography,
    formatCurrency,
    getAppPalette,
    resolveThemePreference,
    sanitizeNumberInput,
} from '@constants/appTheme';
import {
    IconDelete,
    IconEnquiry,
    IconSearch,
    IconSolarChevronDown,
    IconSolarDocumentText,
    IconSolarShieldCheck,
} from '@constants/SvgIcons';

const CALIBRATION_PLACES = [
    {
        label: 'Site',
        value: 'Site',
        description: 'Caltec team visits your facility.',
    },
    {
        label: 'Lab',
        value: 'Lab',
        description: 'Instruments are calibrated at Caltec lab.',
    },
    {
        label: 'Both',
        value: 'Both',
        description: 'Use lab and site calibration as needed.',
    },
];

const emptyInstrument = () => ({
    name: '',
    quantity: '1',
    customPrice: '',
});

const getInitialFormData = (authUser, userProfile) => ({
    companyName: userProfile?.companyName || '',
    address: '',
    contactPerson: userProfile?.name || '',
    designation: userProfile?.designation || '',
    phone: userProfile?.phone || '',
    fax: '',
    email: authUser?.email || '',
    placeOfCalibration: 'Site',
    instruments: [emptyInstrument()],
    comments: '',
    discountPercentage: '',
});

const getServicePrice = (services, name) =>
    Number(services.find((service) => service.name === name)?.price) || 0;

const calculateTotals = (formData, services) => {
    const discount = Number(formData.discountPercentage) || 0;

    return formData.instruments.reduce(
        (totals, instrument) => {
            const price = getServicePrice(services, instrument.name);
            const quantity = Number(instrument.quantity) || 0;
            const customPrice = Number(instrument.customPrice) || 0;
            const selectedPrice =
                discount > 0 ? price : customPrice > 0 ? customPrice : price;

            return {
                totalAmount: totals.totalAmount + price * quantity,
                discountedAmount:
                    totals.discountedAmount + selectedPrice * quantity,
            };
        },
        { totalAmount: 0, discountedAmount: 0 }
    );
};

const getValidationMessage = (formData, profileIsComplete, authUser, userProfile) => {
    if (!profileIsComplete) {
        return 'Complete your profile before submitting an enquiry.';
    }

    if (!authUser || !userProfile) {
        return 'Please sign in again before submitting an enquiry.';
    }

    const requiredFields = [
        ['Company name', formData.companyName],
        ['Address', formData.address],
        ['Contact person', formData.contactPerson],
        ['Designation', formData.designation],
        ['Phone', formData.phone],
        ['Email', formData.email],
    ];
    const missing = requiredFields.find(([, value]) => !String(value).trim());

    if (missing) {
        return `${missing[0]} is required.`;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
        return 'Enter a valid email address.';
    }

    const invalidInstrument = formData.instruments.find(
        (instrument) =>
            !instrument.name ||
            !Number.isInteger(Number(instrument.quantity)) ||
            Number(instrument.quantity) < 1
    );

    if (invalidInstrument) {
        return 'Select an instrument and enter a quantity of at least 1.';
    }

    const discount = Number(formData.discountPercentage);
    if (
        formData.discountPercentage !== '' &&
        (Number.isNaN(discount) || discount < 0 || discount > 100)
    ) {
        return 'Discount must be between 0 and 100.';
    }

    return '';
};

const Field = ({
    colors,
    keyboardType,
    label,
    multiline,
    onChangeText,
    placeholder,
    value,
    maxLength = 120,
}) => (
    <View style={styles.fieldWrap}>
        <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text>
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            keyboardType={keyboardType}
            multiline={multiline}
            maxLength={maxLength}
            style={[
                styles.input,
                multiline && styles.multilineInput,
                {
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    color: colors.text,
                },
            ]}
        />
    </View>
);

const ServicePicker = ({
    colors,
    onClose,
    onSelect,
    services,
    selectedName,
    visible,
}) => {
    const [query, setQuery] = useState('');
    const { height, width } = useWindowDimensions();
    const isShortScreen = height < 720;
    const isCompactWidth = width < 370;
    const filteredServices = services.filter((service) =>
        service.name.toLowerCase().includes(query.trim().toLowerCase())
    );

    useEffect(() => {
        if (!visible) {
            setQuery('');
        }
    }, [visible]);

    return (
        <Modal
            transparent
            visible={visible}
            animationType='fade'
            statusBarTranslucent
            navigationBarTranslucent
            onRequestClose={onClose}
        >
            <Pressable
                style={[styles.modalScrim, { backgroundColor: colors.overlay }]}
                onPress={onClose}
            >
                <Pressable
                style={[
                    styles.serviceSheet,
                    isShortScreen && styles.serviceSheetCompact,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        maxHeight: Math.min(height * 0.82, 680),
                    },
                ]}
                onPress={(event) => event.stopPropagation()}
            >
                <View style={styles.sheetHandle} />
                <View style={styles.sheetHeader}>
                    <View style={styles.sheetHeaderCopy}>
                        <Text style={[styles.sheetTitle, { color: colors.text }]}>
                            Select instrument
                        </Text>
                        <Text style={[styles.sheetCopy, { color: colors.muted }]}>
                            Search and choose one active service for this line.
                        </Text>
                    </View>
                    <Text
                        style={[
                            styles.serviceCount,
                            { color: colors.secondary },
                        ]}
                    >
                        {filteredServices.length}
                    </Text>
                </View>
                <View
                    style={[
                        styles.searchBox,
                            {
                                backgroundColor: colors.input,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <IconSearch
                            width={20}
                            height={20}
                            pathStroke={colors.muted}
                        />
                        <TextInput
                            value={query}
                            onChangeText={setQuery}
                            placeholder='Search services'
                            placeholderTextColor={colors.muted}
                        style={[styles.searchInput, { color: colors.text }]}
                        maxLength={80}
                    />
                </View>
                    <ScrollView
                        style={styles.serviceList}
                        contentContainerStyle={[
                            styles.serviceListContent,
                            isShortScreen && styles.serviceListContentCompact,
                        ]}
                        keyboardShouldPersistTaps='handled'
                        showsVerticalScrollIndicator={false}
                    >
                        {filteredServices.length === 0 && (
                            <View
                                style={[
                                    styles.serviceEmptyCard,
                                    {
                                        backgroundColor: colors.cardSoft,
                                        borderColor: colors.border,
                                    },
                                ]}
                            >
                                <IconSolarDocumentText
                                    width={26}
                                    height={26}
                                    pathStroke={colors.muted}
                                />
                                <Text
                                    style={[
                                        styles.serviceEmptyTitle,
                                        { color: colors.text },
                                    ]}
                                >
                                    No services found
                                </Text>
                                <Text
                                    style={[
                                        styles.serviceEmptyCopy,
                                        { color: colors.muted },
                                    ]}
                                >
                                    Try a shorter search term.
                                </Text>
                            </View>
                        )}
                        {filteredServices.map((service) => {
                            const selected = selectedName === service.name;

                            return (
                                <Pressable
                                    key={service.id || service._id || service.name}
                                    accessibilityRole='button'
                                    onPress={() => {
                                        onSelect(service.name);
                                        onClose();
                                    }}
                                    style={[
                                        styles.serviceOption,
                                        isCompactWidth &&
                                            styles.serviceOptionCompact,
                                        {
                                            backgroundColor: selected
                                                ? colors.cardSoft
                                                : colors.card,
                                            borderColor: selected
                                                ? colors.primary
                                                : colors.border,
                                        },
                                    ]}
                                >
                                    <View style={styles.serviceOptionCopy}>
                                        <Text
                                            style={[
                                                styles.serviceName,
                                                { color: colors.text },
                                            ]}
                                            numberOfLines={2}
                                        >
                                            {service.name}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.servicePrice,
                                                {
                                                    color: selected
                                                        ? colors.primary
                                                        : colors.muted,
                                                },
                                            ]}
                                        >
                                            {formatCurrency(service.price)}
                                        </Text>
                                    </View>
                                    {selected && (
                                        <IconSolarShieldCheck
                                            width={20}
                                            height={20}
                                            pathStroke={colors.primary}
                                        />
                                    )}
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const CalibrationPlacePicker = ({
    colors,
    onClose,
    onSelect,
    selectedValue,
    visible,
}) => (
    <Modal
        transparent
        visible={visible}
        animationType='fade'
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={onClose}
    >
        <Pressable
            style={[styles.modalScrim, { backgroundColor: colors.overlay }]}
            onPress={onClose}
        >
            <Pressable
                style={[
                    styles.placeSheet,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    },
                ]}
                onPress={(event) => event.stopPropagation()}
            >
                <View style={styles.sheetHandle} />
                <Text style={[styles.sheetTitle, { color: colors.text }]}>
                    Place of calibration
                </Text>
                <Text style={[styles.sheetCopy, { color: colors.muted }]}>
                    Choose where this enquiry should be handled.
                </Text>

                {CALIBRATION_PLACES.map((option) => {
                    const selected = selectedValue === option.value;

                    return (
                        <Pressable
                            key={option.value}
                            accessibilityRole='button'
                            onPress={() => {
                                onSelect(option.value);
                                onClose();
                            }}
                            style={[
                                styles.placeOption,
                                {
                                    backgroundColor: selected
                                        ? colors.cardSoft
                                        : colors.card,
                                    borderColor: selected
                                        ? colors.primary
                                        : colors.border,
                                },
                            ]}
                        >
                            <View style={styles.placeOptionCopy}>
                                <Text
                                    style={[
                                        styles.placeOptionTitle,
                                        { color: colors.text },
                                    ]}
                                >
                                    {option.label}
                                </Text>
                                <Text
                                    style={[
                                        styles.placeOptionDescription,
                                        { color: colors.muted },
                                    ]}
                                >
                                    {option.description}
                                </Text>
                            </View>
                            {selected && (
                                <IconSolarShieldCheck
                                    width={21}
                                    height={21}
                                    pathStroke={colors.primary}
                                />
                            )}
                        </Pressable>
                    );
                })}
            </Pressable>
        </Pressable>
    </Modal>
);

const AppDialog = ({ colors, dialog, onClose }) => {
    if (!dialog) {
        return null;
    }

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
                style={[styles.modalScrim, { backgroundColor: colors.overlay }]}
                onPress={onClose}
            >
                <Pressable
                    style={[
                        styles.dialogCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ]}
                    onPress={(event) => event.stopPropagation()}
                >
                    <View
                        style={[
                            styles.dialogIcon,
                            {
                                backgroundColor:
                                    dialog.tone === 'success'
                                        ? colors.isDark
                                            ? '#173227'
                                            : '#EAF8F1'
                                        : colors.isDark
                                          ? '#351D27'
                                          : '#FFF0F3',
                            },
                        ]}
                    >
                        {dialog.tone === 'success' ? (
                            <IconSolarShieldCheck
                                width={25}
                                height={25}
                                pathStroke={colors.success}
                            />
                        ) : (
                            <IconSolarDocumentText
                                width={25}
                                height={25}
                                pathStroke={colors.danger}
                            />
                        )}
                    </View>
                    <Text style={[styles.dialogTitle, { color: colors.text }]}>
                        {dialog.title}
                    </Text>
                    <Text style={[styles.dialogMessage, { color: colors.secondary }]}>
                        {dialog.message}
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={[
                            styles.dialogButton,
                            {
                                backgroundColor:
                                    dialog.tone === 'success'
                                        ? colors.primary
                                        : colors.danger,
                            },
                        ]}
                        onPress={onClose}
                    >
                        <Text style={styles.dialogButtonText}>
                            {dialog.buttonLabel || 'OK'}
                        </Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default function NewEnquiry() {
    const systemScheme = useColorScheme();
    const { width } = useWindowDimensions();
    const { authUser, userProfile } = useAuth();
    const { services, submitEnquiry, fetchServices, loading } = useEnquiry();
    const [formData, setFormData] = useState(
        getInitialFormData(authUser, userProfile)
    );
    const [submittedEnquiryNumber, setSubmittedEnquiryNumber] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pickerIndex, setPickerIndex] = useState(null);
    const [placePickerVisible, setPlacePickerVisible] = useState(false);
    const [dialog, setDialog] = useState(null);
    const [visibleCustomPriceIndexes, setVisibleCustomPriceIndexes] = useState(
        []
    );
    const [showDiscountField, setShowDiscountField] = useState(false);
    const profileIsComplete = Boolean(userProfile?.profileCompleted);
    const resolvedTheme = resolveThemePreference(
        userProfile?.themePreference,
        systemScheme
    );
    const colors = getAppPalette(resolvedTheme);
    const isWide = width >= 720;
    const totals = calculateTotals(formData, services);
    const discount = Number(formData.discountPercentage) || 0;
    const finalAmount =
        discount > 0
            ? totals.totalAmount - (totals.totalAmount * discount) / 100
            : totals.discountedAmount;
    const validationMessage = getValidationMessage(
        formData,
        profileIsComplete,
        authUser,
        userProfile
    );
    const canSubmit = !validationMessage && !isSubmitting;

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            companyName: userProfile?.companyName || '',
            contactPerson: userProfile?.name || '',
            designation: userProfile?.designation || '',
            phone: userProfile?.phone || '',
            email: authUser?.email || '',
        }));
    }, [
        authUser?.email,
        userProfile?.companyName,
        userProfile?.designation,
        userProfile?.name,
        userProfile?.phone,
    ]);

    const setField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const updateInstrument = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            instruments: prev.instruments.map((instrument, itemIndex) =>
                itemIndex === index ? { ...instrument, [field]: value } : instrument
            ),
        }));
    };

    const addInstrument = () => {
        setFormData((prev) => ({
            ...prev,
            instruments: [...prev.instruments, emptyInstrument()],
        }));
    };

    const removeInstrument = (index) => {
        setFormData((prev) => {
            if (prev.instruments.length === 1) {
                return prev;
            }

            return {
                ...prev,
                instruments: prev.instruments.filter(
                    (_, itemIndex) => itemIndex !== index
                ),
            };
        });
        setVisibleCustomPriceIndexes((prev) =>
            prev
                .filter((itemIndex) => itemIndex !== index)
                .map((itemIndex) => (itemIndex > index ? itemIndex - 1 : itemIndex))
        );
    };

    const handleDiscountChange = (value) => {
        setShowDiscountField(true);
        setFormData((prev) => ({
            ...prev,
            discountPercentage: sanitizeNumberInput(value, {
                allowDecimal: true,
            }),
            instruments: prev.instruments.map((instrument) => ({
                ...instrument,
                customPrice: '',
            })),
        }));
    };

    const handleCustomPriceChange = (index, value) => {
        setVisibleCustomPriceIndexes((prev) =>
            prev.includes(index) ? prev : [...prev, index]
        );
        updateInstrument(
            index,
            'customPrice',
            sanitizeNumberInput(value, { allowDecimal: true })
        );
        setFormData((prev) => ({ ...prev, discountPercentage: '' }));
    };

    const handleSubmit = async () => {
        if (validationMessage) {
            setDialog({
                title: 'Check enquiry details',
                message: validationMessage,
                tone: 'danger',
            });
            return;
        }

        setIsSubmitting(true);
        const enquiryData = {
            companyName: formData.companyName.trim(),
            address: formData.address.trim(),
            contactPerson: formData.contactPerson.trim(),
            designation: formData.designation.trim(),
            phone: formData.phone.trim(),
            fax: formData.fax.trim(),
            email: formData.email.trim().toLowerCase(),
            placeOfCalibration: formData.placeOfCalibration,
            instruments: formData.instruments.map((instrument) => ({
                name: instrument.name,
                quantity: Number(instrument.quantity),
                customPrice: instrument.customPrice
                    ? Number(instrument.customPrice)
                    : '',
            })),
            comments: formData.comments.trim(),
            discountPercentage: formData.discountPercentage
                ? Number(formData.discountPercentage)
                : '',
        };

        try {
            const result = await submitEnquiry(enquiryData);
            if (!result.success) {
                throw new Error(result.msg || 'Failed to create enquiry');
            }

            setSubmittedEnquiryNumber(result.enquiryNumber);
            setFormData(getInitialFormData(authUser, userProfile));
            setVisibleCustomPriceIndexes([]);
            setShowDiscountField(false);
            setDialog({
                title: 'Enquiry sent',
                message: `${result.enquiryNumber} has been submitted successfully.`,
                tone: 'success',
                buttonLabel: 'Great',
            });
        } catch (error) {
            console.error('Error submitting enquiry:', error);
            setDialog({
                title: 'Could not submit enquiry',
                message:
                    error.message ||
                    'Please check your connection and try submitting again.',
                tone: 'danger',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView
            edges={['left', 'right']}
            style={[styles.safeArea, { backgroundColor: colors.page }]}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={[
                            styles.hero,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.heroIcon,
                                { backgroundColor: colors.cardSoft },
                            ]}
                        >
                            <IconEnquiry
                                width={26}
                                height={26}
                                pathStroke={colors.primary}
                            />
                        </View>
                        <View style={styles.heroCopy}>
                            <Text
                                style={[styles.heroTitle, { color: colors.text }]}
                            >
                                Create enquiry
                            </Text>
                            <Text
                                style={[
                                    styles.heroSubtitle,
                                    { color: colors.secondary },
                                ]}
                            >
                                Tell us what needs calibration. We will calculate
                                pricing from active services.
                            </Text>
                        </View>
                    </View>

                    {!profileIsComplete && (
                        <View
                            style={[
                                styles.noticeCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <Text
                                style={[styles.noticeTitle, { color: colors.text }]}
                            >
                                Complete your profile first
                            </Text>
                            <Text
                                style={[
                                    styles.noticeCopy,
                                    { color: colors.secondary },
                                ]}
                            >
                                Add your company, designation, and phone number
                                to unlock enquiry submissions.
                            </Text>
                            <TouchableOpacity
                                activeOpacity={0.86}
                                style={[
                                    styles.noticeButton,
                                    { backgroundColor: colors.primary },
                                ]}
                                onPress={() => router.navigate('/(app)/user')}
                            >
                                <Text style={styles.noticeButtonText}>
                                    Go to Profile
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {!!submittedEnquiryNumber && (
                        <View
                            style={[
                                styles.successCard,
                                {
                                    backgroundColor: colors.isDark
                                        ? '#173227'
                                        : '#EAF8F1',
                                },
                            ]}
                        >
                            <IconSolarShieldCheck
                                width={24}
                                height={24}
                                pathStroke={colors.success}
                            />
                            <View style={styles.successCopyWrap}>
                                <Text
                                    style={[
                                        styles.successTitle,
                                        { color: colors.success },
                                    ]}
                                >
                                    Enquiry submitted
                                </Text>
                                <Text
                                    style={[
                                        styles.successCopy,
                                        { color: colors.success },
                                    ]}
                                >
                                    Number: {submittedEnquiryNumber}
                                </Text>
                            </View>
                        </View>
                    )}

                    <View
                        style={[
                            styles.section,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <View style={styles.sectionHeader}>
                            <Text
                                style={[
                                    styles.sectionEyebrow,
                                    { color: colors.primary },
                                ]}
                            >
                                Contact profile
                            </Text>
                        </View>
                        <View style={[styles.fieldGrid, isWide && styles.fieldGridWide]}>
                            <Field
                                colors={colors}
                                label='Company name'
                                value={formData.companyName}
                                onChangeText={(text) => setField('companyName', text)}
                            />
                            <Field
                                colors={colors}
                                label='Contact person'
                                value={formData.contactPerson}
                                onChangeText={(text) =>
                                    setField('contactPerson', text)
                                }
                            />
                            <Field
                                colors={colors}
                                label='Designation'
                                value={formData.designation}
                                onChangeText={(text) => setField('designation', text)}
                            />
                            <Field
                                colors={colors}
                                label='Phone'
                                value={formData.phone}
                                keyboardType='phone-pad'
                                maxLength={32}
                                onChangeText={(text) => setField('phone', text)}
                            />
                            <Field
                                colors={colors}
                                label='Email'
                                value={formData.email}
                                keyboardType='email-address'
                                maxLength={120}
                                onChangeText={(text) => setField('email', text)}
                            />
                            <Field
                                colors={colors}
                                label='Fax (optional)'
                                value={formData.fax}
                                keyboardType='phone-pad'
                                maxLength={32}
                                onChangeText={(text) => setField('fax', text)}
                            />
                        </View>
                        <Field
                            colors={colors}
                            label='Address'
                            value={formData.address}
                            multiline
                            maxLength={220}
                            onChangeText={(text) => setField('address', text)}
                        />
                    </View>

                    <View
                        style={[
                            styles.section,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <View style={styles.sectionHeader}>
                            <Text
                                style={[
                                    styles.sectionEyebrow,
                                    { color: colors.primary },
                                ]}
                            >
                                Request details
                            </Text>
                        </View>
                        <Text style={[styles.fieldLabel, { color: colors.text }]}>
                            Place of calibration
                        </Text>
                        <Pressable
                            accessibilityRole='button'
                            onPress={() => setPlacePickerVisible(true)}
                            style={[
                                styles.placeSelect,
                                {
                                    backgroundColor: colors.input,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.placeSelectText,
                                    { color: colors.text },
                                ]}
                            >
                                {formData.placeOfCalibration}
                            </Text>
                            <IconSolarChevronDown
                                width={18}
                                height={18}
                                pathStroke={colors.primary}
                            />
                        </Pressable>

                        {formData.instruments.map((instrument, index) => {
                            const price = getServicePrice(services, instrument.name);
                            const quantity = Number(instrument.quantity) || 0;
                            const customPrice = Number(instrument.customPrice) || 0;
                            const showCustomPrice =
                                visibleCustomPriceIndexes.includes(index) ||
                                Boolean(instrument.customPrice);
                            const lineTotal =
                                (customPrice > 0 && !formData.discountPercentage
                                    ? customPrice
                                    : price) * quantity;

                            return (
                                <View
                                    key={`${index}-${instrument.name}`}
                                    style={[
                                        styles.instrumentCard,
                                        {
                                            backgroundColor: colors.cardSoft,
                                            borderColor: colors.border,
                                        },
                                    ]}
                                >
                                    <View style={styles.instrumentHeader}>
                                        <Text
                                            style={[
                                                styles.instrumentTitle,
                                                {
                                                    color: colors.text,
                                                    backgroundColor: colors.input,
                                                    borderColor: colors.border,
                                                },
                                            ]}
                                        >
                                            Instrument {index + 1}
                                        </Text>
                                        {formData.instruments.length > 1 && (
                                            <TouchableOpacity
                                                accessibilityRole='button'
                                                activeOpacity={0.8}
                                                style={[
                                                    styles.removeButton,
                                                    {
                                                        backgroundColor:
                                                            colors.isDark
                                                                ? '#351D27'
                                                                : '#FFF0F3',
                                                    },
                                                ]}
                                                onPress={() =>
                                                    removeInstrument(index)
                                                }
                                            >
                                                <IconDelete
                                                    width={18}
                                                    height={18}
                                                    pathStroke={colors.danger}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <Pressable
                                        accessibilityRole='button'
                                        onPress={() => setPickerIndex(index)}
                                        style={[
                                            styles.serviceSelect,
                                            {
                                                backgroundColor: colors.input,
                                                borderColor: colors.border,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.serviceSelectText,
                                                {
                                                    color: instrument.name
                                                        ? colors.text
                                                        : colors.muted,
                                                },
                                            ]}
                                            numberOfLines={2}
                                        >
                                            {instrument.name ||
                                                'Select an instrument'}
                                        </Text>
                                    </Pressable>
                                    <View
                                        style={[
                                            styles.instrumentGrid,
                                            !isWide &&
                                                styles.instrumentGridStacked,
                                        ]}
                                    >
                                        <View style={styles.fieldWrap}>
                                            <View style={styles.fieldLabelRow}>
                                                <Text
                                                    style={[
                                                        styles.fieldLabel,
                                                        { color: colors.text },
                                                    ]}
                                                >
                                                    Quantity
                                                </Text>
                                                {!showCustomPrice && (
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        onPress={() =>
                                                            setVisibleCustomPriceIndexes(
                                                                (prev) =>
                                                                    prev.includes(
                                                                        index
                                                                    )
                                                                        ? prev
                                                                        : [
                                                                              ...prev,
                                                                              index,
                                                                          ]
                                                            )
                                                        }
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.inlineActionText,
                                                                {
                                                                    color: colors.primary,
                                                                },
                                                            ]}
                                                        >
                                                            + Custom price
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                            <TextInput
                                                value={String(instrument.quantity)}
                                                onChangeText={(text) =>
                                                    updateInstrument(
                                                        index,
                                                        'quantity',
                                                        sanitizeNumberInput(text)
                                                    )
                                                }
                                                placeholder='1'
                                                placeholderTextColor={colors.muted}
                                                keyboardType='number-pad'
                                                maxLength={4}
                                                style={[
                                                    styles.input,
                                                    {
                                                        backgroundColor: colors.input,
                                                        borderColor: colors.border,
                                                        color: colors.text,
                                                    },
                                                ]}
                                            />
                                        </View>
                                        {showCustomPrice && (
                                            <Field
                                                colors={colors}
                                                label='Custom price'
                                                value={String(instrument.customPrice)}
                                                keyboardType='numeric'
                                                maxLength={12}
                                                onChangeText={(text) =>
                                                    handleCustomPriceChange(index, text)
                                                }
                                            />
                                        )}
                                    </View>
                                    <View style={styles.priceRow}>
                                        <Text
                                            style={[
                                                styles.priceMeta,
                                                { color: colors.secondary },
                                            ]}
                                        >
                                            Base: {formatCurrency(price)}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.priceMeta,
                                                { color: colors.accent },
                                            ]}
                                        >
                                            Line: {formatCurrency(lineTotal)}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}

                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={[
                                styles.addInstrumentButton,
                                { backgroundColor: colors.primary },
                            ]}
                            onPress={addInstrument}
                        >
                            <Text style={styles.addInstrumentText}>
                                + Add another instrument
                            </Text>
                        </TouchableOpacity>

                        <Field
                            colors={colors}
                            label='Comments'
                            value={formData.comments}
                            multiline
                            maxLength={500}
                            onChangeText={(text) => setField('comments', text)}
                        />
                    </View>

                    <View
                        style={[
                            styles.section,
                            styles.summarySection,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <View style={styles.sectionHeader}>
                            <Text
                                style={[
                                    styles.sectionEyebrow,
                                    { color: colors.primary },
                                ]}
                            >
                                Pricing
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text
                                style={[
                                    styles.summaryLabel,
                                    { color: colors.secondary },
                                ]}
                            >
                                Total amount
                            </Text>
                            <Text
                                style={[
                                    styles.summaryValue,
                                    { color: colors.text },
                                ]}
                            >
                                {formatCurrency(totals.totalAmount)}
                            </Text>
                        </View>
                        {!showDiscountField && (
                            <TouchableOpacity
                                activeOpacity={0.82}
                                style={[
                                    styles.secondaryInlineButton,
                                    {
                                        backgroundColor: colors.cardSoft,
                                        borderColor: colors.border,
                                    },
                                ]}
                                onPress={() => setShowDiscountField(true)}
                            >
                                <Text
                                    style={[
                                        styles.secondaryInlineButtonText,
                                        { color: colors.primary },
                                    ]}
                                >
                                    + Ask discount %
                                </Text>
                            </TouchableOpacity>
                        )}
                        {showDiscountField && (
                            <Field
                                colors={colors}
                                label='Ask discount %'
                                value={String(formData.discountPercentage)}
                                keyboardType='numeric'
                                maxLength={6}
                                onChangeText={handleDiscountChange}
                            />
                        )}
                        <View style={styles.summaryRow}>
                            <Text
                                style={[
                                    styles.summaryLabel,
                                    { color: colors.secondary },
                                ]}
                            >
                                Requested amount
                            </Text>
                            <Text
                                style={[
                                    styles.summaryTotal,
                                    { color: colors.accent },
                                ]}
                            >
                                {formatCurrency(finalAmount)}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.88}
                        style={[
                            styles.submitButton,
                            { backgroundColor: colors.accent },
                            (!canSubmit || loading) && styles.disabledButton,
                        ]}
                        onPress={handleSubmit}
                        disabled={!canSubmit || loading}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <Text style={styles.submitButtonText}>
                                Submit enquiry
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            <ServicePicker
                colors={colors}
                services={services}
                visible={pickerIndex !== null}
                selectedName={
                    pickerIndex === null
                        ? ''
                        : formData.instruments[pickerIndex]?.name
                }
                onClose={() => setPickerIndex(null)}
                onSelect={(name) => updateInstrument(pickerIndex, 'name', name)}
            />
            <CalibrationPlacePicker
                colors={colors}
                visible={placePickerVisible}
                selectedValue={formData.placeOfCalibration}
                onClose={() => setPlacePickerVisible(false)}
                onSelect={(value) => setField('placeOfCalibration', value)}
            />
            <AppDialog
                colors={colors}
                dialog={dialog}
                onClose={() => setDialog(null)}
            />
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
    scrollViewContent: {
        flexGrow: 1,
        padding: AppSpacing.screenX,
        paddingBottom: 34,
        gap: AppSpacing.sectionGap,
    },
    hero: {
        borderRadius: AppRadii.xl,
        borderWidth: StyleSheet.hairlineWidth,
        padding: AppSpacing.card,
        flexDirection: 'row',
        alignItems: 'center',
    },
    heroIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    heroCopy: {
        flex: 1,
    },
    heroTitle: {
        ...AppTypography.sectionTitle,
        marginBottom: 5,
    },
    heroSubtitle: {
        ...AppTypography.caption,
        fontWeight: '600',
    },
    noticeCard: {
        borderRadius: AppRadii.xl,
        borderWidth: StyleSheet.hairlineWidth,
        padding: AppSpacing.card,
    },
    noticeTitle: {
        ...AppTypography.cardTitle,
        marginBottom: 6,
    },
    noticeCopy: {
        ...AppTypography.caption,
        fontWeight: '600',
        marginBottom: 12,
    },
    noticeButton: {
        alignSelf: 'flex-start',
        minHeight: 42,
        borderRadius: 21,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noticeButtonText: {
        color: '#FFFFFF',
        fontWeight: '900',
    },
    successCard: {
        borderRadius: 22,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    successCopyWrap: {
        flex: 1,
    },
    successTitle: {
        fontSize: 15,
        fontWeight: '900',
    },
    successCopy: {
        marginTop: 2,
        fontSize: 13,
        fontWeight: '700',
    },
    section: {
        borderRadius: AppRadii.xl,
        borderWidth: StyleSheet.hairlineWidth,
        padding: AppSpacing.card,
        gap: 12,
    },
    sectionHeader: {
        gap: 4,
        marginBottom: 2,
    },
    sectionEyebrow: {
        ...AppTypography.eyebrow,
    },
    sectionTitle: {
        ...AppTypography.sectionTitle,
    },
    fieldGrid: {
        gap: 12,
    },
    fieldGridWide: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    fieldWrap: {
        flex: 1,
        minWidth: 220,
        gap: 7,
    },
    fieldLabel: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.7,
        textTransform: 'uppercase',
    },
    fieldLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    inlineActionText: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.3,
    },
    input: {
        minHeight: 52,
        borderRadius: 18,
        borderWidth: 1,
        paddingHorizontal: 14,
        fontSize: 15,
        fontWeight: '600',
    },
    multilineInput: {
        minHeight: 96,
        paddingTop: 13,
        textAlignVertical: 'top',
    },
    placeSelect: {
        minHeight: 52,
        borderRadius: 18,
        borderWidth: 1,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    placeSelectText: {
        fontSize: 15,
        fontWeight: '800',
    },
    placeSelectChevron: {
        fontSize: 16,
        fontWeight: '900',
    },
    instrumentCard: {
        borderRadius: 22,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 14,
        gap: 12,
    },
    instrumentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    instrumentTitle: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 7,
    },
    removeButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },
    serviceSelect: {
        minHeight: 54,
        borderRadius: 18,
        borderWidth: 1,
        justifyContent: 'center',
        paddingHorizontal: 14,
    },
    serviceSelectText: {
        fontSize: 15,
        fontWeight: '800',
    },
    instrumentGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    instrumentGridStacked: {
        flexDirection: 'column',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    priceMeta: {
        fontSize: 13,
        fontWeight: '800',
    },
    addInstrumentButton: {
        minHeight: 50,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addInstrumentText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 15,
    },
    summarySection: {
        gap: 14,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    summaryLabel: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '900',
    },
    summaryTotal: {
        ...AppTypography.sectionTitle,
    },
    secondaryInlineButton: {
        minHeight: 42,
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 14,
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryInlineButtonText: {
        fontSize: 13,
        fontWeight: '900',
    },
    submitButton: {
        minHeight: 56,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    disabledButton: {
        opacity: 0.45,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900',
    },
    modalScrim: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 18,
    },
    serviceSheet: {
        width: '100%',
        borderRadius: AppRadii.sheet,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 16,
    },
    serviceSheetCompact: {
        borderRadius: 24,
        padding: 14,
    },
    sheetHandle: {
        width: 44,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#D6DCE8',
        alignSelf: 'center',
        marginBottom: 14,
    },
    sheetTitle: {
        ...AppTypography.sectionTitle,
        marginBottom: 4,
    },
    sheetCopy: {
        ...AppTypography.body,
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 14,
    },
    sheetHeaderCopy: {
        flex: 1,
    },
    serviceCount: {
        minWidth: 36,
        height: 32,
        borderRadius: 16,
        overflow: 'hidden',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 13,
        fontWeight: '900',
    },
    placeSheet: {
        width: '100%',
        borderRadius: AppRadii.sheet,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 16,
        paddingBottom: 20,
    },
    placeOption: {
        minHeight: 70,
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 11,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
    },
    placeOptionCopy: {
        flex: 1,
    },
    placeOptionTitle: {
        fontSize: 15,
        fontWeight: '900',
        marginBottom: 4,
    },
    placeOptionDescription: {
        fontSize: 12,
        lineHeight: 16,
    },
    searchBox: {
        minHeight: 50,
        borderRadius: 18,
        borderWidth: 1,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    searchInput: {
        flex: 1,
        minHeight: 46,
        fontWeight: '700',
    },
    serviceList: {
        marginTop: 12,
    },
    serviceListContent: {
        paddingBottom: 12,
        gap: 8,
    },
    serviceListContentCompact: {
        gap: 6,
    },
    serviceOption: {
        minHeight: 72,
        borderRadius: 18,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    serviceOptionCompact: {
        minHeight: 64,
        paddingVertical: 8,
    },
    serviceOptionCopy: {
        flex: 1,
    },
    serviceName: {
        fontSize: 14,
        fontWeight: '900',
        marginBottom: 3,
    },
    servicePrice: {
        fontSize: 12,
        fontWeight: '700',
    },
    serviceEmptyCard: {
        minHeight: 150,
        borderRadius: 22,
        borderWidth: StyleSheet.hairlineWidth,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
    },
    serviceEmptyTitle: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '900',
    },
    serviceEmptyCopy: {
        marginTop: 4,
        fontSize: 12,
        lineHeight: 17,
        textAlign: 'center',
    },
    dialogCard: {
        width: '100%',
        maxWidth: 356,
        borderRadius: AppRadii.sheet,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 22,
        alignItems: 'center',
    },
    dialogIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    dialogTitle: {
        ...AppTypography.sectionTitle,
        textAlign: 'center',
        marginBottom: 8,
    },
    dialogMessage: {
        ...AppTypography.body,
        textAlign: 'center',
        marginBottom: 20,
    },
    dialogButton: {
        width: '100%',
        minHeight: 52,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dialogButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '900',
    },
});
