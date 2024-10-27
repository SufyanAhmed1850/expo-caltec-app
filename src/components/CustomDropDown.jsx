import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    StyleSheet,
    Modal,
    SafeAreaView,
    TouchableWithoutFeedback,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Colors } from '@constants/Colors';
import { IconSearch } from '@constants/SvgIcons';
import { useEnquiry } from '@/src/context/enquiryContext';

export const CustomDropDown = ({
    onSelect,
    placeholder = 'Select Instrument',
}) => {
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedInstrument, setSelectedInstrument] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const searchRef = useRef();
    const { services, loading, fetchServices } = useEnquiry();

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    useEffect(() => {
        setFilteredData(services);
    }, [services]);

    const onSearch = (search) => {
        if (search !== '') {
            let tempData = services.filter((item) => {
                return (
                    item.name.toLowerCase().indexOf(search.toLowerCase()) > -1
                );
            });
            setFilteredData(tempData);
        } else {
            setFilteredData(services);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        onSearch('');
        setSearch('');
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchServices();
        setRefreshing(false);
    }, [fetchServices]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => {
                setSelectedInstrument(item.name);
                onSelect(item.name);
                closeModal();
            }}
        >
            <Text style={styles.itemText}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderEmptyList = () => (
        <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>
                No matching instruments found
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.dropdownButtonText}>
                    {selectedInstrument || placeholder}
                </Text>
            </TouchableOpacity>
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
                statusBarTranslucent={true}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <SafeAreaView style={styles.modalContainer}>
                                <View style={styles.dropdownList}>
                                    <View style={styles.searchInputContainer}>
                                        <IconSearch
                                            width={18}
                                            style={styles.searchIcon}
                                        />
                                        <TextInput
                                            placeholder='Search...'
                                            value={search}
                                            ref={searchRef}
                                            onChangeText={(txt) => {
                                                onSearch(txt);
                                                setSearch(txt);
                                            }}
                                            style={styles.searchInput}
                                            placeholderTextColor={
                                                Colors.light.black30
                                            }
                                        />
                                    </View>
                                    {loading && !refreshing ? (
                                        <ActivityIndicator
                                            size='large'
                                            color={Colors.light.red90}
                                        />
                                    ) : (
                                        <FlatList
                                            data={filteredData}
                                            renderItem={renderItem}
                                            keyExtractor={(item) => item.id}
                                            ListEmptyComponent={renderEmptyList}
                                            refreshControl={
                                                <RefreshControl
                                                    refreshing={refreshing}
                                                    onRefresh={onRefresh}
                                                    colors={[
                                                        Colors.light.red90,
                                                    ]}
                                                />
                                            }
                                        />
                                    )}
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={closeModal}
                                    >
                                        <Text style={styles.closeButtonText}>
                                            Close
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </SafeAreaView>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 2,
    },
    dropdownButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: Colors.light.black30,
        borderRadius: 99,
        paddingVertical: 10,
        paddingHorizontal: 14,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    dropdownButtonText: {
        color: Colors.light.text,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownList: {
        width: '90%',
        height: '100%',
        maxHeight: 580,
        backgroundColor: Colors.light.background,
        borderRadius: 34,
        borderWidth: 1,
        borderColor: Colors.light.black30,
        padding: 14,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        borderWidth: 1,
        borderColor: Colors.light.black30,
        borderRadius: 99,
        paddingVertical: 10,
        paddingHorizontal: 10,
        paddingRight: 14,
        marginBottom: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: Colors.light.text,
    },
    item: {
        paddingVertical: 18,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.black10,
    },
    itemText: {
        color: Colors.light.text,
    },
    closeButton: {
        marginTop: 10,
        paddingVertical: 14,
        backgroundColor: Colors.light.red90,
        borderRadius: 99,
        alignItems: 'center',
    },
    closeButtonText: {
        color: Colors.light.background,
        fontWeight: 'bold',
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    emptyListText: {
        color: Colors.light.black30,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default CustomDropDown;
