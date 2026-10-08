import React, { useCallback } from 'react';
import {
    Alert,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

import LocationSection from '@/src/components/LocationSection';
import { useAuth } from '@context/authContext';
import {
    AppRadii,
    AppSpacing,
    AppTypography,
    getAppPalette,
    resolveThemePreference,
} from '@constants/appTheme';
import {
    IconLocation,
    IconMail,
    IconPhone,
    IconProfile,
    IconSolarArrowRightAlt,
    IconSolarChatRound,
    IconSolarDocumentText,
    IconSolarFax,
    IconSolarGlobal,
    IconSolarMailbox,
    IconSolarSmartphone,
} from '@constants/SvgIcons';
import { CALTEC_OFFICE, CONTACT_ACTIONS } from '@constants/homeData';

const primaryContactIds = ['mobile', 'email', 'website'];
const officeDetailIds = ['founder', 'address', 'postal', 'fax', 'landline', 'whatsapp'];

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

const getIcon = (item, colors) => {
    const props = {
        width: 19,
        height: 19,
        pathStroke: colors.primary,
    };

    switch (item.id) {
        case 'mobile':
            return <IconSolarSmartphone {...props} />;
        case 'fax':
            return <IconSolarFax {...props} />;
        case 'whatsapp':
            return <IconSolarChatRound {...props} />;
        case 'postal':
            return <IconSolarMailbox {...props} />;
        case 'landline':
            return <IconPhone {...props} />;
        default:
            break;
    }

    switch (item.icon) {
        case 'profile':
            return <IconProfile {...props} />;
        case 'location':
            return <IconLocation {...props} />;
        case 'mail':
            return <IconMail {...props} />;
        case 'global':
            return <IconSolarGlobal {...props} />;
        case 'document':
            return <IconSolarDocumentText {...props} />;
        case 'phone':
        default:
            return <IconPhone {...props} />;
    }
};

const Section = ({ children, colors }) => (
    <View
        style={[
            styles.section,
            {
                backgroundColor: colors.card,
                borderColor: colors.border,
            },
            getSoftShadow(colors),
        ]}
    >
        {children}
    </View>
);

const ContactRow = ({ colors, item, onPress }) => {
    const isActionable = item.type !== 'static';

    return (
        <Pressable
            accessibilityRole={isActionable ? 'button' : undefined}
            onPress={isActionable ? () => onPress(item) : undefined}
            style={({ pressed }) => [
                styles.row,
                isActionable && pressed && styles.pressed,
            ]}
        >
            <View
                style={[
                    styles.rowIcon,
                    {
                        backgroundColor: colors.isDark ? '#202532' : '#F7F9FC',
                    },
                ]}
            >
                {getIcon(item, colors)}
            </View>
            <View style={styles.rowCopy}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>
                    {item.label}
                </Text>
                <Text
                    style={[styles.rowValue, { color: colors.muted }]}
                    numberOfLines={item.id === 'address' ? 3 : 1}
                >
                    {item.value}
                </Text>
            </View>
            {isActionable && (
                <IconSolarArrowRightAlt
                    width={17}
                    height={17}
                    pathStroke={colors.muted}
                />
            )}
        </Pressable>
    );
};

export default function Contact() {
    const { userProfile } = useAuth();
    const systemScheme = useColorScheme();
    const resolvedTheme = resolveThemePreference(
        userProfile?.themePreference || 'system',
        systemScheme
    );
    const colors = getAppPalette(resolvedTheme);

    const openExternal = useCallback(async (url, fallbackMessage) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (!supported) {
                Alert.alert('Unable to open', fallbackMessage);
                return;
            }

            await Linking.openURL(url);
        } catch (error) {
            console.error('Failed to open external link:', error);
            Alert.alert('Unable to open', fallbackMessage);
        }
    }, []);

    const handleAction = useCallback(
        (item) => {
            if (item.type === 'phone') {
                openExternal(`tel:${item.actionValue}`, 'Phone dialer is not available.');
                return;
            }

            if (item.type === 'email') {
                openExternal(
                    `mailto:${item.actionValue}`,
                    'Email client is not available.'
                );
                return;
            }

            if (item.type === 'website') {
                openExternal(item.actionValue, 'Website could not be opened.');
                return;
            }

            if (item.type === 'whatsapp') {
                openExternal(
                    `whatsapp://send?phone=${item.actionValue}`,
                    'WhatsApp is not available on this device.'
                );
                return;
            }

            if (item.type === 'maps') {
                openExternal(
                    CALTEC_OFFICE.googleMapsUrl,
                    'Maps could not be opened on this device.'
                );
            }
        },
        [openExternal]
    );

    const primaryContacts = CONTACT_ACTIONS.filter((item) =>
        primaryContactIds.includes(item.id)
    );
    const officeDetails = CONTACT_ACTIONS.filter((item) =>
        officeDetailIds.includes(item.id)
    );

    return (
        <ScrollView
            style={[styles.page, { backgroundColor: colors.page }]}
            contentContainerStyle={styles.content}
        >
            <View
                style={[
                    styles.summaryCard,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    },
                    getSoftShadow(colors),
                ]}
            >
                <View
                    style={[
                        styles.summaryIcon,
                        {
                            backgroundColor: colors.isDark
                                ? '#17243A'
                                : '#EEF4FF',
                        },
                    ]}
                >
                    <IconPhone width={22} height={22} pathStroke={colors.primary} />
                </View>
                <View style={styles.summaryCopy}>
                    <Text style={[styles.summaryTitle, { color: colors.text }]}>
                        Caltec support
                    </Text>
                    <Text style={[styles.summaryText, { color: colors.secondary }]}>
                        Reach the office, request help, or open directions from one place.
                    </Text>
                </View>
            </View>

            <View style={styles.group}>
                <Text style={[styles.groupTitle, { color: colors.primary }]}>
                    Primary contact
                </Text>
                <Section colors={colors}>
                    {primaryContacts.map((item, index) => (
                        <View key={item.id}>
                            {index > 0 && (
                                <View
                                    style={[
                                        styles.separator,
                                        { backgroundColor: colors.border },
                                    ]}
                                />
                            )}
                            <ContactRow
                                colors={colors}
                                item={item}
                                onPress={handleAction}
                            />
                        </View>
                    ))}
                </Section>
            </View>

            <View style={styles.group}>
                <Text style={[styles.groupTitle, { color: colors.primary }]}>
                    Office directory
                </Text>
                <Section colors={colors}>
                    {officeDetails.map((item, index) => (
                        <View key={item.id}>
                            {index > 0 && (
                                <View
                                    style={[
                                        styles.separator,
                                        { backgroundColor: colors.border },
                                    ]}
                                />
                            )}
                            <ContactRow
                                colors={colors}
                                item={item}
                                onPress={handleAction}
                            />
                        </View>
                    ))}
                </Section>
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
        gap: AppSpacing.sectionGap,
        paddingHorizontal: AppSpacing.screenX,
        paddingTop: AppSpacing.screenTop,
        paddingBottom: 24,
    },
    summaryCard: {
        minHeight: 104,
        borderWidth: 1,
        borderRadius: AppRadii.xl,
        padding: AppSpacing.card,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    summaryIcon: {
        width: 54,
        height: 54,
        borderRadius: AppRadii.pill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryCopy: {
        flex: 1,
        gap: 5,
    },
    summaryTitle: {
        ...AppTypography.cardTitle,
    },
    summaryText: {
        ...AppTypography.body,
    },
    group: {
        gap: 8,
    },
    groupTitle: {
        ...AppTypography.eyebrow,
        paddingHorizontal: 4,
    },
    section: {
        borderWidth: 1,
        borderRadius: AppRadii.xl,
        overflow: 'hidden',
    },
    row: {
        minHeight: 66,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    rowIcon: {
        width: 38,
        height: 38,
        borderRadius: AppRadii.pill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowCopy: {
        flex: 1,
        gap: 3,
        minWidth: 0,
    },
    rowLabel: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '900',
    },
    rowValue: {
        ...AppTypography.caption,
        fontWeight: '600',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginLeft: 64,
    },
    pressed: {
        opacity: 0.82,
    },
});
