import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Animated,
} from 'react-native';
import { Colors } from '@constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import instrumentsList from '@/data';
import { router } from 'expo-router';
import { IconArrowRight } from '@constants/SvgIcons';

export default function ServicesPage() {
    const [categories, setCategories] = useState([]);
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        const categoryCounts = instrumentsList.reduce((acc, instrument) => {
            acc[instrument.category] = (acc[instrument.category] || 0) + 1;
            return acc;
        }, {});

        const categoryData = Object.entries(categoryCounts).map(
            ([name, count]) => ({
                name,
                count,
                scale: new Animated.Value(1),
            })
        );

        setCategories(categoryData);
    }, []);

    const handlePressIn = (scale) => {
        Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = (scale) => {
        Animated.spring(scale, {
            toValue: 1,
            friction: 3,
            tension: 32,
            useNativeDriver: true,
        }).start();
    };

    const navigateToCategory = useCallback(
        (category) => {
            if (!isNavigating) {
                setIsNavigating(true);
                router.push({
                    pathname: '/services/[category]',
                    params: { category: category },
                });
                setTimeout(() => setIsNavigating(false), 500); // Reset after 1 second
            }
        },
        [isNavigating]
    );

    const renderCategoryItem = ({ item, index }) => (
        <TouchableOpacity
            activeOpacity={1}
            onPressIn={() => handlePressIn(item.scale)}
            onPressOut={() => handlePressOut(item.scale)}
            onPress={() => navigateToCategory(item.name)}
            disabled={isNavigating}
        >
            <Animated.View
                style={[
                    styles.categoryItem,
                    { transform: [{ scale: item.scale }] },
                    isNavigating && styles.categoryItemDisabled,
                ]}
            >
                <View style={styles.categoryContent}>
                    <View>
                        <Text style={styles.categoryName}>{item.name}</Text>
                        <Text style={styles.categoryCount}>
                            {item.count} services
                        </Text>
                    </View>
                    <IconArrowRight size={24} pathStroke={Colors.light.red60} />
                </View>
            </Animated.View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Our Services</Text>
                <FlatList
                    data={categories}
                    renderItem={renderCategoryItem}
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
        backgroundColor: '#FFF',
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
    categoryItem: {
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 18,
    },
    categoryItemDisabled: {
        opacity: 0.5,
    },
    categoryContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 4,
    },
    categoryCount: {
        fontSize: 14,
        color: Colors.light.red60,
    },
});
