import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    RefreshControl,
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
import { router, useLocalSearchParams } from 'expo-router';

import { useAuth } from '@context/authContext';
import { useService } from '@/src/context/serviceContext';
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
    IconEdit,
    IconSearch,
    IconSolarArrowLeftAlt,
    IconSolarDocumentText,
} from '@constants/SvgIcons';

const getServiceSearchText = (service) =>
    `${service?.name || ''} ${service?.price || ''} ${service?.currency || ''}`
        .toLowerCase();

const normalizeCategoryParam = (value) => {
    if (Array.isArray(value)) {
        return value[0] || '';
    }

    return value || '';
};

const getPriceRange = (services) => {
    const prices = services
        .map((service) => Number(service?.price))
        .filter((price) => Number.isFinite(price));

    if (!prices.length) {
        return 'No pricing';
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return min === max
        ? formatCurrency(min)
        : `${formatCurrency(min)} - ${formatCurrency(max)}`;
};

const FeedbackDialog = ({ colors, feedback, onClose }) => {
    if (!feedback) {
        return null;
    }

    const isError = feedback.type === 'error';

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
                            shadowColor: colors.shadow,
                        },
                    ]}
                    onPress={(event) => event.stopPropagation()}
                >
                    <View
                        style={[
                            styles.dialogIcon,
                            {
                                backgroundColor: isError
                                    ? colors.isDark
                                        ? '#351D27'
                                        : '#FFF0F3'
                                    : colors.isDark
                                      ? '#173227'
                                      : '#EAF8F1',
                            },
                        ]}
                    >
                        <IconSolarDocumentText
                            width={24}
                            height={24}
                            pathStroke={isError ? colors.danger : colors.success}
                        />
                    </View>
                    <Text style={[styles.dialogTitle, { color: colors.text }]}>
                        {feedback.title}
                    </Text>
                    <Text style={[styles.dialogMessage, { color: colors.secondary }]}>
                        {feedback.message}
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.86}
                        style={[
                            styles.dialogPrimaryButton,
                            {
                                backgroundColor: isError
                                    ? colors.danger
                                    : colors.primary,
                            },
                        ]}
                        onPress={onClose}
                    >
                        <Text style={styles.dialogPrimaryText}>OK</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const ConfirmDeleteDialog = ({
    colors,
    loading,
    onCancel,
    onConfirm,
    service,
}) => (
    <Modal
        transparent
        visible={Boolean(service)}
        animationType='fade'
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={onCancel}
    >
        <Pressable
            style={[styles.modalScrim, { backgroundColor: colors.overlay }]}
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
                        {
                            backgroundColor: colors.isDark
                                ? '#351D27'
                                : '#FFF0F3',
                        },
                    ]}
                >
                    <IconDelete
                        width={24}
                        height={24}
                        pathStroke={colors.danger}
                    />
                </View>
                <Text style={[styles.dialogTitle, { color: colors.text }]}>
                    Delete service?
                </Text>
                <Text style={[styles.dialogMessage, { color: colors.secondary }]}>
                    {service?.name || 'This service'} will be removed from the
                    active catalog.
                </Text>
                <TouchableOpacity
                    activeOpacity={0.86}
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
                    activeOpacity={0.86}
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

