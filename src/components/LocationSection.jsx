import React, { useCallback } from 'react';
import {
    Linking,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constants from 'expo-constants';
import MapView, { Callout, Marker } from 'react-native-maps';

import { CALTEC_OFFICE } from '@constants/homeData';
import {
    IconLocation,
    IconMail,
    IconPhone,
    IconSolarArrowRightAlt,
    IconSolarGlobal,
} from '@constants/SvgIcons';
import { AppRadii, AppTypography } from '@constants/appTheme';

const getSoftShadow = (colors) => {
    if (colors.isDark) {
        return {
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        };
    }

    return {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 1,
    };
};

const OfficeChip = ({ colors, icon: Icon, label }) => (
    <View
        style={[
            styles.chip,
            {
                backgroundColor: colors.cardSoft,
                borderColor: colors.border,
            },
        ]}
    >
        <Icon width={16} height={16} pathStroke={colors.primary} />
        <Text style={[styles.chipText, { color: colors.secondary }]} numberOfLines={1}>
            {label}
        </Text>
    </View>
);

const LocationSection = ({ colors, compact = false }) => {
    const hasNativeGoogleMapsKey = Boolean(
        Constants.expoConfig?.android?.config?.googleMaps?.apiKey
    );

    const openGoogleMaps = useCallback(async () => {
        try {
            const supported = await Linking.canOpenURL(CALTEC_OFFICE.googleMapsUrl);
            if (supported) {
                await Linking.openURL(CALTEC_OFFICE.googleMapsUrl);
            }
        } catch (error) {
            console.error('Failed to open Google Maps:', error);
        }
    }, []);

    return (
        <View style={styles.section}>
            <View
                style={[
                    styles.infoCard,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    },
                    getSoftShadow(colors),
                ]}
            >
                <View style={styles.cardHeader}>
                    <View
                        style={[
                            styles.officeIcon,
                            {
                                backgroundColor: colors.isDark
                                    ? '#17243A'
                                    : '#EEF4FF',
                            },
                        ]}
                    >
                        <IconLocation
                            width={22}
                            height={22}
                            pathStroke={colors.primary}
                        />
                    </View>
                    <View style={styles.headerCopy}>
                        <Text style={[styles.eyebrow, { color: colors.primary }]}>
                            Location
                        </Text>
                        <Text style={[styles.title, { color: colors.text }]}>
                            Karachi office
                        </Text>
                    </View>
                </View>

                <Text style={[styles.address, { color: colors.text }]}>
                    {CALTEC_OFFICE.address}
                </Text>

                <View style={styles.chipGrid}>
                    <OfficeChip
                        colors={colors}
                        icon={IconPhone}
                        label='+92 333 2283557'
                    />
                    <OfficeChip
                        colors={colors}
                        icon={IconMail}
                        label='info@caltec.com.pk'
                    />
                    <OfficeChip
                        colors={colors}
                        icon={IconSolarGlobal}
                        label='caltec.com.pk'
                    />
                </View>

                <Pressable
                    accessibilityRole='button'
                    onPress={openGoogleMaps}
                    style={({ pressed }) => [
                        styles.directionsButton,
                        { backgroundColor: colors.primary },
                        pressed && styles.pressed,
                    ]}
                >
                    <Text style={[styles.directionsText, { color: colors.white }]}>
                        Open directions
                    </Text>
                    <IconSolarArrowRightAlt
                        width={16}
                        height={16}
                        pathStroke={colors.white}
                    />
                </Pressable>
            </View>

            {!compact && (
                <View
                    style={[
                        styles.mapCard,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    {hasNativeGoogleMapsKey ? (
                        <MapView
                            style={styles.map}
                            initialRegion={CALTEC_OFFICE}
                            pitchEnabled={false}
                            rotateEnabled={false}
                            toolbarEnabled={Platform.OS === 'android'}
                            showsCompass={false}
                            loadingEnabled
                        >
                            <Marker
                                coordinate={{
                                    latitude: CALTEC_OFFICE.latitude,
                                    longitude: CALTEC_OFFICE.longitude,
                                }}
                                title={CALTEC_OFFICE.title}
                                description='Tap for Google Maps directions'
                            >
                                <Callout onPress={openGoogleMaps}>
                                    <View style={styles.callout}>
                                        <Text style={styles.calloutTitle}>
                                            {CALTEC_OFFICE.title}
                                        </Text>
                                        <Text style={styles.calloutCopy}>
                                            Open in Google Maps
                                        </Text>
                                    </View>
                                </Callout>
                            </Marker>
                        </MapView>
                    ) : (
                        <View style={styles.mapFallback}>
                            <Text
                                style={[
                                    styles.mapFallbackTitle,
                                    { color: colors.text },
                                ]}
                            >
                                Map preview unavailable
                            </Text>
                            <Text
                                style={[
                                    styles.mapFallbackCopy,
                                    { color: colors.muted },
                                ]}
                            >
                                Add the Android Google Maps API key and rebuild the
                                development client to enable the embedded map.
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        gap: 14,
    },
    infoCard: {
        gap: 14,
        borderWidth: 1,
        borderRadius: AppRadii.xl,
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    officeIcon: {
        width: 48,
        height: 48,
        borderRadius: AppRadii.pill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCopy: {
        flex: 1,
        gap: 3,
    },
    eyebrow: {
        ...AppTypography.eyebrow,
    },
    title: {
        ...AppTypography.cardTitle,
    },
    address: {
        ...AppTypography.body,
        fontWeight: '700',
    },
    chipGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        minHeight: 38,
        maxWidth: '100%',
        borderWidth: 1,
        borderRadius: AppRadii.pill,
        paddingHorizontal: 11,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    chipText: {
        ...AppTypography.caption,
        flexShrink: 1,
    },
    directionsButton: {
        minHeight: 44,
        borderRadius: AppRadii.pill,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    directionsText: {
        ...AppTypography.caption,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    mapCard: {
        overflow: 'hidden',
        borderWidth: 1,
        borderRadius: AppRadii.xl,
        minHeight: 280,
    },
    map: {
        width: '100%',
        height: 320,
    },
    mapFallback: {
        minHeight: 220,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 24,
    },
    mapFallbackTitle: {
        ...AppTypography.cardTitle,
        textAlign: 'center',
    },
    mapFallbackCopy: {
        ...AppTypography.body,
        textAlign: 'center',
    },
    callout: {
        width: 170,
        paddingVertical: 2,
    },
    calloutTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#10131A',
    },
    calloutCopy: {
        marginTop: 4,
        fontSize: 12,
        color: '#596273',
    },
    pressed: {
        opacity: 0.9,
    },
});

export default LocationSection;
