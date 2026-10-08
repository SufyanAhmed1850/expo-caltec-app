import React, { useMemo } from 'react';
import {
    Image,
    ImageBackground,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    useWindowDimensions,
    View,
} from 'react-native';
import { router } from 'expo-router';

import controlValveImage from '@assets/images/Control_Valve_Service_Division.png';
import electricalImage from '@assets/images/Electrical_Instrument_Calibration.png';
import fieldImage from '@assets/images/Field_Instrument_Calibration.png';
import flowImage from '@assets/images/Flow_Meter_Calibration.png';
import iso14001Badge from '@assets/images/ISO_14001-2015.png';
import iso45001Badge from '@assets/images/ISO_45001-2018.png';
import iso9001Badge from '@assets/images/ISO_9001-2015.png';
import {
    AppRadii,
    AppSpacing,
    AppTypography,
    getAppPalette,
    resolveThemePreference,
} from '@constants/appTheme';
import {
    IconEnquiry,
    IconLocation,
    IconServices,
    IconSolarArrowRightAlt,
    IconSolarDocumentText,
    IconSolarShieldCheck,
} from '@constants/SvgIcons';
import { useAuth } from '@context/authContext';
import { useService } from '@/src/context/serviceContext';
import LocationSection from '@/src/components/LocationSection';

const serviceImages = [
    controlValveImage,
    electricalImage,
    fieldImage,
    flowImage,
];

const certificationItems = [
    {
        title: 'ISO 9001',
        subtitle: 'Quality management',
        image: iso9001Badge,
    },
    {
        title: 'ISO 14001',
        subtitle: 'Environmental management',
        image: iso14001Badge,
    },
    {
        title: 'ISO 45001',
        subtitle: 'Health and safety',
        image: iso45001Badge,
    },
];

const getFeaturedCategories = (categories = []) =>
    [...categories]
        .sort(
            (left, right) =>
                Number(right?.servicesCount || 0) - Number(left?.servicesCount || 0)
        )
        .slice(0, 4);

const getSoftShadow = (colors, level = 'medium') => {
    if (colors.isDark) {
        return {
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        };
    }

    if (level === 'low') {
        return {
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 1,
        };
    }

    return {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 3,
    };
};

const ActionTile = ({ colors, icon: Icon, label, onPress, tone = 'primary' }) => {
    const isPrimary = tone === 'primary';
    const isSuccess = tone === 'success';
    const surface = isPrimary
        ? colors.primary
        : isSuccess
          ? colors.isDark
              ? '#14352F'
              : '#C8ECE8'
          : colors.isDark
            ? '#343A45'
            : '#5B626D';
    const textColor = isPrimary || !isSuccess ? colors.white : colors.text;
    const iconSurface = isPrimary || !isSuccess ? colors.white : colors.success;
    const iconStroke = isPrimary || !isSuccess ? colors.primary : colors.white;

    return (
        <Pressable
            accessibilityRole='button'
            onPress={onPress}
            style={({ pressed }) => [
                styles.actionTile,
                {
                    backgroundColor: surface,
                },
                getSoftShadow(colors),
                pressed && styles.pressed,
            ]}
        >
            <View style={[styles.actionIconWrap, { backgroundColor: iconSurface }]}>
                <Icon width={21} height={21} pathStroke={iconStroke} />
            </View>
            <Text style={[styles.actionLabel, { color: textColor }]}>{label}</Text>
        </Pressable>
    );
};

const SmallServiceCard = ({ colors, category, image, index, onPress }) => (
    <Pressable
        accessibilityRole='button'
        onPress={onPress}
        style={({ pressed }) => [
            styles.smallServiceCard,
            {
                backgroundColor: colors.card,
                borderColor: colors.border,
            },
            getSoftShadow(colors, 'low'),
            pressed && styles.pressed,
        ]}
    >
        <View
            style={[
                styles.smallServiceIcon,
                {
                    backgroundColor:
                        index % 2 === 0
                            ? colors.isDark
                                ? '#173227'
                                : '#EAF8F1'
                            : colors.isDark
                              ? '#17243A'
                              : '#EEF4FF',
                },
            ]}
        >
            <Image source={image} style={styles.smallServiceImage} resizeMode='cover' />
        </View>
        <View style={styles.smallServiceCopy}>
            <Text
                numberOfLines={1}
                style={[styles.smallServiceTitle, { color: colors.text }]}
            >
                {category?.name || 'Calibration service'}
            </Text>
            <Text
                numberOfLines={1}
                style={[styles.smallServiceMeta, { color: colors.muted }]}
            >
                {Number(category?.servicesCount || 0)} service options
            </Text>
        </View>
        <IconSolarArrowRightAlt width={16} height={16} pathStroke={colors.muted} />
    </Pressable>
);