const EditServiceDialog = ({
    colors,
    form,
    loading,
    onChange,
    onClose,
    onSubmit,
    service,
}) => {
    const { height } = useWindowDimensions();
    const isShortScreen = height < 720;

    return (
        <Modal
            transparent
            visible={Boolean(service)}
            animationType='fade'
            statusBarTranslucent
            navigationBarTranslucent
            onRequestClose={onClose}
        >
            <Pressable
                style={[styles.sheetScrim, { backgroundColor: colors.overlay }]}
                onPress={loading ? undefined : onClose}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.sheetKeyboardView}
                >
                    <Pressable
                        style={[
                            styles.serviceSheet,
                            isShortScreen && styles.serviceSheetCompact,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                maxHeight: Math.min(height * 0.82, 540),
                            },
                        ]}
                        onPress={(event) => event.stopPropagation()}
                    >
                        <View style={styles.sheetHandle} />
                        <View style={styles.sheetHeader}>
                            <View style={styles.sheetHeaderCopy}>
                                <Text
                                    style={[
                                        styles.sheetTitle,
                                        { color: colors.text },
                                    ]}
                                >
                                    Edit service
                                </Text>
                                <Text
                                    style={[
                                        styles.sheetCopy,
                                        { color: colors.muted },
                                    ]}
                                >
                                    Update the service name and local rate.
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.sheetIcon,
                                    {
                                        backgroundColor: colors.isDark
                                            ? '#17243A'
                                            : '#EEF4FF',
                                    },
                                ]}
                            >
                                <IconEdit
                                    width={22}
                                    height={22}
                                    pathStroke={colors.primary}
                                />
                            </View>
                        </View>

                        <ScrollView
                            keyboardShouldPersistTaps='handled'
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.sheetFormContent}
                        >
                            <Text
                                style={[
                                    styles.sheetFieldLabel,
                                    { color: colors.text },
                                ]}
                            >
                                Service name
                            </Text>
                            <TextInput
                                value={form.name}
                                onChangeText={(value) => onChange('name', value)}
                                placeholder='Service name'
                                placeholderTextColor={colors.muted}
                                autoCapitalize='words'
                                style={[
                                    styles.sheetInput,
                                    {
                                        backgroundColor: colors.input,
                                        borderColor: colors.border,
                                        color: colors.text,
                                    },
                                ]}
                            />
                            <Text
                                style={[
                                    styles.sheetFieldLabel,
                                    { color: colors.text },
                                ]}
                            >
                                Rate
                            </Text>
                            <TextInput
                                value={form.price}
                                onChangeText={(value) =>
                                    onChange(
                                        'price',
                                        sanitizeNumberInput(value, {
                                            allowDecimal: true,
                                        })
                                    )
                                }
                                placeholder='PKR amount'
                                placeholderTextColor={colors.muted}
                                keyboardType='numeric'
                                style={[
                                    styles.sheetInput,
                                    {
                                        backgroundColor: colors.input,
                                        borderColor: colors.border,
                                        color: colors.text,
                                    },
                                ]}
                            />

                            <TouchableOpacity
                                activeOpacity={0.86}
                                style={[
                                    styles.sheetPrimaryButton,
                                    { backgroundColor: colors.primary },
                                    loading && styles.disabled,
                                ]}
                                onPress={onSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color={colors.white} />
                                ) : (
                                    <Text style={styles.dialogPrimaryText}>
                                        Save changes
                                    </Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.86}
                                style={[
                                    styles.sheetSecondaryButton,
                                    {
                                        backgroundColor: colors.cardSoft,
                                        borderColor: colors.border,
                                    },
                                ]}
                                onPress={onClose}
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
                        </ScrollView>
                    </Pressable>
                </KeyboardAvoidingView>
            </Pressable>
        </Modal>
    );
};

