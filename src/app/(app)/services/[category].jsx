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
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { TouchableRipple, Menu, Modal, Portal } from 'react-native-paper';
import Toast from 'react-native-toast-message';

export default function CategoryServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
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

    const handleLongPress = (service, event) => {
        if (user && user.role === 'admin') {
            const { nativeEvent } = event;
            setSelectedService(service);
            setMenuPosition({ x: nativeEvent.pageX, y: nativeEvent.pageY });
            setMenuVisible(true);
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
                setMenuVisible(false);
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
        setMenuVisible(false);
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
        <TouchableRipple
            style={styles.serviceItem}
            onLongPress={(event) => handleLongPress(item, event)}
            rippleColor={Colors.light.blackOpacity20}
            borderless
        >
            <View style={styles.serviceContent}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.servicePrice}>
                    {item.price.toLocaleString()} {item.currency || 'PKR'}
                </Text>
            </View>
        </TouchableRipple>
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

            <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={menuPosition}
                contentStyle={{ backgroundColor: Colors.light.background }}
            >
                <Menu.Item
                    onPress={handleEdit}
                    title='Edit'
                    leadingIcon='pencil'
                    titleStyle={{ color: Colors.light.text }}
                />
                <Menu.Item
                    onPress={handleDelete}
                    title='Delete'
                    leadingIcon='delete'
                    titleStyle={{ color: Colors.light.red90 }}
                />
            </Menu>

            <Portal>
                <Modal
                    visible={isEditModalVisible}
                    onDismiss={() => setIsEditModalVisible(false)}
                    contentContainerStyle={[
                        styles.modalContent,
                        { backgroundColor: Colors.light.background },
                    ]}
                >
                    <Text
                        style={[
                            styles.modalTitle,
                            { color: Colors.light.text },
                        ]}
                    >
                        Edit Service
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: Colors.light.cardBg,
                                color: Colors.light.text,
                            },
                        ]}
                        placeholder='Service Name'
                        placeholderTextColor={Colors.light.black30}
                        value={editedService.name}
                        onChangeText={(text) =>
                            setEditedService({
                                ...editedService,
                                name: text,
                            })
                        }
                    />
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: Colors.light.cardBg,
                                color: Colors.light.text,
                            },
                        ]}
                        placeholder='Service Price'
                        placeholderTextColor={Colors.light.black30}
                        value={editedService.price}
                        onChangeText={(text) =>
                            setEditedService({
                                ...editedService,
                                price: text,
                            })
                        }
                        keyboardType='numeric'
                    />
                    <TouchableRipple
                        style={[
                            styles.updateButton,
                            { backgroundColor: Colors.light.red90 },
                        ]}
                        onPress={handleUpdateService}
                        disabled={updating}
                        rippleColor={Colors.light.whiteOpacity35}
                        borderless
                    >
                        <Text
                            style={[
                                styles.updateButtonText,
                                { color: Colors.light.background },
                            ]}
                        >
                            {updating ? 'Updating...' : 'Update Service'}
                        </Text>
                    </TouchableRipple>
                </Modal>
            </Portal>

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
        backgroundColor: Colors.light.cardBg,
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
        color: Colors.light.text,
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
    modalContent: {
        borderRadius: 20,
        padding: 20,
        margin: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: Colors.light.text,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.light.black30,
        borderRadius: 99,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginBottom: 15,
    },
    updateButton: {
        marginTop: 10,
        paddingVertical: 14,
        borderRadius: 99,
        alignItems: 'center',
    },
    updateButtonText: {
        fontWeight: 'bold',
    },
});
