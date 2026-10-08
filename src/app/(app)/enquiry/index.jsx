import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    RefreshControl,
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
    IconDelete,
    IconEnquiry,
    IconSearch,
    IconSolarChevronDown,
    IconSolarDocumentText,
} from '@constants/SvgIcons';

const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Declined'];

const getSearchText = (enquiry) =>
    [
        enquiry?.enquiryNumber,
        enquiry?.userName,
        enquiry?.companyName,
        enquiry?.email,
        enquiry?.phone,
        enquiry?.status,
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

const getEnquiryKey = (item, index) =>
    String(item?.id || item?._id || item?.enquiryNumber || index);

const ConfirmDialog = ({
    colors,
    loading,
    onCancel,
    onConfirm,
    selectedEnquiry,
}) => (
    <Modal
        transparent
        visible={Boolean(selectedEnquiry)}
        animationType='fade'
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={onCancel}
    >
        <Pressable
            style={[styles.dialogScrim, { backgroundColor: colors.overlay }]}
            onPress={loading ? undefined : onCancel}
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
                        styles.dialogIcon,
                        { backgroundColor: colors.isDark ? '#351D27' : '#FFF0F3' },
                    ]}
                >
                    <IconDelete
                        width={24}
                        height={24}
                        pathStroke={colors.danger}
                    />
                </View>
                <Text style={[styles.dialogTitle, { color: colors.text }]}>
                    Delete enquiry?
                </Text>
                <Text style={[styles.dialogMessage, { color: colors.secondary }]}>
                    This will permanently remove{' '}
                    {selectedEnquiry?.enquiryNumber || 'this enquiry'} from the
                    enquiry list.
                </Text>
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                        styles.dialogPrimaryButton,
                        { backgroundColor: colors.danger },
                        loading && styles.disabled,
                    ]}
                    onPress={onConfirm}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        <Text style={styles.dialogPrimaryText}>Delete</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                        styles.dialogSecondaryButton,
                        {
                            backgroundColor: colors.cardSoft,
                            borderColor: colors.border,
                        },
                    ]}
                    onPress={onCancel}
                    disabled={loading}
                >
                    <Text
                        style={[
                            styles.dialogSecondaryText,
                            { color: colors.text },
                        ]}
                    >
                        Cancel
                    </Text>
                </TouchableOpacity>
            </Pressable>
        </Pressable>
    </Modal>
);

