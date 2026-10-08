import React, { useMemo, useState } from 'react';
import {
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';

import { CERTIFICATIONS } from '@constants/homeData';
import { IconSolarShieldCheck } from '@constants/SvgIcons';
import { AppRadii, AppTypography } from '@constants/appTheme';

const CertifiedSection = ({ colors }) => {
    const { width } = useWindowDimensions();
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const isTablet = width >= 760;
    const cardWidth = useMemo(() => {
        if (width >= 1024) {
            return (width - 88) / 3;
        }

        if (width >= 760) {
            return (width - 76) / 2;
        }

        return width - 40;
    }, [width]);

    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <Text style={[styles.eyebrow, { color: colors.primary }]}>
                    Compliance
                </Text>
                <Text style={[styles.title, { color: colors.text }]}>
                    Certification-backed delivery
                </Text>
                <Text style={[styles.subtitle, { color: colors.muted }]}>
                    Tap any certificate to preview the full document and review the
                    standard covered by the quality system.
                </Text>
            </View>

            <View style={[styles.grid, isTablet && styles.gridTablet]}>
                {CERTIFICATIONS.map((item) => (
                    <Pressable
                        key={item.id}
                        accessibilityRole='button'
                        onPress={() => setSelectedCertificate(item)}
                        style={({ pressed }) => [
                            styles.card,
                            {
                                width: cardWidth,
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                            pressed && styles.pressed,
                        ]}
                    >
                        <View
                            style={[
                                styles.badgeWrap,
                                {
                                    backgroundColor: colors.isDark
                                        ? '#17243A'
                                        : '#EEF4FF',
                                },
                            ]}
                        >
                            <Image
                                source={item.badge}
                                style={styles.badge}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.cardCopy}>
                            <View style={styles.cardTitleRow}>
                                <Text style={[styles.cardTitle, { color: colors.text }]}>
                                    {item.title}
                                </Text>
                                <IconSolarShieldCheck
                                    width={18}
                                    height={18}
                                    pathStroke={colors.success}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.cardDescription,
                                    { color: colors.secondary },
                                ]}
                            >
                                {item.description}
                            </Text>
                        </View>
                    </Pressable>
                ))}
            </View>

            <Modal
                transparent
                visible={Boolean(selectedCertificate)}
                animationType='fade'
                onRequestClose={() => setSelectedCertificate(null)}
            >
                <Pressable
                    style={[styles.modalScrim, { backgroundColor: colors.overlay }]}
                    onPress={() => setSelectedCertificate(null)}
                >
                    <Pressable
                        style={[
                            styles.modalCard,
                            { backgroundColor: colors.card, borderColor: colors.border },
                        ]}
                        onPress={(event) => event.stopPropagation()}
                    >
                        <View style={styles.sheetHandle} />
                        {selectedCertificate && (
                            <>
                                <Text style={[styles.modalTitle, { color: colors.text }]}>
                                    {selectedCertificate.title}
                                </Text>
                                <Image
                                    source={selectedCertificate.certificateImage}
                                    style={styles.certificateImage}
                                    resizeMode='contain'
                                />
                            </>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>
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
    grid: {
        gap: 14,
    },
    gridTablet: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    card: {
        minHeight: 172,
        borderWidth: 1,
        borderRadius: AppRadii.sheet,
        padding: 18,
        gap: 18,
    },
    badgeWrap: {
        width: 76,
        height: 76,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
    },
    badge: {
        width: '100%',
        height: '100%',
    },
    cardCopy: {
        gap: 10,
    },
    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    cardTitle: {
        flex: 1,
        ...AppTypography.cardTitle,
    },
    cardDescription: {
        ...AppTypography.body,
    },
    modalScrim: {
        flex: 1,
        justifyContent: 'center',
        padding: 18,
    },
    modalCard: {
        borderWidth: 1,
        borderRadius: AppRadii.sheet,
        paddingHorizontal: 18,
        paddingTop: 12,
        paddingBottom: 20,
        gap: 12,
    },
    sheetHandle: {
        alignSelf: 'center',
        width: 52,
        height: 5,
        borderRadius: 999,
        backgroundColor: '#9AA5BE',
        opacity: 0.45,
    },
    modalTitle: {
        ...AppTypography.cardTitle,
        textAlign: 'center',
    },
    certificateImage: {
        width: '100%',
        height: 420,
    },
    pressed: {
        opacity: 0.92,
    },
});

export default CertifiedSection;
