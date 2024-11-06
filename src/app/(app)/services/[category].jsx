import { useAuth } from '@/src/context/authContext';
import { useService } from '@/src/context/serviceContext';
import { Colors } from '@constants/Colors';
import { IconDelete, IconEdit } from '@constants/SvgIcons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function CategoryServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editedService, setEditedService] = useState({ name: '', price: '' });
    const { category } = useLocalSearchParams();
    const { getServicesByCategory, deleteService, updateService } =
        useService();
    const { user } = useAuth();

    useEffect(() => {
        fetchCategoryServices();
    }, [category]);

    const fetchCategoryServices = async () => {
        setLoading(true);
        try {
            const categoryServices = await getServicesByCategory(category);
            setServices(categoryServices);
        } catch (error) {
            console.error('Error fetching category services:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to fetch services',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLongPress = (service) => {
        if (user && user.role === 'admin') {
            setSelectedService(service);
            setIsMenuVisible(true);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Service',
            'Are you sure you want to delete this service?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: confirmDelete,
                },
            ]
        );
    };

    const confirmDelete = async () => {
        if (selectedService) {
            try {
                await deleteService(selectedService.id);
                fetchCategoryServices();
                setIsMenuVisible(false);
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Service deleted successfully',
                });
            } catch (error) {
                console.error('Error deleting service:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to delete service',
                });
            }
        }
    };

    const handleEdit = () => {
        setEditedService({
            name: selectedService.name,
            price: selectedService.price.toString(),
        });
        setIsEditModalVisible(true);
        setIsMenuVisible(false);
    };

    const handleUpdateService = async () => {
        if (selectedService) {
            setUpdating(true);
            try {
                await updateService(selectedService.id, {
                    ...selectedService,
                    name: editedService.name,
                    price: parseFloat(editedService.price),
                });
                await fetchCategoryServices();
                setIsEditModalVisible(false);
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Service updated successfully',
                });
            } catch (error) {
                console.error('Error updating service:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to update service',
                });
            } finally {
                setUpdating(false);
            }
        }
    };

    const renderServiceItem = ({ item }) => (
        <TouchableOpacity
            style={styles.serviceItem}
            onLongPress={() => handleLongPress(item)}
        >
            <View style={styles.serviceContent}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.servicePrice}>
                    {item.price.toLocaleString()} {item.currency || 'PKR'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color={Colors.light.red90} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>{category}</Text>
                <FlatList
                    data={services}
                    renderItem={renderServiceItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={styles.emptyListText}>
                            No services available for this category
                        </Text>
                    }
                />
            </View>

            {/* Admin Menu Modal */}
            <Modal
                animationType='fade'
                transparent={true}
                statusBarTranslucent={true}
                visible={isMenuVisible}
                onRequestClose={() => setIsMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setIsMenuVisible(false)}
                >
                    <View style={styles.menuContainer}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={handleEdit}
                        >
                            <IconEdit pathStroke={Colors.light.blue90} />
                            <Text style={styles.menuText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={handleDelete}
                        >
                            <IconDelete pathStroke={Colors.light.red90} />
                            <Text style={styles.menuText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Edit Service Modal */}
            <Modal
                animationType='fade'
                transparent={true}
                statusBarTranslucent={true}
                visible={isEditModalVisible}
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Service</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Service Name'
                            value={editedService.name}
                            onChangeText={(text) =>
                                setEditedService({
                                    ...editedService,
                                    name: text,
                                })
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Service Price'
                            value={editedService.price}
                            onChangeText={(text) =>
                                setEditedService({
                                    ...editedService,
                                    price: text,
                                })
                            }
                            keyboardType='numeric'
                        />
                        <TouchableOpacity
                            style={styles.updateButton}
                            onPress={handleUpdateService}
                            disabled={updating}
                        >
                            {updating ? (
                                <ActivityIndicator color='white' />
                            ) : (
                                <Text style={styles.updateButtonText}>
                                    Update Service
                                </Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setIsEditModalVisible(false)}
                            disabled={updating}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
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
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    serviceItem: {
        backgroundColor: '#F5F5F5',
        borderRadius: 99,
        paddingVertical: 16,
        paddingHorizontal: 22,
    },
    serviceContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    serviceName: {
        maxWidth: '75%',
        fontSize: 16,
        color: Colors.light.black60,
    },
    servicePrice: {
        fontSize: 14,
        color: Colors.light.red60,
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: Colors.light.black60,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        minWidth: 200,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    menuText: {
        marginLeft: 10,
        fontSize: 16,
        color: Colors.light.text,
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
        color: Colors.light.text,
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
    updateButton: {
        backgroundColor: Colors.light.blue90,
        marginTop: 10,
        paddingVertical: 14,
        borderRadius: 99,
        alignItems: 'center',
    },
    updateButtonText: {
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
});
