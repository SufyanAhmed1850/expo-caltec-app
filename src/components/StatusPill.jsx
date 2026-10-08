import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { getAppPalette } from '@constants/appTheme';

const StatusPill = ({ status = 'Pending', colors = getAppPalette('light') }) => {
    const getStatusStyle = () => {
        switch (status) {
            case 'Approved':
                return {
                    backgroundColor: colors.isDark ? '#173227' : '#EAF8F1',
                    color: colors.success,
                };
            case 'Pending':
                return {
                    backgroundColor: colors.isDark ? '#352915' : '#FFF5E6',
                    color: colors.warning,
                };
            case 'Declined':
                return {
                    backgroundColor: colors.isDark ? '#351D27' : '#FFF0F3',
                    color: colors.danger,
                };
            default:
                return {
                    backgroundColor: colors.cardSoft,
                    color: colors.secondary,
                };
        }
    };

    return (
        <View
            style={[
                styles.statusBadge,
                { backgroundColor: getStatusStyle().backgroundColor },
            ]}
        >
            <Text
                style={[styles.statusText, { color: getStatusStyle().color }]}
            >
                {status || 'Pending'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 99,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default StatusPill;
