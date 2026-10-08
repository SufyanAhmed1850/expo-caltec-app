import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';

import StatusPill from '@/src/components/StatusPill';
import { useAuth } from '@context/authContext';
import { useEnquiry } from '@/src/context/enquiryContext';
import {
    AppRadii,
    AppSpacing,
    AppTypography,
    formatCurrency,
    formatDate,
    getAppPalette,
    resolveThemePreference,
} from '@constants/appTheme';
import {
    IconLocation,
    IconMail,
    IconPhone,
    IconProfile,
    IconSolarBuildings,
    IconSolarDocumentText,
    IconSolarShieldCheck,
} from '@constants/SvgIcons';

const getParamValue = (value) => (Array.isArray(value) ? value[0] : value);

const InfoRow = ({ colors, icon, label, value }) => (
    <View style={styles.infoRow}>
        <View style={[styles.infoIcon, { backgroundColor: colors.cardSoft }]}>
            {icon}
        </View>
        <View style={styles.infoCopy}>
            <Text style={[styles.infoLabel, { color: colors.muted }]}>{label}</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
                {value || 'Not provided'}
            </Text>
        </View>
    </View>
);

const Section = ({ children, colors, title }) => (
    <View
        style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
        ]}
    >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        {children}
    </View>
);

const InstrumentCard = ({ colors, instrument, index }) => {
    const price = Number(instrument?.price) || 0;
    const quantity = Number(instrument?.quantity) || 0;
    const customPrice = Number(instrument?.customPrice) || 0;
    const totalPrice = Number(instrument?.totalPrice) || price * quantity;

    return (
        <View
            style={[
                styles.instrumentCard,
                { backgroundColor: colors.cardSoft, borderColor: colors.border },
            ]}
        >
            <Text style={[styles.instrumentName, { color: colors.text }]}>
                {index + 1}. {instrument?.name || 'Instrument'}
            </Text>
            <View style={styles.instrumentMetaGrid}>
                <Text style={[styles.instrumentMeta, { color: colors.secondary }]}>
                    Qty: {quantity || 'N/A'}
                </Text>
                <Text style={[styles.instrumentMeta, { color: colors.secondary }]}>
                    Base: {formatCurrency(price)}
                </Text>
                <Text style={[styles.instrumentMeta, { color: colors.secondary }]}>
                    Custom: {customPrice > 0 ? formatCurrency(customPrice) : 'N/A'}
                </Text>
                <Text style={[styles.instrumentTotal, { color: colors.accent }]}>
                    Total: {formatCurrency(totalPrice)}
                </Text>
            </View>
        </View>
    );
};

