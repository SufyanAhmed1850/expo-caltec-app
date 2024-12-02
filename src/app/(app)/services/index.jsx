import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Modal,
    TextInput,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@constants/Colors';
import { useAuth } from '@/src/context/authContext';
import { useService } from '@/src/context/serviceContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { TouchableRipple, AnimatedFAB } from 'react-native-paper';

export default function ServicesPage() {
    const [modalVisible, setModalVisible] = useState(false);
    const [newService, setNewService] = useState({
        category: '',
        name: '',
        price: '',
    });
    const [refreshing, setRefreshing] = useState(false);
    const [isExtended, setIsExtended] = useState(true);
    const { user } = useAuth();
    const { categories, loading, fetchServices, addService } = useService();
    const router = useRouter();

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchServices();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to refresh services',
            });
        } finally {
            setRefreshing(false);
        }
    }, [fetchServices]);

    const handleAddService = async () => {
        const success = await addService(newService);
        if (success) {
            setModalVisible(false);
            setNewService({ category: '', name: '', price: '' });
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Service added successfully',
            });
        }
    };

    const renderCategoryItem = ({ item }) => (
        <TouchableRipple
            style={styles.categoryItem}
            onPress={() => router.push(`/services/${item.name}`)}
            rippleColor={Colors.light.blackOpacity20}
            borderless={true}
        >
            <View style={styles.categoryContent}>
                <View>
                    <Text style={styles.categoryName}>{item.name}</Text>
                    <Text style={styles.categoryCount}>
                        {item.servicesCount} services
                    </Text>
                </View>
                <Ionicons
                    name='chevron-forward'
                    size={24}
                    color={Colors.light.red60}
                />
            </View>
        </TouchableRipple>
    );

    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
        setIsExtended(currentScrollPosition <= 0);
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color={Colors.light.red90} />
            </View>
        );
    }

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
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[Colors.light.red90]}
                        />
                    }
                    onScroll={onScroll}
                    ListEmptyComponent={
                        <Text style={styles.emptyListText}>
                            No services available
                        </Text>
                    }
                />
                {user && user.role === 'admin' && (
                    <AnimatedFAB
                        icon={'plus'}
                        label={'Add Service'}
                        extended={isExtended}
                        onPress={() => setModalVisible(true)}
                        visible={true}
                        animateFrom={'right'}
                        iconMode={'dynamic'}
                        style={[styles.fab]}
                        color={Colors.light.background}
                        rippleColor={Colors.light.whiteOpacity35}
                    />
                )}
            </View>

            <Modal
                animationType='fade'
                transparent={true}
                statusBarTranslucent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Service</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Service Category'
                            value={newService.category}
                            onChangeText={(text) =>
                                setNewService({ ...newService, category: text })
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Service Name'
                            value={newService.name}
                            onChangeText={(text) =>
                                setNewService({ ...newService, name: text })
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Service Price'
                            value={newService.price}
                            onChangeText={(text) =>
                                setNewService({ ...newService, price: text })
                            }
                            keyboardType='numeric'
                        />
                        <TouchableRipple
                            style={styles.addButton}
                            onPress={handleAddService}
                            disabled={loading}
                            rippleColor={Colors.light.whiteOpacity35}
                            borderless={true}
                        >
                            {loading ? (
                                <ActivityIndicator color='white' />
                            ) : (
                                <Text style={styles.addButtonText}>
                                    Save Service
                                </Text>
                            )}
                        </TouchableRipple>
                        <TouchableRipple
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                            rippleColor={Colors.light.blackOpacity20}
                            borderless={true}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableRipple>
                    </View>
                </View>
            </Modal>
            <Toast />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    container: {
        flex: 1,
        paddingBottom: 44,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        marginBottom: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    listContainer: {
        flexGrow: 1,
    },
    categoryItem: {
        backgroundColor: Colors.light.cardBg,
        borderRadius: 16,
        marginBottom: 12,
    },
    categoryContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    categoryCount: {
        fontSize: 14,
        color: Colors.light.red60,
        marginTop: 4,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.light.red90,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: Colors.light.black30,
        borderRadius: 99,
        paddingVertical: 10,
        paddingHorizontal: 14,
        color: Colors.light.text,
        marginBottom: 15,
    },
    addButton: {
        marginTop: 10,
        paddingVertical: 14,
        backgroundColor: Colors.light.red90,
        borderRadius: 99,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 10,
        paddingVertical: 14,
        backgroundColor: Colors.light.cardBg,
        borderRadius: 99,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: Colors.light.red90,
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: Colors.light.black60,
    },
});
