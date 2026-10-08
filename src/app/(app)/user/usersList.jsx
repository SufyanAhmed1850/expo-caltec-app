import React, {
    useCallback,
    useDeferredValue,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
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

import { useAuth } from '@context/authContext';
import {
    AppRadii,
    AppSpacing,
    AppTypography,
    getAppPalette,
    resolveThemePreference,
} from '@/src/constants/appTheme';
import {
    IconMail,
    IconPhone,
    IconProfile,
    IconSearch,
    IconSolarArrowLeftAlt,
    IconSolarBuildings,
    IconSolarShieldCheck,
    IconSolarUsersGroupRounded,
} from '@constants/SvgIcons';
import { apiRequest } from '@/src/lib/apiClient';

const getInitials = (name = '') => {
    const initials = String(name)
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');

    return initials || 'C';
};

const getUserId = (user) => user?.id || user?.uid || user?._id || '';

const getUserSearchText = (user) =>
    [
        user?.name,
        user?.email,
        user?.companyName,
        user?.designation,
        user?.phone,
        user?.role,
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

const formatRole = (role) =>
    role === 'admin' ? 'Admin' : role === 'user' ? 'User' : 'Member';

const InfoRow = ({ colors, icon, text, selectable }) => (
    <View style={styles.infoRow}>
        {icon}
        <Text
            selectable={selectable}
            style={[styles.infoText, { color: colors.secondary }]}
            numberOfLines={1}
        >
            {text}
        </Text>
    </View>
);

const UserAvatar = ({ colors, failedImages, onImageError, user }) => {
    const userId = getUserId(user);
    const imageUri = user?.profileImage;
    const canShowImage = imageUri && !failedImages[userId];

    if (canShowImage) {
        return (
            <Image
                source={{ uri: imageUri }}
                style={styles.avatar}
                onError={() => onImageError(userId)}
            />
        );
    }

    return (
        <View
            style={[
                styles.avatarPlaceholder,
                { backgroundColor: colors.cardSoft },
            ]}
        >
            {user?.name ? (
                <Text style={[styles.avatarInitials, { color: colors.accent }]}>
                    {getInitials(user.name)}
                </Text>
            ) : (
                <IconProfile width={28} height={28} pathStroke={colors.muted} />
            )}
        </View>
    );
};

const UserCard = ({ colors, failedImages, isCompact, onImageError, user }) => (
    <Pressable
        style={({ pressed }) => [
            styles.userCard,
            isCompact && styles.compactUserCard,
            {
                backgroundColor: colors.card,
                borderColor: colors.border,
            },
            colors.isDark && styles.darkFlatShadow,
            pressed && styles.pressed,
        ]}
    >
        <UserAvatar
            colors={colors}
            failedImages={failedImages}
            onImageError={onImageError}
            user={user}
        />
        <View style={styles.userContent}>
            <View style={styles.nameRow}>
                <Text
                    selectable
                    style={[styles.userName, { color: colors.text }]}
                    numberOfLines={1}
                >
                    {user?.name || 'Unnamed user'}
                </Text>
                <View
                    style={[
                        styles.roleBadge,
                        {
                            backgroundColor:
                                user?.role === 'admin'
                                    ? colors.isDark
                                        ? '#173227'
                                        : '#EAF8F1'
                                    : colors.isDark
                                      ? '#17243A'
                                      : '#EEF4FF',
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.roleText,
                            {
                                color:
                                    user?.role === 'admin'
                                        ? colors.success
                                        : colors.primary,
                            },
                        ]}
                    >
                        {formatRole(user?.role)}
                    </Text>
                </View>
            </View>

            <InfoRow
                colors={colors}
                icon={
                    <IconSolarBuildings
                        width={16}
                        height={16}
                        pathStroke={colors.muted}
                    />
                }
                text={user?.companyName || 'Company not added'}
            />
            <InfoRow
                colors={colors}
                icon={
                    <IconSolarUsersGroupRounded
                        width={16}
                        height={16}
                        pathStroke={colors.muted}
                    />
                }
                text={user?.designation || 'Designation not added'}
            />
            <InfoRow
                colors={colors}
                icon={
                    <IconMail width={16} height={16} pathStroke={colors.muted} />
                }
                selectable
                text={user?.email || 'Email not available'}
            />
            <InfoRow
                colors={colors}
                icon={
                    <IconPhone width={16} height={16} pathStroke={colors.muted} />
                }
                selectable
                text={user?.phone || 'Phone not added'}
            />
        </View>
    </Pressable>
);

export default function UsersList() {
    const systemScheme = useColorScheme();
    const { width } = useWindowDimensions();
    const { authStatus, authUser, userProfile } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [failedImages, setFailedImages] = useState({});

    const themePreference = userProfile?.themePreference || 'system';
    const resolvedTheme = resolveThemePreference(themePreference, systemScheme);
    const colors = getAppPalette(resolvedTheme);
    const isAdmin = userProfile?.role === 'admin';
    const isAuthLoading = authStatus === 'loading' || !userProfile;
    const isCompact = width < 380;
    const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLowerCase());
    const currentUserId = authUser?.uid || authUser?.id || userProfile?.id || '';

    const filteredUsers = useMemo(() => {
        if (!deferredSearchQuery) {
            return users;
        }

        return users.filter((user) =>
            getUserSearchText(user).includes(deferredSearchQuery)
        );
    }, [deferredSearchQuery, users]);

    const completedProfiles = users.filter((user) => user.profileCompleted).length;
    const adminCount = users.filter((user) => user.role === 'admin').length;

    const fetchUsers = useCallback(
        async ({ silent = false } = {}) => {
            if (!isAdmin) {
                return;
            }

            try {
                if (!silent) {
                    setLoading(true);
                }

                setErrorMessage('');
                const response = await apiRequest('/users');
                const userList = Array.isArray(response?.users)
                    ? response.users
                    : [];

                setUsers(
                    userList.filter((item) => getUserId(item) !== currentUserId)
                );
            } catch (error) {
                setErrorMessage(
                    error?.message ||
                        'Unable to load users right now. Pull to refresh and try again.'
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [currentUserId, isAdmin]
    );

    useEffect(() => {
        if (isAuthLoading) {
            return;
        }

        if (!isAdmin) {
            router.replace('/(app)/user');
            return;
        }

        fetchUsers();
    }, [fetchUsers, isAdmin, isAuthLoading]);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUsers({ silent: true });
    }, [fetchUsers]);

    const handleImageError = useCallback((userId) => {
        if (!userId) {
            return;
        }

        setFailedImages((current) => ({ ...current, [userId]: true }));
    }, []);

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerBar}>
                <TouchableOpacity
                    activeOpacity={0.82}
                    accessibilityRole='button'
                    accessibilityLabel='Go back'
                    style={[styles.backButton, { backgroundColor: colors.card }]}
                    onPress={() => router.back()}
                >
                    <IconSolarArrowLeftAlt
                        width={22}
                        height={22}
                        pathStroke={colors.text}
                    />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    Users
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <Text style={[styles.kicker, { color: colors.accent }]}>
                Admin directory
            </Text>
            <Text
                style={[
                    styles.title,
                    isCompact && styles.compactTitle,
                    { color: colors.text },
                ]}
            >
                Users List
            </Text>
            <Text style={[styles.subtitle, { color: colors.secondary }]}>
                Review registered Caltec app users and profile readiness.
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
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: colors.text }]}>
                        {users.length}
                    </Text>
                    <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                        Users
                    </Text>
                </View>
                <View
                    style={[
                        styles.summaryDivider,
                        { backgroundColor: colors.border },
                    ]}
                />
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: colors.text }]}>
                        {completedProfiles}
                    </Text>
                    <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                        Complete
                    </Text>
                </View>
                <View
                    style={[
                        styles.summaryDivider,
                        { backgroundColor: colors.border },
                    ]}
                />
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: colors.text }]}>
                        {adminCount}
                    </Text>
                    <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                        Admins
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
                <IconSearch width={20} height={20} pathStroke={colors.muted} />
                <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder='Search users'
                    placeholderTextColor={colors.muted}
                    style={[styles.searchInput, { color: colors.text }]}
                    returnKeyType='search'
                    autoCapitalize='none'
                    autoCorrect={false}
                />
            </View>
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
                {errorMessage ? (
                    <IconSolarShieldCheck
                        width={24}
                        height={24}
                        pathStroke={colors.danger}
                    />
                ) : (
                    <IconSolarUsersGroupRounded
                        width={24}
                        height={24}
                        pathStroke={colors.muted}
                    />
                )}
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {errorMessage ? 'Could not load users' : 'No users found'}
            </Text>
            <Text
                selectable={Boolean(errorMessage)}
                style={[styles.emptyText, { color: colors.secondary }]}
            >
                {errorMessage ||
                    (searchQuery
                        ? 'Try a different name, company, email, or phone.'
                        : 'New users will appear here after they register.')}
            </Text>
            {errorMessage ? (
                <TouchableOpacity
                    activeOpacity={0.86}
                    style={[
                        styles.retryButton,
                        { backgroundColor: colors.primary },
                    ]}
                    onPress={() => fetchUsers()}
                >
                    <Text style={styles.retryButtonText}>Try again</Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );

    if (isAuthLoading || (loading && !users.length)) {
        return (
            <SafeAreaView
                style={[styles.safeArea, { backgroundColor: colors.page }]}
                edges={['top', 'left', 'right']}
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color={colors.accent} />
                    <Text style={[styles.loadingText, { color: colors.muted }]}>
                        Loading users...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <SafeAreaView
            style={[styles.safeArea, { backgroundColor: colors.page }]}
            edges={['top', 'left', 'right']}
        >
            <FlatList
                data={filteredUsers}
                keyExtractor={(item, index) => getUserId(item) || String(index)}
                renderItem={({ item }) => (
                    <UserCard
                        colors={colors}
                        failedImages={failedImages}
                        isCompact={isCompact}
                        onImageError={handleImageError}
                        user={item}
                    />
                )}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.accent}
                        colors={[colors.accent]}
                    />
                }
                initialNumToRender={8}
                maxToRenderPerBatch={8}
                windowSize={7}
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
        gap: 12,
    },
    header: {
        paddingBottom: 4,
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
    kicker: {
        ...AppTypography.eyebrow,
        marginBottom: 7,
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
        maxWidth: 360,
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
    summaryItem: {
        flex: 1,
        alignItems: 'center',
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
    userCard: {
        minHeight: 138,
        borderRadius: AppRadii.xl,
        borderWidth: StyleSheet.hairlineWidth,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 3,
    },
    compactUserCard: {
        alignItems: 'flex-start',
        paddingHorizontal: 14,
    },
    darkFlatShadow: {
        shadowOpacity: 0,
        elevation: 0,
    },
    pressed: {
        opacity: 0.78,
        transform: [{ scale: 0.99 }],
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#D8DEE9',
    },
    avatarPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitials: {
        fontSize: 20,
        fontWeight: '900',
    },
    userContent: {
        flex: 1,
        minWidth: 0,
        gap: 8,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    userName: {
        flex: 1,
        minWidth: 0,
        ...AppTypography.cardTitle,
    },
    roleBadge: {
        borderRadius: 14,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    roleText: {
        fontSize: 11,
        lineHeight: 13,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    infoRow: {
        minWidth: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        flex: 1,
        minWidth: 0,
        fontSize: 13,
        lineHeight: 17,
        fontWeight: '700',
    },
    emptyWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 46,
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
    retryButton: {
        minHeight: 46,
        borderRadius: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '900',
    },
});
