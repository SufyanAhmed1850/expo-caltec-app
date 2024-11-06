import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@constants/Colors';

const StatusPill = ({ status }) => {
    const getStatusStyle = () => {
        switch (status) {
            case 'Approved':
                return { backgroundColor: '#33D69F1F', color: '#33D69F' };
            case 'Pending':
                return { backgroundColor: '#FF8F001F', color: '#FF8F00' };
            case 'Declined':
                return { backgroundColor: '#4444440D', color: '#444444' };
            default:
                return { backgroundColor: '#FF8F001F', color: '#FF8F00' };
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
                {status}
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