export default function EnquiryList() {
    const systemScheme = useColorScheme();
    const { width } = useWindowDimensions();
    const { authUser, userProfile } = useAuth();
    const {
        enquiries,
        fetchEnquiries,
        deleteEnquiry,
        markEnquirySeen,
        loading,
    } = useEnquiry();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const isAdmin = userProfile?.role === 'admin';
    const resolvedTheme = resolveThemePreference(
        userProfile?.themePreference,
        systemScheme
    );
    const colors = getAppPalette(resolvedTheme);
    const isCompact = width < 370;

    useEffect(() => {
        fetchEnquiries();
    }, [fetchEnquiries]);

    const filteredEnquiries = enquiries.filter((enquiry) => {
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch = !query || getSearchText(enquiry).includes(query);
        const matchesStatus =
            statusFilter === 'All' || enquiry?.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchEnquiries();
        setRefreshing(false);
    }, [fetchEnquiries]);

    const handleDeleteEnquiry = async () => {
        if (!selectedEnquiry?.enquiryNumber) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteEnquiry(selectedEnquiry.enquiryNumber);
            setSelectedEnquiry(null);
        } catch (error) {
            console.error('Error deleting enquiry:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEnquiryPress = async (item) => {
        if (!item?.enquiryNumber) {
            return;
        }

        if (isAdmin && !item.isSeen) {
            try {
                await markEnquirySeen(item.enquiryNumber);
            } catch (error) {
                console.error('Error updating seen status:', error);
            }
        }

        router.navigate({
            pathname: '/(app)/enquiry/[enquiry]',
            params: { enquiry: item.enquiryNumber },
        });
    };

    const renderItem = ({ item }) => {
        const canDelete = isAdmin || item?.status === 'Pending';

        return (
            <Pressable
                accessibilityRole='button'
                onPress={() => handleEnquiryPress(item)}
                style={({ pressed }) => [
                    styles.card,
                    {
                        backgroundColor: colors.card,
                        borderColor:
                            isAdmin && !item?.isSeen
                                ? colors.accent
                                : colors.border,
                        shadowColor: colors.isDark
                            ? colors.primary
                            : colors.shadow,
                        shadowOpacity: colors.isDark ? 0.08 : 0.08,
                        shadowRadius: colors.isDark ? 8 : 20,
                        elevation: colors.isDark ? 1 : 3,
                    },
                    pressed && styles.pressed,
                ]}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.enquiryTitleWrap}>
                        <Text style={[styles.enquiryNumber, { color: colors.text }]}>
                            {item?.enquiryNumber || 'Enquiry'}
                        </Text>
                        <Text style={[styles.enquiryDate, { color: colors.muted }]}>
                            {formatDate(item?.timestamp)}
                        </Text>
                    </View>
                    <StatusPill status={item?.status} colors={colors} />
                </View>

                <Text
                    style={[styles.customerName, { color: colors.text }]}
                    numberOfLines={1}
                >
                    {item?.userName || 'Unknown customer'}
                </Text>
                <Text
                    style={[styles.companyName, { color: colors.secondary }]}
                    numberOfLines={1}
                >
                    {item?.companyName || item?.email || 'No company provided'}
                </Text>

                <View style={styles.cardFooter}>
                    <Text style={[styles.amount, { color: colors.accent }]}>
                        {formatCurrency(item?.totalAmount)}
                    </Text>
                    {canDelete && (
                        <TouchableOpacity
                            accessibilityRole='button'
                            accessibilityLabel={`Delete ${
                                item?.enquiryNumber || 'enquiry'
                            }`}
                            activeOpacity={0.78}
                            onPress={() => setSelectedEnquiry(item)}
                            style={[
                                styles.deleteButton,
                                {
                                    backgroundColor: colors.isDark
                                        ? '#351D27'
                                        : '#FFF0F3',
                                },
                            ]}
                        >
                            <IconDelete
                                width={18}
                                height={18}
                                pathStroke={colors.danger}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </Pressable>
        );
    };

    if (!authUser) {
        return (
            <SafeAreaView
                style={[styles.container, { backgroundColor: colors.page }]}
            />
        );
    }

    return (
        <SafeAreaView
            edges={['left', 'right']}
            style={[styles.container, { backgroundColor: colors.page }]}
        >
            <View style={styles.content}>
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
                            width={24}
                            height={24}
                            pathStroke={colors.primary}
                        />
                    </View>
                    <View style={styles.heroCopy}>
                        <Text style={[styles.heroTitle, { color: colors.text }]}>
                            Enquiries
                        </Text>
                        <Text style={[styles.heroSubtitle, { color: colors.muted }]}>
                            Track quotations, calibration requests, and decisions.
                        </Text>
                    </View>
                </View>

                <View style={styles.controls}>
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
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder='Search enquiry, company, email'
                            placeholderTextColor={colors.muted}
                            style={[styles.searchInput, { color: colors.text }]}
                            returnKeyType='search'
                            maxLength={80}
                        />
                    </View>

                    <Pressable
                        accessibilityRole='button'
                        onPress={() => setFilterOpen((prev) => !prev)}
                        style={[
                            styles.filterButton,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                            isCompact && styles.filterCompact,
                        ]}
                    >
                        <Text
                            style={[styles.filterLabel, { color: colors.text }]}
                            numberOfLines={1}
                        >
                            {statusFilter}
                        </Text>
                        <IconSolarChevronDown
                            width={16}
                            height={16}
                            pathStroke={colors.primary}
                        />
                    </Pressable>
                </View>

                {filterOpen && (
                    <View
                        style={[
                            styles.filterMenu,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        {STATUS_FILTERS.map((status) => (
                            <Pressable
                                key={status}
                                accessibilityRole='button'
                                onPress={() => {
                                    setStatusFilter(status);
                                    setFilterOpen(false);
                                }}
                                style={[
                                    styles.filterOption,
                                    statusFilter === status && {
                                        backgroundColor: colors.cardSoft,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filterOptionText,
                                        {
                                            color:
                                                statusFilter === status
                                                    ? colors.primary
                                                    : colors.secondary,
                                        },
                                    ]}
                                >
                                    {status}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                )}

                <FlatList
                    data={filteredEnquiries}
                    renderItem={renderItem}
                    keyExtractor={getEnquiryKey}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                        />
                    }
                    ListEmptyComponent={
                        <View
                            style={[
                                styles.emptyCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            {loading ? (
                                <ActivityIndicator color={colors.primary} />
                            ) : (
                                <>
                                    <IconSolarDocumentText
                                        width={30}
                                        height={30}
                                        pathStroke={colors.muted}
                                    />
                                    <Text
                                        style={[
                                            styles.emptyTitle,
                                            { color: colors.text },
                                        ]}
                                    >
                                        No enquiries found
                                    </Text>
                                    <Text
                                        style={[
                                            styles.emptyCopy,
                                            { color: colors.muted },
                                        ]}
                                    >
                                        Try another status filter or create a new
                                        enquiry.
                                    </Text>
                                </>
                            )}
                        </View>
                    }
                />

                <TouchableOpacity
                    accessibilityRole='button'
                    activeOpacity={0.88}
                    onPress={() => router.navigate('/(app)/enquiry/newEnquiry')}
                    style={[
                        styles.fab,
                        {
                            backgroundColor: colors.accent,
                            shadowColor: colors.isDark
                                ? colors.accent
                                : '#000000',
                            shadowOpacity: colors.isDark ? 0.16 : 0.22,
                            shadowRadius: colors.isDark ? 10 : 18,
                            elevation: colors.isDark ? 2 : 10,
                        },
                    ]}
                >
                    <Text style={styles.fabPlus}>+</Text>
                    {!isCompact && <Text style={styles.fabText}>New Enquiry</Text>}
                </TouchableOpacity>
            </View>

            <ConfirmDialog
                colors={colors}
                loading={isDeleting}
                selectedEnquiry={selectedEnquiry}
                onCancel={() => setSelectedEnquiry(null)}
                onConfirm={handleDeleteEnquiry}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: AppSpacing.screenX,
        paddingTop: AppSpacing.screenTop,
    },
    hero: {
        minHeight: 88,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: AppRadii.xl,
        padding: AppSpacing.card,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: AppSpacing.sectionGap,
    },
    heroIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    heroCopy: {
        flex: 1,
    },
    heroTitle: {
        ...AppTypography.sectionTitle,
        marginBottom: 4,
    },
    heroSubtitle: {
        ...AppTypography.caption,
        fontWeight: '600',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
        zIndex: 2,
    },
    searchBox: {
        flex: 1,
        minHeight: 52,
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        minHeight: 46,
    },
    filterButton: {
        minHeight: 52,
        minWidth: 110,
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    },
    filterCompact: {
        minWidth: 92,
    },
    filterLabel: {
        fontSize: 13,
        fontWeight: '900',
    },
    filterMenu: {
        position: 'absolute',
        top: 176,
        right: 18,
        zIndex: 4,
        width: 160,
        borderRadius: 20,
        borderWidth: 1,
        padding: 6,
    },
    filterOption: {
        minHeight: 42,
        borderRadius: 15,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    filterOptionText: {
        fontSize: 14,
        fontWeight: '800',
    },
    listContent: {
        paddingBottom: 110,
        gap: 12,
    },
    card: {
        borderRadius: AppRadii.xl,
        borderWidth: 1,
        padding: AppSpacing.card,
        shadowOffset: { width: 0, height: 6 },
    },
    pressed: {
        opacity: 0.78,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 12,
    },
    enquiryTitleWrap: {
        flex: 1,
    },
    enquiryNumber: {
        ...AppTypography.cardTitle,
        marginBottom: 3,
    },
    enquiryDate: {
        ...AppTypography.caption,
    },
    customerName: {
        ...AppTypography.cardTitle,
        marginBottom: 4,
    },
    companyName: {
        ...AppTypography.caption,
        fontWeight: '600',
    },
    cardFooter: {
        marginTop: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    amount: {
        fontSize: 16,
        fontWeight: '900',
    },
    deleteButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyCard: {
        minHeight: 210,
        borderRadius: AppRadii.xl,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        marginTop: 22,
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
    fab: {
        position: 'absolute',
        right: 18,
        bottom: 22,
        minHeight: 54,
        borderRadius: 27,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowOffset: { width: 0, height: 12 },
    },
    fabPlus: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 26,
    },
    fabText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '900',
    },
    dialogScrim: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 22,
    },
    dialogCard: {
        width: '100%',
        maxWidth: 356,
        borderRadius: AppRadii.sheet,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 22,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.25,
        shadowRadius: 32,
        elevation: 18,
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
    dialogPrimaryButton: {
        width: '100%',
        minHeight: 52,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    dialogPrimaryText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '900',
    },
    dialogSecondaryButton: {
        width: '100%',
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
    disabled: {
        opacity: 0.55,
    },
});
