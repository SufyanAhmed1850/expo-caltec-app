import { Colors } from '@/src/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
    return (
        <View style={styles.container}>
            <Text>Home</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        padding: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.light.black30,
        borderRadius: 99,
        paddingVertical: 10,
        paddingHorizontal: 14,
        color: Colors.light.text,
        marginRight: 8,
    },
    statusPicker: {
        width: 120,
        height: 40,
    },
    enquiryItem: {
        backgroundColor: Colors.light.cardBg,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    enquiryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    enquiryNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    enquiryDate: {
        fontSize: 14,
        color: Colors.light.black60,
    },
    customerName: {
        fontSize: 16,
        color: Colors.light.black90,
        marginBottom: 8,
    },
    enquiryFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.red90,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 64,
    },
    emptyStateText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.light.black60,
    },
});
