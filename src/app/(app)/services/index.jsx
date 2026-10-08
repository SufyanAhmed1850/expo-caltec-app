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
import { router } from 'expo-router';

import { useAuth } from '@context/authContext';
import { useService } from '@/src/context/serviceContext';
import {
    AppRadii,
    AppSpacing,
    AppTypography,
    getAppPalette,
    resolveThemePreference,
    sanitizeNumberInput,
} from '@constants/appTheme';
import {
    IconSearch,
    IconServices,
    IconSolarBolt,
    IconSolarArrowRightAlt,
    IconSolarDocumentText,
    IconSolarGauge,
    IconSolarMapPointWave,
    IconSolarRuler,
    IconSolarThermometer,
    IconSolarWaterdrop,
    IconSolarWidget,
} from '@constants/SvgIcons';

const INITIAL_SERVICE = {
    category: '',
    name: '',
    price: '',
};

const getCategorySearchText = (category) =>
    `${category?.name || ''} ${category?.servicesCount || ''}`.toLowerCase();

const getTotalServices = (categories = []) =>
    categories.reduce(
        (total, category) => total + (Number(category?.servicesCount) || 0),
        0
    );

const getServiceSearchText = (service) =>
    `${service?.name || ''} ${service?.category || ''}`.toLowerCase();

const formatServicePrice = (service) => {
    const amount = Number(service?.price);
    const currency = service?.currency || 'PKR';

    if (!Number.isFinite(amount)) {
        return currency;
    }

    return `${currency} ${amount.toLocaleString()}`;
};

const getCategoryIconMeta = (categoryName = '', colors) => {
    const name = categoryName.toLowerCase();

    if (name.includes('electrical')) {
        return {
            Icon: IconSolarBolt,
            color: colors.primary,
            background: colors.isDark ? '#17243A' : '#EEF4FF',
        };
    }

    if (name.includes('flow')) {
        return {
            Icon: IconSolarWaterdrop,
            color: colors.success,
            background: colors.isDark ? '#173227' : '#EAF8F1',
        };
    }

    if (name.includes('mechanical')) {
        return {
            Icon: IconSolarWidget,
            color: colors.secondary,
            background: colors.isDark ? '#252A36' : '#F1F4F8',
        };
    }

    if (name.includes('precision')) {
        return {
            Icon: IconSolarRuler,
            color: colors.primary,
            background: colors.isDark ? '#17243A' : '#EEF4FF',
        };
    }

    if (name.includes('pressure')) {
        return {
            Icon: IconSolarGauge,
            color: colors.accent,
            background: colors.isDark ? '#351D27' : '#FFF0F3',
        };
    }

    if (name.includes('temperature')) {
        return {
            Icon: IconSolarThermometer,
            color: colors.accent,
            background: colors.isDark ? '#351D27' : '#FFF0F3',
        };
    }

    if (name.includes('thermal')) {
        return {
            Icon: IconSolarMapPointWave,
            color: colors.warning,
            background: colors.isDark ? '#352813' : '#FFF6E6',
        };
    }

    return {
        Icon: IconServices,
        color: colors.primary,
        background: colors.isDark ? '#17243A' : '#EEF4FF',
    };
};

