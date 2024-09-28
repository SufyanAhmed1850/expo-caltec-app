import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Colors } from '@constants/Colors';
import instrumentsList from '@/data';
import { useLocalSearchParams } from 'expo-router';

export default function EquipmentListPage() {
    const [equipment, setEquipment] = useState([]);
    const { category } = useLocalSearchParams();

    useEffect(() => {
        const filteredEquipment = instrumentsList.filter(
            (item) => item.category === category
        );

        setEquipment(filteredEquipment);
    }, [category]);

    const renderEquipmentItem = ({ item }) => (
        <View style={styles.equipmentItem}>
            <View style={styles.equipmentContent}>
                <Text style={styles.equipmentName}>{item.name}</Text>
                <Text style={styles.equipmentPrice}>
                    {item.price.toLocaleString()} {item.currency}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>{category}</Text>
                <FlatList
                    data={equipment}
                    renderItem={renderEquipmentItem}
                    keyExtractor={(item) => item.name}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
    },
    title: {
        margin: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    listContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 100,
        gap: 12,
    },
    equipmentItem: {
        backgroundColor: '#F5F5F5',
        borderRadius: 99,
        paddingVertical: 16,
        paddingHorizontal: 22,
    },
    equipmentContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    equipmentName: {
        maxWidth: '75%',
        fontSize: 16,
        color: Colors.light.black60,
    },
    equipmentPrice: {
        fontSize: 14,
        color: Colors.light.red60,
    },
});