export default function CategoryServicesPage() {
    const systemScheme = useColorScheme();
    const { width } = useWindowDimensions();
    const { category } = useLocalSearchParams();
    const { userProfile } = useAuth();
    const { getServicesByCategory, deleteService, updateService, loading } =
        useService();
    const categoryName = normalizeCategoryParam(category);
    const [services, setServices] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editService, setEditService] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', price: '' });
    const [feedback, setFeedback] = useState(null);
    const isAdmin = userProfile?.role === 'admin';
    const resolvedTheme = resolveThemePreference(
        userProfile?.themePreference,
        systemScheme
    );
    const colors = getAppPalette(resolvedTheme);
    const isCompact = width < 370;
    const query = searchQuery.trim().toLowerCase();
    const visibleServices = services.filter(
        (service) => !query || getServiceSearchText(service).includes(query)
    );

    const fetchCategoryServices = useCallback(
        async ({ silent = false } = {}) => {
            if (!categoryName) {
                setServices([]);
                setIsFetching(false);
                return;
            }

            if (!silent) {
                setIsFetching(true);
            }

            const categoryServices = await getServicesByCategory(categoryName);
            setServices(categoryServices);
            setIsFetching(false);
        },
        [categoryName, getServicesByCategory]
    );

    useEffect(() => {
        fetchCategoryServices();
    }, [fetchCategoryServices]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchCategoryServices({ silent: true });
        setRefreshing(false);
    }, [fetchCategoryServices]);

    const openEditDialog = (service) => {
        setEditService(service);
        setEditForm({
            name: service?.name || '',
            price: String(service?.price ?? ''),
        });
    };

    const updateEditForm = (field, value) => {
        setEditForm((current) => ({ ...current, [field]: value }));
    };

    const closeEditDialog = () => {
        setEditService(null);
        setEditForm({ name: '', price: '' });
    };

    const handleUpdateService = async () => {
        if (!editService?.id) {
            return;
        }

        const response = await updateService(editService.id, {
            ...editService,
            name: editForm.name.trim(),
            price: editForm.price,
        });

        if (response.success) {
            await fetchCategoryServices({ silent: true });
            closeEditDialog();
            setFeedback({
                type: 'success',
                title: 'Service updated',
                message: response.msg,
            });
            return;
        }

        setFeedback({
            type: 'error',
            title: 'Could not update service',
            message: response.msg,
        });
    };

    const handleDeleteService = async () => {
        if (!deleteTarget?.id) {
            return;
        }

        const response = await deleteService(deleteTarget.id);

        if (response.success) {
            await fetchCategoryServices({ silent: true });
            setDeleteTarget(null);
            setFeedback({
                type: 'success',
                title: 'Service deleted',
                message: response.msg,
            });
            return;
        }

        setFeedback({
            type: 'error',
            title: 'Could not delete service',
            message: response.msg,
        });
    };

    const renderServiceItem = ({ item, index }) => {
        const isLast = index === visibleServices.length - 1;

        return (
            <View
                style={[
                    styles.serviceRow,
                    { borderBottomColor: colors.border },
                    isLast && styles.serviceRowLast,
                ]}
            >
                <View style={styles.serviceNameWrap}>
                    <Text
                        style={[styles.serviceName, { color: colors.text }]}
                        numberOfLines={2}
                    >
                        {item.name}
                    </Text>
                </View>
                <View style={styles.servicePriceWrap}>
                    <Text
                        style={[styles.servicePriceLabel, { color: colors.muted }]}
                        numberOfLines={1}
                    >
                        Rate
                    </Text>
                    <Text
                        style={[styles.servicePrice, { color: colors.accent }]}
                        numberOfLines={1}
                    >
                        {formatCurrency(item.price)}
                    </Text>
                </View>
                {isAdmin && (
                    <View style={styles.adminActions}>
                        <Pressable
                            accessibilityRole='button'
                            onPress={() => openEditDialog(item)}
                            style={({ pressed }) => [
                                styles.actionButton,
                                { backgroundColor: colors.cardSoft },
                                pressed && styles.pressed,
                            ]}
                        >
                            <IconEdit
                                width={17}
                                height={17}
                                pathStroke={colors.primary}
                            />
                        </Pressable>
                        <Pressable
                            accessibilityRole='button'
                            onPress={() => setDeleteTarget(item)}
                            style={({ pressed }) => [
                                styles.actionButton,
                                {
                                    backgroundColor: colors.isDark
                                        ? '#351D27'
                                        : '#FFF0F3',
                                },
                                pressed && styles.pressed,
                            ]}
                        >
                            <IconDelete
                                width={17}
                                height={17}
                                pathStroke={colors.danger}
                            />
                        </Pressable>
                    </View>
                )}
            </View>
        );
    };

    const renderServicesList = () => (
        <View
            style={[
                styles.serviceGroup,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                },
            ]}
        >
            {visibleServices.map((item, index) => (
                <React.Fragment key={String(item?.id || index)}>
                    {renderServiceItem({ item, index })}
                </React.Fragment>
            ))}
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyWrap}>
            <View
                style={[
                    styles.emptyIcon,
                    { backgroundColor: colors.cardSoft },
                ]}
            >
                <IconSearch width={24} height={24} pathStroke={colors.muted} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No services found
            </Text>
            <Text style={[styles.emptyText, { color: colors.secondary }]}>
                Pull to refresh or adjust your search.
            </Text>
        </View>
    );

    if (isFetching) {
        return (
            <SafeAreaView
                style={[styles.safeArea, { backgroundColor: colors.page }]}
                edges={['top', 'left', 'right']}
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color={colors.accent} />
                    <Text style={[styles.loadingText, { color: colors.muted }]}>
                        Loading category...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={[styles.safeArea, { backgroundColor: colors.page }]}
            edges={['top', 'left', 'right']}
        >
            <FlatList
                data={visibleServices.length ? ['services'] : []}
                keyExtractor={(item) => item}
                renderItem={renderServicesList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <View style={styles.headerBar}>
                            <Pressable
                                accessibilityRole='button'
                                onPress={() => router.back()}
                                style={({ pressed }) => [
                                    styles.backButton,
                                    { backgroundColor: colors.card },
                                    pressed && styles.pressed,
                                ]}
                            >
                                <IconSolarArrowLeftAlt
                                    width={22}
                                    height={22}
                                    pathStroke={colors.text}
                                />
                            </Pressable>
                            <Text style={[styles.headerLabel, { color: colors.muted }]}>
                                Services
                            </Text>
                            <View style={styles.headerSpacer} />
                        </View>

                        <Text
                            style={[
                                styles.title,
                                { color: colors.text },
                                isCompact && styles.compactTitle,
                            ]}
                        >
                            {categoryName || 'Services'}
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.secondary }]}>
                            {services.length}{' '}
                            {services.length === 1 ? 'active service' : 'active services'}{' '}
                            in this category.
                        </Text>

                        <View
                            style={[
                                styles.summaryCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.summaryLabel,
                                    { color: colors.muted },
                                ]}
                            >
                                Price range
                            </Text>
                            <Text
                                style={[
                                    styles.summaryValue,
                                    { color: colors.text },
                                ]}
                                numberOfLines={2}
                            >
                                {getPriceRange(services)}
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
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder='Search services'
                                placeholderTextColor={colors.muted}
                                style={[styles.searchInput, { color: colors.text }]}
                                returnKeyType='search'
                            />
                        </View>
                    </View>
                }
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.accent}
                        colors={[colors.accent]}
                    />
                }
                removeClippedSubviews
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={8}
            />

            <EditServiceDialog
                colors={colors}
                form={editForm}
                loading={loading}
                service={editService}
                onChange={updateEditForm}
                onClose={closeEditDialog}
                onSubmit={handleUpdateService}
            />
            <ConfirmDeleteDialog
                colors={colors}
                loading={loading}
                service={deleteTarget}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={handleDeleteService}
            />
            <FeedbackDialog
                colors={colors}
                feedback={feedback}
                onClose={() => setFeedback(null)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 13,
        fontWeight: '700',
    },
    listContent: {
        flexGrow: 1,
        paddingHorizontal: AppSpacing.screenX,
        paddingTop: AppSpacing.screenTop,
        paddingBottom: AppSpacing.sectionGap,
    },
    header: {
        paddingBottom: 14,
    },
    headerBar: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerLabel: {
        ...AppTypography.eyebrow,
    },
    headerSpacer: {
        width: 42,
    },
    title: {
        ...AppTypography.screenTitle,
    },
    compactTitle: {
        ...AppTypography.screenTitleCompact,
    },
    subtitle: {
        marginTop: 8,
        ...AppTypography.body,
    },
    summaryCard: {
        marginTop: 18,
        marginBottom: AppSpacing.sectionGap,
        borderRadius: AppRadii.xl,
        borderWidth: StyleSheet.hairlineWidth,
        padding: AppSpacing.card,
    },
    summaryLabel: {
        ...AppTypography.eyebrow,
        marginBottom: 6,
    },
    summaryValue: {
        ...AppTypography.cardTitle,
    },
    searchBox: {
        minHeight: 50,
        borderRadius: 18,
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    searchInput: {
        flex: 1,
        minHeight: 46,
        fontSize: 14,
        fontWeight: '700',
    },
    serviceGroup: {
        borderRadius: AppRadii.xl,
        borderWidth: StyleSheet.hairlineWidth,
        overflow: 'hidden',
    },
    serviceRow: {
        minHeight: 68,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceRowLast: {
        borderBottomWidth: 0,
    },
    serviceNameWrap: {
        flex: 1,
        minWidth: 0,
        paddingRight: 12,
    },
    serviceName: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '900',
    },
    servicePriceWrap: {
        minWidth: 92,
        alignItems: 'flex-end',
    },
    servicePriceLabel: {
        marginBottom: 2,
        fontSize: 11,
        lineHeight: 14,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    servicePrice: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '900',
        textAlign: 'right',
    },
    adminActions: {
        flexDirection: 'row',
        gap: 6,
        marginLeft: 12,
    },
    actionButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressed: {
        opacity: 0.76,
        transform: [{ scale: 0.98 }],
    },
    emptyWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 44,
        paddingHorizontal: 24,
    },
    emptyIcon: {
        width: 58,
        height: 58,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    emptyTitle: {
        ...AppTypography.cardTitle,
        marginBottom: 6,
    },
    emptyText: {
        ...AppTypography.caption,
        fontWeight: '600',
        textAlign: 'center',
    },
    modalScrim: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
    },
    sheetScrim: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 18,
    },
    sheetKeyboardView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    dialogCard: {
        width: '100%',
        maxWidth: 356,
        borderRadius: AppRadii.sheet,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 22,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.24,
        shadowRadius: 30,
        elevation: 14,
    },
    serviceSheet: {
        width: '100%',
        borderRadius: AppRadii.sheet,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 16,
        paddingBottom: 18,
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
    sheetTitle: {
        ...AppTypography.sectionTitle,
        marginBottom: 4,
    },
    sheetCopy: {
        ...AppTypography.body,
    },
    sheetIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sheetFormContent: {
        paddingBottom: 4,
    },
    sheetFieldLabel: {
        fontSize: 13,
        fontWeight: '900',
        marginBottom: 8,
    },
    sheetInput: {
        minHeight: 52,
        borderRadius: 18,
        borderWidth: 1,
        paddingHorizontal: 14,
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 14,
    },
    sheetPrimaryButton: {
        minHeight: 52,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    sheetSecondaryButton: {
        minHeight: 50,
        borderRadius: 18,
        borderWidth: StyleSheet.hairlineWidth,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    dialogIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
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
        marginBottom: 16,
    },
    dialogPrimaryButton: {
        minHeight: 52,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        marginTop: 8,
    },
    dialogPrimaryText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '900',
    },
    dialogSecondaryButton: {
        minHeight: 50,
        borderRadius: 18,
        borderWidth: StyleSheet.hairlineWidth,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        marginTop: 10,
    },
    dialogSecondaryText: {
        fontSize: 15,
        fontWeight: '900',
    },
    disabled: {
        opacity: 0.55,
    },
});