const ServiceDialog = ({
    colors,
    form,
    loading,
    onChange,
    onClose,
    onSubmit,
    visible,
}) => {
    const { height } = useWindowDimensions();
    const isShortScreen = height < 720;

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
                style={[styles.sheetScrim, { backgroundColor: colors.overlay }]}
                onPress={loading ? undefined : onClose}
            >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.sheetKeyboardView}
            >
                <Pressable
                    style={[
                        styles.addServiceSheet,
                        isShortScreen && styles.addServiceSheetCompact,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            maxHeight: Math.min(height * 0.82, 620),
                        },
                    ]}
                    onPress={(event) => event.stopPropagation()}
                >
                    <View style={styles.sheetHandle} />
                    <View style={styles.sheetHeader}>
                        <View style={styles.sheetHeaderCopy}>
                            <Text
                                style={[styles.sheetTitle, { color: colors.text }]}
                            >
                                Add service
                            </Text>
                            <Text
                                style={[styles.sheetCopy, { color: colors.muted }]}
                            >
                                Create a catalog item with category, name, and
                                local price.
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
                            <IconServices
                                width={24}
                                height={20}
                                pathStroke={colors.primary}
                            />
                        </View>
                    </View>

                    <ScrollView
                        keyboardShouldPersistTaps='handled'
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.sheetFormContent}
                    >
                        <Text style={[styles.sheetFieldLabel, { color: colors.text }]}>
                            Category
                        </Text>
                        <TextInput
                            value={form.category}
                            placeholder='e.g. Pressure Calibration'
                            placeholderTextColor={colors.muted}
                            onChangeText={(value) => onChange('category', value)}
                            autoCapitalize='words'
                            style={[
                                styles.sheetInput,
                                {
                                    backgroundColor: colors.input,
                                    color: colors.text,
                                    borderColor: colors.border,
                                },
                            ]}
                        />
                        <Text style={[styles.sheetFieldLabel, { color: colors.text }]}>
                            Service name
                        </Text>
                        <TextInput
                            value={form.name}
                            placeholder='e.g. Pressure Gauge'
                            placeholderTextColor={colors.muted}
                            onChangeText={(value) => onChange('name', value)}
                            autoCapitalize='words'
                            style={[
                                styles.sheetInput,
                                {
                                    backgroundColor: colors.input,
                                    color: colors.text,
                                    borderColor: colors.border,
                                },
                            ]}
                        />
                        <Text style={[styles.sheetFieldLabel, { color: colors.text }]}>
                            Price
                        </Text>
                        <TextInput
                            value={form.price}
                            placeholder='PKR amount'
                            placeholderTextColor={colors.muted}
                            onChangeText={(value) =>
                                onChange(
                                    'price',
                                    sanitizeNumberInput(value, {
                                        allowDecimal: true,
                                    })
                                )
                            }
                            keyboardType='numeric'
                            style={[
                                styles.sheetInput,
                                {
                                    backgroundColor: colors.input,
                                    color: colors.text,
                                    borderColor: colors.border,
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
                                    Save service
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
                        styles.feedbackCard,
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
                            styles.modalIcon,
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
                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                        {feedback.title}
                    </Text>
                    <Text style={[styles.modalCopy, { color: colors.secondary }]}>
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

export default function ServicesPage() {
    const systemScheme = useColorScheme();
    const { width } = useWindowDimensions();
    const { userProfile } = useAuth();
    const { services, categories, loading, fetchServices, addService } =
        useService();
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newService, setNewService] = useState(INITIAL_SERVICE);
    const [feedback, setFeedback] = useState(null);
    const isAdmin = userProfile?.role === 'admin';
    const resolvedTheme = resolveThemePreference(
        userProfile?.themePreference,
        systemScheme
    );
    const colors = getAppPalette(resolvedTheme);
    const isCompact = width < 370;
    const query = searchQuery.trim().toLowerCase();
    const visibleCategories = categories.filter(
        (category) => !query || getCategorySearchText(category).includes(query)
    );
    const visibleServices = services.filter(
        (service) => !query || getServiceSearchText(service).includes(query)
    );
    const showingServiceResults = Boolean(query);
    const totalServices = getTotalServices(categories);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchServices();
        setRefreshing(false);
    }, [fetchServices]);

    const updateNewService = (field, value) => {
        setNewService((current) => ({ ...current, [field]: value }));
    };

    const openCategory = (category) => {
        if (!category?.name) {
            return;
        }

        router.navigate({
            pathname: '/(app)/services/[category]',
            params: { category: category.name },
        });
    };

    const handleAddService = async () => {
        const response = await addService({
            ...newService,
            category: newService.category.trim(),
            name: newService.name.trim(),
        });

        if (response.success) {
            setModalVisible(false);
            setNewService(INITIAL_SERVICE);
            setFeedback({
                type: 'success',
                title: 'Service saved',
                message: response.msg,
            });
            return;
        }

        setFeedback({
            type: 'error',
            title: 'Could not save service',
            message: response.msg,
        });
    };

    const renderCategoryItem = ({ item }) => {
        const iconMeta = getCategoryIconMeta(item.name, colors);
        const CategoryIcon = iconMeta.Icon;

        return (
            <Pressable
                accessibilityRole='button'
                onPress={() => openCategory(item)}
                style={({ pressed }) => [
                    styles.categoryCard,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        shadowColor: colors.shadow,
                    },
                    colors.isDark && styles.darkFlatShadow,
                    pressed && styles.pressed,
                ]}
            >
                <View
                    style={[
                        styles.categoryIcon,
                        { backgroundColor: iconMeta.background },
                    ]}
                >
                    <CategoryIcon
                        width={24}
                        height={24}
                        pathStroke={iconMeta.color}
                    />
                </View>
                <View style={styles.categoryCopy}>
                    <Text
                        style={[styles.categoryName, { color: colors.text }]}
                        numberOfLines={2}
                    >
                        {item.name}
                    </Text>
                    <Text style={[styles.categoryCount, { color: colors.secondary }]}>
                        {item.servicesCount}{' '}
                        {Number(item.servicesCount) === 1 ? 'service' : 'services'}
                    </Text>
                </View>
                <IconSolarArrowRightAlt
                    width={20}
                    height={20}
                    pathStroke={colors.muted}
                />
            </Pressable>
        );
    };

    const renderServiceResultItem = ({ item, index }) => {
        const isLast = index === visibleServices.length - 1;

        return (
            <Pressable
                accessibilityRole='button'
                onPress={() => openCategory({ name: item.category })}
                style={({ pressed }) => [
                    styles.serviceRow,
                    { borderBottomColor: colors.border },
                    isLast && styles.serviceRowLast,
                    pressed && styles.pressed,
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
                        {formatServicePrice(item)}
                    </Text>
                </View>
            </Pressable>
        );
    };

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
                {showingServiceResults
                    ? 'Try a different service name or category.'
                    : 'Pull to refresh or adjust your search.'}
            </Text>
        </View>
    );

    if (loading && !refreshing && !categories.length) {
        return (
            <SafeAreaView
                style={[styles.safeArea, { backgroundColor: colors.page }]}
                edges={['top', 'left', 'right']}
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color={colors.accent} />
                    <Text style={[styles.loadingText, { color: colors.muted }]}>
                        Loading services...
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
                data={showingServiceResults ? [visibleServices] : visibleCategories}
                keyExtractor={(item) =>
                    showingServiceResults
                        ? 'search-results'
                        : item.name
                }
                renderItem={
                    showingServiceResults
                        ? ({ item }) => (
                              <View
                                  style={[
                                      styles.serviceGroup,
                                      {
                                          backgroundColor: colors.card,
                                          borderColor: colors.border,
                                      },
                                  ]}
                              >
                                  {item.map((service, index) =>
                                      renderServiceResultItem({
                                          item: service,
                                          index,
                                      })
                                  )}
                              </View>
                          )
                        : renderCategoryItem
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.listContent,
                    isAdmin && styles.adminListContent,
                ]}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <View style={styles.kickerRow}>
                            <Text style={[styles.kicker, { color: colors.accent }]}>
                                Services
                            </Text>
                            <Text style={[styles.kickerMeta, { color: colors.muted }]}>
                                {categories.length} categories
                            </Text>
                        </View>
                        <Text
                            style={[
                                styles.title,
                                { color: colors.text },
                                isCompact && styles.compactTitle,
                            ]}
                        >
                            Calibration catalog
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.secondary }]}>
                            Browse active Caltec calibration services and request
                            pricing through enquiries.
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
                            <View>
                                <Text
                                    style={[
                                        styles.summaryValue,
                                        { color: colors.text },
                                    ]}
                                >
                                    {totalServices}
                                </Text>
                                <Text
                                    style={[
                                        styles.summaryLabel,
                                        { color: colors.muted },
                                    ]}
                                >
                                    Active services
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.summaryDivider,
                                    { backgroundColor: colors.border },
                                ]}
                            />
                            <View>
                                <Text
                                    style={[
                                        styles.summaryValue,
                                        { color: colors.text },
                                    ]}
                                >
                                    PKR
                                </Text>
                                <Text
                                    style={[
                                        styles.summaryLabel,
                                        { color: colors.muted },
                                    ]}
                                >
                                    Local pricing
                                </Text>
                            </View>
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
                                placeholder='Search services or categories'
                                placeholderTextColor={colors.muted}
                                style={[styles.searchInput, { color: colors.text }]}
                                returnKeyType='search'
                            />
                        </View>
                        {showingServiceResults && (
                            <Text
                                style={[
                                    styles.searchResultMeta,
                                    { color: colors.muted },
                                ]}
                            >
                                {visibleServices.length}{' '}
                                {visibleServices.length === 1
                                    ? 'service result'
                                    : 'service results'}
                            </Text>
                        )}
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
                initialNumToRender={8}
                maxToRenderPerBatch={8}
                windowSize={7}
            />

            {isAdmin && (
                <TouchableOpacity
                    activeOpacity={0.88}
                    style={[
                        styles.addButton,
                        {
                            backgroundColor: colors.accent,
                            shadowColor: colors.shadow,
                        },
                        colors.isDark && styles.darkAddButton,
                    ]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addButtonIcon}>+</Text>
                    <Text style={styles.addButtonText}>New Service</Text>
                </TouchableOpacity>
            )}

            <ServiceDialog
                colors={colors}
                form={newService}
                loading={loading}
                visible={modalVisible}
                onChange={updateNewService}
                onClose={() => setModalVisible(false)}
                onSubmit={handleAddService}
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
    adminListContent: {
        paddingBottom: 78,
    },
    header: {
        paddingBottom: 14,
    },
    kickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 7,
    },
    kicker: {
        ...AppTypography.eyebrow,
    },
    kickerMeta: {
        ...AppTypography.caption,
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
        maxWidth: 340,
    },
    summaryCard: {
        marginTop: 18,
        marginBottom: AppSpacing.sectionGap,
        borderRadius: AppRadii.xl,
        borderWidth: StyleSheet.hairlineWidth,
        padding: AppSpacing.card,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    summaryValue: {
        ...AppTypography.sectionTitle,
        textAlign: 'center',
    },
    summaryLabel: {
        marginTop: 3,
        ...AppTypography.caption,
        textAlign: 'center',
    },
    summaryDivider: {
        width: StyleSheet.hairlineWidth,
        height: 38,
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
    categoryCard: {
        minHeight: 88,
        borderRadius: AppRadii.xl,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 3,
    },
    darkFlatShadow: {
        shadowOpacity: 0,
        elevation: 0,
    },
    pressed: {
        opacity: 0.78,
        transform: [{ scale: 0.99 }],
    },
    categoryIcon: {
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 13,
    },
    categoryCopy: {
        flex: 1,
        paddingRight: 10,
    },
    categoryName: {
        ...AppTypography.cardTitle,
    },
    categoryCount: {
        marginTop: 4,
        ...AppTypography.caption,
    },
    serviceGroup: {
        borderRadius: AppRadii.xl,
        borderWidth: StyleSheet.hairlineWidth,
        overflow: 'hidden',
        marginBottom: 12,
    },
    serviceRow: {
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 68,
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceRowLast: {
        borderBottomWidth: 0,
    },
    serviceNameWrap: {
        flex: 1,
        paddingRight: 12,
        minWidth: 0,
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
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 4,
    },
    servicePrice: {
        fontSize: 16,
        fontWeight: '900',
    },
    searchResultMeta: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: '800',
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
    addButton: {
        position: 'absolute',
        right: 18,
        bottom: 20,
        minHeight: 54,
        borderRadius: 24,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 8,
    },
    darkAddButton: {
        shadowOpacity: 0,
        elevation: 0,
    },
    addButtonIcon: {
        color: '#FFFFFF',
        fontSize: 22,
        lineHeight: 22,
        fontWeight: '900',
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '900',
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
    addServiceSheet: {
        width: '100%',
        borderRadius: AppRadii.sheet,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 16,
        paddingBottom: 18,
    },
    addServiceSheetCompact: {
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
    feedbackCard: {
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
    modalIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 14,
    },
    modalTitle: {
        ...AppTypography.sectionTitle,
        textAlign: 'center',
        marginBottom: 8,
    },
    modalCopy: {
        ...AppTypography.body,
        textAlign: 'center',
        marginBottom: 16,
    },
    dialogPrimaryButton: {
        minHeight: 52,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
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
