import React from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';

import {
    IconServices,
    IconSolarArrowRightAlt,
    IconSolarBolt,
    IconSolarGauge,
    IconSolarMapPointWave,
    IconSolarRuler,
    IconSolarThermometer,
    IconSolarWaterdrop,
    IconSolarWidget,
} from '@constants/SvgIcons';
import { AppRadii, AppTypography } from '@constants/appTheme';

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

const CardSlider = ({ categories = [], colors, loading, onOpenCatalog, onOpenCategory }) => {
    const { width } = useWindowDimensions();
    const cardWidth = Math.min(Math.max(width - 68, 260), 308);
    const featuredCategories = [...categories]
        .sort(
            (left, right) =>
                Number(right?.servicesCount || 0) - Number(left?.servicesCount || 0)
        )
        .slice(0, 6);

    return (
        <View style={styles.section}>
            <View style={styles.headingRow}>
                <View style={styles.headingCopy}>
                    <Text style={[styles.eyebrow, { color: colors.primary }]}>
                        Live catalog
                    </Text>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Explore calibration categories
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.muted }]}>
                        Browse the active service catalog and move into pricing enquiries
                        without leaving the app.
                    </Text>
                </View>
                <Pressable
                    accessibilityRole='button'
                    onPress={onOpenCatalog}
                    style={({ pressed }) => [
                        styles.catalogLink,
                        { borderColor: colors.border, backgroundColor: colors.cardSoft },
                        pressed && styles.pressed,
                    ]}
                >
                    <Text style={[styles.catalogLinkText, { color: colors.text }]}>
                        Full catalog
                    </Text>
                    <IconSolarArrowRightAlt
                        width={16}
                        height={16}
                        pathStroke={colors.muted}
                    />
                </Pressable>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollerContent}
            >
                {featuredCategories.length === 0 ? (
                    <View
                        style={[
                            styles.emptyCard,
                            {
                                width: cardWidth,
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>
                            Catalog is loading
                        </Text>
                        <Text style={[styles.emptyCopy, { color: colors.secondary }]}>
                            Pull to refresh or open the full services screen once the
                            connection is ready.
                        </Text>
                    </View>
                ) : (
                    featuredCategories.map((category) => {
                        const meta = getCategoryIconMeta(category?.name, colors);

                        return (
                            <Pressable
                                key={category.name}
                                accessibilityRole='button'
                                onPress={() => onOpenCategory(category.name)}
                                style={({ pressed }) => [
                                    styles.categoryCard,
                                    {
                                        width: cardWidth,
                                        backgroundColor: colors.card,
                                        borderColor: colors.border,
                                    },
                                    pressed && styles.pressed,
                                ]}
                            >
                                <View style={styles.categoryHeader}>
                                    <View
                                        style={[
                                            styles.categoryIconWrap,
                                            { backgroundColor: meta.background },
                                        ]}
                                    >
                                        <meta.Icon
                                            width={22}
                                            height={22}
                                            pathStroke={meta.color}
                                            secondaryStroke={colors.card}
                                        />
                                    </View>
                                    <View style={styles.categoryHeaderCopy}>
                                        <Text
                                            style={[
                                                styles.categoryTitle,
                                                { color: colors.text },
                                            ]}
                                        >
                                            {category.name}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.categoryMeta,
                                                { color: colors.muted },
                                            ]}
                                        >
                                            {Number(category.servicesCount || 0)} services
                                        </Text>
                                    </View>
                                    <IconSolarArrowRightAlt
                                        width={18}
                                        height={18}
                                        pathStroke={colors.muted}
                                    />
                                </View>
                                <Text
                                    style={[
                                        styles.categoryDescription,
                                        { color: colors.secondary },
                                    ]}
                                >
                                    {loading
                                        ? 'Refreshing catalog details...'
                                        : 'Open this category to review available services and rate cards.'}
                                </Text>
                            </Pressable>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        gap: 18,
    },
    headingRow: {
        gap: 16,
    },
    headingCopy: {
        gap: 8,
    },
    eyebrow: {
        ...AppTypography.eyebrow,
    },
    title: {
        ...AppTypography.sectionTitle,
    },
    subtitle: {
        ...AppTypography.body,
    },
    catalogLink: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    catalogLinkText: {
        fontSize: 13,
        fontWeight: '700',
    },
    scrollerContent: {
        gap: 14,
        paddingRight: 20,
    },
    categoryCard: {
        minHeight: 158,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: AppRadii.sheet,
        padding: 20,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    categoryIconWrap: {
        width: 52,
        height: 52,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryHeaderCopy: {
        flex: 1,
        gap: 4,
    },
    categoryTitle: {
        ...AppTypography.cardTitle,
    },
    categoryMeta: {
        ...AppTypography.caption,
        fontWeight: '600',
    },
    categoryDescription: {
        ...AppTypography.body,
    },
    emptyCard: {
        minHeight: 158,
        justifyContent: 'center',
        gap: 10,
        borderWidth: 1,
        borderRadius: AppRadii.sheet,
        padding: 20,
    },
    emptyTitle: {
        ...AppTypography.cardTitle,
    },
    emptyCopy: {
        ...AppTypography.body,
    },
    pressed: {
        opacity: 0.9,
    },
});

export default CardSlider;