export default function EnquiryDetailsPage() {
    const systemScheme = useColorScheme();
    const { enquiry } = useLocalSearchParams();
    const enquiryNumber = getParamValue(enquiry);
    const [enquiryData, setEnquiryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { userProfile } = useAuth();
    const { getEnquiry, updateEnquiryStatus } = useEnquiry();
    const isAdmin = userProfile?.role === 'admin';
    const resolvedTheme = resolveThemePreference(
        userProfile?.themePreference,
        systemScheme
    );
    const colors = getAppPalette(resolvedTheme);

    const fetchEnquiryDetails = useCallback(async () => {
        if (!enquiryNumber) {
            setErrorMessage('Enquiry number is missing.');
            setLoading(false);
            return;
        }

        setErrorMessage('');
        try {
            const nextEnquiry = await getEnquiry(enquiryNumber);
            setEnquiryData(nextEnquiry);
        } catch (error) {
            console.error('Error fetching enquiry details:', error);
            setErrorMessage(
                error.message || 'Failed to fetch enquiry details.'
            );
        } finally {
            setLoading(false);
        }
    }, [enquiryNumber, getEnquiry]);

    useEffect(() => {
        fetchEnquiryDetails();
    }, [fetchEnquiryDetails]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchEnquiryDetails();
        setRefreshing(false);
    }, [fetchEnquiryDetails]);

    const handleStatusUpdate = async (newStatus) => {
        if (!enquiryData?.enquiryNumber || updatingStatus) {
            return;
        }

        setUpdatingStatus(newStatus);
        setErrorMessage('');
        try {
            const updatedEnquiry = await updateEnquiryStatus(
                enquiryData.enquiryNumber,
                newStatus
            );
            setEnquiryData(updatedEnquiry);
        } catch (error) {
            console.error('Error updating enquiry status:', error);
            setErrorMessage(error.message || 'Failed to update enquiry status.');
        } finally {
            setUpdatingStatus('');
        }
    };

    if (loading) {
        return (
            <SafeAreaView
                style={[
                    styles.loadingContainer,
                    { backgroundColor: colors.page },
                ]}
            >
                <ActivityIndicator size='large' color={colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            edges={['left', 'right']}
            style={[styles.container, { backgroundColor: colors.page }]}
        >
            <Stack.Screen
                options={{
                    title: enquiryData?.enquiryNumber || 'Enquiry',
                }}
            />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
            >
                {!!errorMessage && (
                    <View
                        style={[
                            styles.errorCard,
                            {
                                backgroundColor: colors.isDark
                                    ? '#351D27'
                                    : '#FFF0F3',
                            },
                        ]}
                    >
                        <Text style={[styles.errorText, { color: colors.danger }]}>
                            {errorMessage}
                        </Text>
                    </View>
                )}

                {!enquiryData ? (
                    <View
                        style={[
                            styles.emptyCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <IconSolarDocumentText
                            width={32}
                            height={32}
                            pathStroke={colors.muted}
                        />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>
                            Enquiry unavailable
                        </Text>
                        <Text style={[styles.emptyCopy, { color: colors.muted }]}>
                            Pull to refresh and try loading this enquiry again.
                        </Text>
                    </View>
                ) : (
                    <>
                        <View
                            style={[
                                styles.headerCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                    shadowColor: colors.shadow,
                                },
                            ]}
                        >
                            <View style={styles.headerTextWrap}>
                                <Text
                                    style={[
                                        styles.enquiryNumber,
                                        { color: colors.text },
                                    ]}
                                >
                                    {enquiryData.enquiryNumber}
                                </Text>
                                <Text
                                    style={[styles.date, { color: colors.muted }]}
                                >
                                    {formatDate(enquiryData.timestamp)}
                                </Text>
                            </View>
                            <StatusPill
                                status={enquiryData.status}
                                colors={colors}
                            />
                        </View>

                        <Section colors={colors} title='Customer'>
                            <InfoRow
                                colors={colors}
                                label='Contact person'
                                value={`${enquiryData.userName || 'N/A'}${
                                    enquiryData.designation
                                        ? ` - ${enquiryData.designation}`
                                        : ''
                                }`}
                                icon={
                                    <IconProfile
                                        width={19}
                                        height={19}
                                        pathStroke={colors.secondary}
                                    />
                                }
                            />
                            <InfoRow
                                colors={colors}
                                label='Company'
                                value={enquiryData.companyName}
                                icon={
                                    <IconSolarBuildings
                                        width={19}
                                        height={19}
                                        pathStroke={colors.secondary}
                                    />
                                }
                            />
                            <InfoRow
                                colors={colors}
                                label='Address'
                                value={enquiryData.address}
                                icon={
                                    <IconLocation
                                        width={19}
                                        height={19}
                                        pathStroke={colors.secondary}
                                    />
                                }
                            />
                            <InfoRow
                                colors={colors}
                                label='Email'
                                value={enquiryData.email}
                                icon={
                                    <IconMail
                                        width={19}
                                        height={19}
                                        pathStroke={colors.secondary}
                                    />
                                }
                            />
                            <InfoRow
                                colors={colors}
                                label='Phone'
                                value={enquiryData.phone}
                                icon={
                                    <IconPhone
                                        width={19}
                                        height={19}
                                        pathStroke={colors.secondary}
                                    />
                                }
                            />
                        </Section>

                        <Section colors={colors} title='Enquiry details'>
                            <InfoRow
                                colors={colors}
                                label='Calibration location'
                                value={enquiryData.placeOfCalibration}
                                icon={
                                    <IconLocation
                                        width={19}
                                        height={19}
                                        pathStroke={colors.secondary}
                                    />
                                }
                            />
                            <InfoRow
                                colors={colors}
                                label='Total amount'
                                value={formatCurrency(enquiryData.totalAmount)}
                                icon={
                                    <IconSolarDocumentText
                                        width={19}
                                        height={19}
                                        pathStroke={colors.secondary}
                                    />
                                }
                            />
                            <InfoRow
                                colors={colors}
                                label='Requested amount'
                                value={formatCurrency(enquiryData.discountedAmount)}
                                icon={
                                    <IconSolarShieldCheck
                                        width={19}
                                        height={19}
                                        pathStroke={colors.secondary}
                                    />
                                }
                            />
                            <InfoRow
                                colors={colors}
                                label='Comments'
                                value={enquiryData.comments || 'N/A'}
                                icon={
                                    <IconSolarDocumentText
                                        width={19}
                                        height={19}
                                        pathStroke={colors.secondary}
                                    />
                                }
                            />
                        </Section>

                        <Section colors={colors} title='Instruments'>
                            {(enquiryData.instruments || []).map(
                                (instrument, index) => (
                                    <InstrumentCard
                                        key={`${instrument?.name || index}-${index}`}
                                        colors={colors}
                                        instrument={instrument}
                                        index={index}
                                    />
                                )
                            )}
                        </Section>

                        {isAdmin && (
                            <Section colors={colors} title='Admin actions'>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        activeOpacity={0.86}
                                        style={[
                                            styles.actionButton,
                                            {
                                                backgroundColor: colors.success,
                                            },
                                            (updatingStatus ||
                                                enquiryData.status ===
                                                    'Approved') &&
                                                styles.disabledButton,
                                        ]}
                                        onPress={() =>
                                            handleStatusUpdate('Approved')
                                        }
                                        disabled={
                                            Boolean(updatingStatus) ||
                                            enquiryData.status === 'Approved'
                                        }
                                    >
                                        {updatingStatus === 'Approved' ? (
                                            <ActivityIndicator
                                                color={colors.white}
                                            />
                                        ) : (
                                            <Text style={styles.actionButtonText}>
                                                Approve
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.86}
                                        style={[
                                            styles.actionButton,
                                            {
                                                backgroundColor: colors.danger,
                                            },
                                            (updatingStatus ||
                                                enquiryData.status ===
                                                    'Declined') &&
                                                styles.disabledButton,
                                        ]}
                                        onPress={() =>
                                            handleStatusUpdate('Declined')
                                        }
                                        disabled={
                                            Boolean(updatingStatus) ||
                                            enquiryData.status === 'Declined'
                                        }
                                    >
                                        {updatingStatus === 'Declined' ? (
                                            <ActivityIndicator
                                                color={colors.white}
                                            />
                                        ) : (
                                            <Text style={styles.actionButtonText}>
                                                Decline
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </Section>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: AppSpacing.screenX,
        paddingBottom: 34,
        gap: AppSpacing.sectionGap,
    },
    errorCard: {
        borderRadius: 20,
        padding: 14,
    },
    errorText: {
        fontSize: 13,
        lineHeight: 19,
        fontWeight: '800',
    },
    emptyCard: {
        minHeight: 260,
        borderRadius: AppRadii.xl,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    emptyTitle: {
        marginTop: 12,
        ...AppTypography.cardTitle,
    },
    emptyCopy: {
        marginTop: 6,
        ...AppTypography.caption,
        fontWeight: '600',
        textAlign: 'center',
    },
    headerCard: {
        borderRadius: AppRadii.xl,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 3,
    },
    headerTextWrap: {
        flex: 1,
    },
    enquiryNumber: {
        ...AppTypography.sectionTitle,
        marginBottom: 4,
    },
    date: {
        ...AppTypography.caption,
    },
    section: {
        borderRadius: AppRadii.xl,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 16,
        gap: 12,
    },
    sectionTitle: {
        ...AppTypography.cardTitle,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    infoIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
    },
    infoCopy: {
        flex: 1,
    },
    infoLabel: {
        ...AppTypography.caption,
        fontWeight: '800',
        marginBottom: 3,
    },
    infoValue: {
        fontSize: 15,
        lineHeight: 21,
        fontWeight: '700',
    },
    instrumentCard: {
        borderRadius: 20,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 14,
    },
    instrumentName: {
        fontSize: 15,
        fontWeight: '900',
        marginBottom: 10,
    },
    instrumentMetaGrid: {
        gap: 6,
    },
    instrumentMeta: {
        fontSize: 13,
        fontWeight: '700',
    },
    instrumentTotal: {
        fontSize: 14,
        fontWeight: '900',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        flex: 1,
        minHeight: 52,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        opacity: 0.45,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '900',
    },
});