export default function Home() {
    const { userProfile } = useAuth();
    const { categories, fetchServices, loading } = useService();
    const systemScheme = useColorScheme();
    const { width } = useWindowDimensions();
    const resolvedTheme = resolveThemePreference(
        userProfile?.themePreference || 'system',
        systemScheme
    );
    const colors = getAppPalette(resolvedTheme);
    const featuredCategories = useMemo(
        () => getFeaturedCategories(categories),
        [categories]
    );
    const primaryCategory = featuredCategories[0];
    const primaryCategoryCount = Number(primaryCategory?.servicesCount || 0);
    const isWide = width >= 740;

    return (
        <ScrollView
            style={[styles.page, { backgroundColor: colors.page }]}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={fetchServices}
                    tintColor={colors.primary}
                />
            }
        >
            <View style={styles.topBar}>
                <Text style={[styles.brand, { color: colors.primary }]}>CALTEC</Text>
            </View>

            <ImageBackground
                source={fieldImage}
                resizeMode='cover'
                imageStyle={styles.heroImage}
                style={[styles.heroCard, getSoftShadow(colors)]}
            >
                <View style={styles.heroOverlay} />
                <View style={styles.heroContent}>
                    <View style={styles.heroCopy}>
                        <Text style={styles.heroTitle}>
                            Calibration App and Instrumentation Services
                        </Text>
                        <Text style={styles.heroSubtitle}>
                            Manage enquiries, inspect services, and keep calibration
                            workflows moving.
                        </Text>
                    </View>
                    <Pressable
                        accessibilityRole='button'
                        onPress={() => router.navigate('/(app)/services')}
                        style={({ pressed }) => [
                            styles.heroLink,
                            pressed && styles.pressed,
                        ]}
                    >
                        <Text style={styles.heroLinkText}>View catalog</Text>
                        <IconSolarArrowRightAlt
                            width={16}
                            height={16}
                            pathStroke={colors.white}
                        />
                    </Pressable>
                </View>
            </ImageBackground>

            <View style={[styles.actionGrid, isWide && styles.actionGridWide]}>
                <ActionTile
                    colors={colors}
                    icon={IconEnquiry}
                    label='Enquiry Review'
                    onPress={() => router.navigate('/(app)/enquiry')}
                />
                <ActionTile
                    colors={colors}
                    icon={IconServices}
                    label='Services'
                    tone='success'
                    onPress={() => router.navigate('/(app)/services')}
                />
                <ActionTile
                    colors={colors}
                    icon={IconSolarShieldCheck}
                    label='Contact'
                    tone='neutral'
                    onPress={() => router.navigate('/(app)/home/contact')}
                />
            </View>

            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Featured Services
                </Text>
                <Pressable
                    accessibilityRole='button'
                    onPress={() => router.navigate('/(app)/services')}
                    style={styles.inlineLink}
                >
                    <Text style={[styles.inlineLinkText, { color: colors.muted }]}>
                        See all
                    </Text>
                    <IconSolarArrowRightAlt
                        width={15}
                        height={15}
                        pathStroke={colors.muted}
                    />
                </Pressable>
            </View>

            <View style={[styles.featureGrid, isWide && styles.featureGridWide]}>
                <Pressable
                    accessibilityRole='button'
                    onPress={() =>
                        primaryCategory
                            ? router.navigate({
                                  pathname: '/(app)/services/[category]',
                                  params: { category: primaryCategory.name },
                              })
                            : router.navigate('/(app)/services')
                    }
                    style={({ pressed }) => [
                        styles.featureCard,
                        getSoftShadow(colors),
                        pressed && styles.pressed,
                    ]}
                >
                    <ImageBackground
                        source={controlValveImage}
                        resizeMode='cover'
                        imageStyle={styles.featureImage}
                        style={styles.featureImageWrap}
                    >
                        <View style={styles.featureOverlay} />
                        <View style={styles.featureBadge}>
                            <Text style={styles.featureBadgeText}>
                                {primaryCategoryCount || 'Top'}
                            </Text>
                            {!!primaryCategoryCount && (
                                <Text style={styles.featureBadgeLabel}>services</Text>
                            )}
                        </View>
                        <View style={styles.featureCopy}>
                            <Text style={styles.featureTitle}>
                                {primaryCategory?.name || 'Instrumentation calibration'}
                            </Text>
                            <Text style={styles.featureMeta}>Open service category</Text>
                        </View>
                    </ImageBackground>
                </Pressable>

                <View style={styles.serviceStack}>
                    {(featuredCategories.length ? featuredCategories : [null, null, null])
                        .slice(0, 3)
                        .map((category, index) => (
                            <SmallServiceCard
                                key={category?.name || `service-${index}`}
                                colors={colors}
                                category={category}
                                image={serviceImages[index + 1] || fieldImage}
                                index={index}
                                onPress={() =>
                                    category
                                        ? router.navigate({
                                              pathname: '/(app)/services/[category]',
                                              params: { category: category.name },
                                          })
                                        : router.navigate('/(app)/services')
                                }
                            />
                        ))}
                </View>
            </View>

            <View style={[styles.lowerGrid, isWide && styles.lowerGridWide]}>
                <View
                    style={[
                        styles.infoPanel,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                        getSoftShadow(colors, 'low'),
                    ]}
                >
                    <View style={styles.infoHeader}>
                        <View>
                            <Text style={[styles.infoTitle, { color: colors.text }]}>
                                Certifications
                            </Text>
                            <Text style={[styles.infoKicker, { color: colors.muted }]}>
                                Verified management standards
                            </Text>
                        </View>
                        <IconSolarShieldCheck
                            width={22}
                            height={22}
                            pathStroke={colors.primary}
                        />
                    </View>
                    <View style={styles.certList}>
                        {certificationItems.map((item) => (
                            <View
                                key={item.title}
                                style={[
                                    styles.certRow,
                                    {
                                        backgroundColor: colors.cardSoft,
                                        borderColor: colors.border,
                                    },
                                ]}
                            >
                                <Image
                                    source={item.image}
                                    style={styles.certRowImage}
                                    resizeMode='contain'
                                />
                                <View style={styles.certRowCopy}>
                                    <Text
                                        style={[
                                            styles.certRowTitle,
                                            { color: colors.text },
                                        ]}
                                    >
                                        {item.title}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.certRowSubtitle,
                                            { color: colors.muted },
                                        ]}
                                    >
                                        {item.subtitle}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.contactStack}>
                    <Pressable
                        accessibilityRole='button'
                        onPress={() => router.navigate('/(app)/enquiry/newEnquiry')}
                        style={({ pressed }) => [
                            styles.contactCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                            getSoftShadow(colors, 'low'),
                            pressed && styles.pressed,
                        ]}
                    >
                        <View
                            style={[
                                styles.contactIcon,
                                {
                                    backgroundColor: colors.isDark
                                        ? '#17243A'
                                        : '#EEF4FF',
                                },
                            ]}
                        >
                            <IconSolarDocumentText
                                width={19}
                                height={19}
                                pathStroke={colors.primary}
                            />
                        </View>
                        <View style={styles.contactCopy}>
                            <Text
                                style={[styles.contactTitle, { color: colors.text }]}
                            >
                                Request a quote
                            </Text>
                            <Text
                                style={[styles.contactMeta, { color: colors.muted }]}
                            >
                                Start a new enquiry
                            </Text>
                        </View>
                        <IconSolarArrowRightAlt
                            width={16}
                            height={16}
                            pathStroke={colors.muted}
                        />
                    </Pressable>

                    <Pressable
                        accessibilityRole='button'
                        onPress={() => router.navigate('/(app)/home/contact')}
                        style={({ pressed }) => [
                            styles.contactCard,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                            getSoftShadow(colors, 'low'),
                            pressed && styles.pressed,
                        ]}
                    >
                        <View
                            style={[
                                styles.contactIcon,
                                {
                                    backgroundColor: colors.isDark
                                        ? '#173227'
                                        : '#EAF8F1',
                                },
                            ]}
                        >
                            <IconLocation
                                width={19}
                                height={19}
                                pathStroke={colors.success}
                            />
                        </View>
                        <View style={styles.contactCopy}>
                            <Text
                                style={[styles.contactTitle, { color: colors.text }]}
                            >
                                Karachi office
                            </Text>
                            <Text
                                style={[styles.contactMeta, { color: colors.muted }]}
                            >
                                Contact and location
                            </Text>
                        </View>
                        <IconSolarArrowRightAlt
                            width={16}
                            height={16}
                            pathStroke={colors.muted}
                        />
                    </Pressable>
                </View>
            </View>

            <LocationSection colors={colors} compact />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    content: {
        gap: 18,
        paddingHorizontal: AppSpacing.screenX,
        paddingTop: AppSpacing.screenTop,
        paddingBottom: 24,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 14,
    },
    brand: {
        fontSize: 24,
        lineHeight: 30,
        fontWeight: '900',
    },
    heroCard: {
        minHeight: 138,
        borderRadius: AppRadii.xl,
        overflow: 'hidden',
    },
    heroImage: {
        borderRadius: AppRadii.xl,
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(10, 72, 99, 0.76)',
    },
    heroContent: {
        flex: 1,
        justifyContent: 'space-between',
        gap: 18,
        padding: 16,
    },
    heroCopy: {
        maxWidth: 260,
        gap: 7,
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 19,
        lineHeight: 24,
        fontWeight: '900',
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.78)',
        fontSize: 12,
        lineHeight: 17,
        fontWeight: '700',
    },
    heroLink: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    heroLinkText: {
        color: '#FFFFFF',
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '900',
    },
    actionGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    actionGridWide: {
        maxWidth: 620,
    },
    actionTile: {
        flex: 1,
        minHeight: 112,
        borderRadius: AppRadii.md,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 10,
    },
    actionIconWrap: {
        width: 38,
        height: 38,
        borderRadius: AppRadii.pill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionLabel: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '900',
        textAlign: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        marginTop: 2,
    },
    sectionTitle: {
        ...AppTypography.cardTitle,
    },
    inlineLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    inlineLinkText: {
        ...AppTypography.caption,
    },
    featureGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    featureGridWide: {
        maxWidth: 720,
    },
    featureCard: {
        flex: 1,
        minHeight: 174,
        borderRadius: AppRadii.lg,
        overflow: 'hidden',
    },
    featureImageWrap: {
        flex: 1,
    },
    featureImage: {
        borderRadius: AppRadii.lg,
    },
    featureOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(8, 28, 42, 0.54)',
    },
    featureBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        minWidth: 44,
        height: 44,
        borderRadius: AppRadii.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 8,
    },
    featureBadgeText: {
        color: '#244F78',
        fontSize: 13,
        lineHeight: 16,
        fontWeight: '900',
    },
    featureBadgeLabel: {
        color: '#607083',
        fontSize: 8,
        lineHeight: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    featureCopy: {
        flex: 1,
        justifyContent: 'flex-end',
        gap: 4,
        padding: 14,
    },
    featureTitle: {
        color: '#FFFFFF',
        fontSize: 17,
        lineHeight: 21,
        fontWeight: '900',
    },
    featureMeta: {
        color: 'rgba(255,255,255,0.74)',
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '800',
    },
    serviceStack: {
        flex: 1,
        gap: 10,
    },
    smallServiceCard: {
        minHeight: 52,
        borderWidth: 1,
        borderRadius: AppRadii.md,
        padding: 9,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    smallServiceIcon: {
        width: 34,
        height: 34,
        borderRadius: AppRadii.pill,
        overflow: 'hidden',
    },
    smallServiceImage: {
        width: '100%',
        height: '100%',
    },
    smallServiceCopy: {
        flex: 1,
        gap: 2,
        minWidth: 0,
    },
    smallServiceTitle: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '900',
    },
    smallServiceMeta: {
        fontSize: 10,
        lineHeight: 13,
        fontWeight: '700',
    },
    lowerGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    lowerGridWide: {
        maxWidth: 720,
    },
    infoPanel: {
        flex: 1,
        minHeight: 170,
        borderWidth: 1,
        borderRadius: AppRadii.lg,
        padding: 12,
        gap: 12,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    infoTitle: {
        ...AppTypography.cardTitle,
    },
    infoKicker: {
        fontSize: 10,
        lineHeight: 14,
        fontWeight: '800',
        marginTop: 2,
    },
    certList: {
        gap: 8,
    },
    certRow: {
        minHeight: 52,
        borderWidth: 1,
        borderRadius: AppRadii.sm,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    certRowImage: {
        width: 34,
        height: 34,
        borderRadius: AppRadii.xs,
    },
    certRowCopy: {
        flex: 1,
        minWidth: 0,
        gap: 1,
    },
    certRowTitle: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '900',
    },
    certRowSubtitle: {
        fontSize: 10,
        lineHeight: 13,
        fontWeight: '700',
    },
    contactStack: {
        flex: 1,
        gap: 10,
    },
    contactCard: {
        minHeight: 66,
        borderWidth: 1,
        borderRadius: AppRadii.md,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    contactIcon: {
        width: 34,
        height: 34,
        borderRadius: AppRadii.pill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactCopy: {
        flex: 1,
        gap: 2,
        minWidth: 0,
    },
    contactTitle: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '900',
    },
    contactMeta: {
        fontSize: 10,
        lineHeight: 13,
        fontWeight: '700',
    },
    pressed: {
        opacity: 0.9,
    },
});
