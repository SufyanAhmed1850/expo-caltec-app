import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';

import { TRUSTED_CLIENT_LOGOS } from '@constants/homeData';
import { AppRadii, AppTypography } from '@constants/appTheme';

const ImageSlider = ({ colors }) => {
    const { width } = useWindowDimensions();
    const cardWidth = Math.min(Math.max(width * 0.28, 104), 156);

    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <Text style={[styles.eyebrow, { color: colors.primary }]}>
                    Trusted by
                </Text>
                <Text style={[styles.title, { color: colors.text }]}>
                    Brands that rely on Caltec
                </Text>
                <Text style={[styles.subtitle, { color: colors.muted }]}>
                    The calibration program supports hospitals, textiles, pharmaceuticals,
                    manufacturing, and industrial operations across Pakistan.
                </Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.logoRail}
            >
                {TRUSTED_CLIENT_LOGOS.map((uri, index) => (
                    <View
                        key={`${uri}-${index}`}
                        style={[
                            styles.logoCard,
                            {
                                width: cardWidth,
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <Image
                            source={{ uri }}
                            style={styles.logo}
                            resizeMode='contain'
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        gap: 18,
    },
    header: {
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
    logoRail: {
        gap: 12,
        paddingRight: 20,
    },
    logoCard: {
        height: 92,
        borderWidth: 1,
        borderRadius: AppRadii.xl,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 18,
        paddingVertical: 14,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
});

export default ImageSlider;
