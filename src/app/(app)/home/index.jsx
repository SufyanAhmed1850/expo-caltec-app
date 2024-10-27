import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    updateDoc,
    doc,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/src/context/authContext';
import { Colors } from '@/src/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function Home() {
    const [enquiries, setEnquiries] = useState([]);
    const [filteredEnquiries, setFilteredEnquiries] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const { user } = useAuth();
    const router = useRouter();

    const fetchEnquiries = useCallback(async () => {
        try {
            const enquiriesRef = collection(db, 'enquiries');
            let q = query(enquiriesRef, orderBy('timestamp', 'desc'));

            if (user?.role !== 'admin') {
                q = query(q, where('userId', '==', user?.uid));
            }

            const querySnapshot = await getDocs(q);
            const fetchedEnquiries = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setEnquiries(fetchedEnquiries);
            setFilteredEnquiries(fetchedEnquiries);
        } catch (error) {
            console.error('Error fetching enquiries:', error);
        }
    }, [user]);

    useEffect(() => {
        fetchEnquiries();
    }, [fetchEnquiries]);

    useEffect(() => {
        const filtered = enquiries.filter((enquiry) => {
            const matchesSearch = Object.values(enquiry).some((value) =>
                value
                    .toString()
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
            const matchesStatus =
                statusFilter === 'All' || enquiry.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
        setFilteredEnquiries(filtered);
    }, [searchQuery, statusFilter, enquiries]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchEnquiries();
        setRefreshing(false);
    }, [fetchEnquiries]);

    const updateEnquiryStatus = async (enquiryId, newStatus) => {
        try {
            const enquiryRef = doc(db, 'enquiries', enquiryId);
            await updateDoc(enquiryRef, { status: newStatus });
            await fetchEnquiries(); // Refresh the list after updating
        } catch (error) {
            console.error('Error updating enquiry status:', error);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.enquiryItem}
            onPress={() => router.push(`/home/${item.enquiryNumber}`)}
        >
            <View style={styles.enquiryHeader}>
                <Text style={styles.enquiryNumber}>{item.enquiryNumber}</Text>
                <Text style={styles.enquiryDate}>
                    {new Date(item.timestamp).toLocaleDateString()}
                </Text>
            </View>
            <Text style={styles.customerName}>{item.userName}</Text>
            <View style={styles.enquiryFooter}>
                <Text style={styles.amount}>
                    PKR {item.totalAmount.toLocaleString()}
                </Text>
                <View
                    style={[styles.statusBadge, styles[`status${item.status}`]]}
                >
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>
            {user?.role === 'admin' && (
                <View style={styles.adminControls}>
                    <TouchableOpacity
                        style={styles.statusButton}
                        onPress={() => updateEnquiryStatus(item.id, 'Approved')}
                    >
                        <Text style={styles.statusButtonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.statusButton}
                        onPress={() => updateEnquiryStatus(item.id, 'Declined')}
                    >
                        <Text style={styles.statusButtonText}>Decline</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder='Search enquiries...'
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Picker
                    selectedValue={statusFilter}
                    style={styles.statusPicker}
                    onValueChange={(itemValue) => setStatusFilter(itemValue)}
                >
                    <Picker.Item label='All' value='All' />
                    <Picker.Item label='Pending' value='Pending' />
                    <Picker.Item label='Approved' value='Approved' />
                    <Picker.Item label='Declined' value='Declined' />
                </Picker>
            </View>
            <FlatList
                data={filteredEnquiries}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Colors.light.red90]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons
                            name='document-text-outline'
                            size={64}
                            color={Colors.light.black30}
                        />
                        <Text style={styles.emptyStateText}>
                            No enquiries found
                        </Text>
                    </View>
                }
            />
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
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusApproved: {
        backgroundColor: '#D1FAE5',
    },
    statusPending: {
        backgroundColor: '#FEF3C7',
    },
    statusDeclined: {
        backgroundColor: '#FEE2E2',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
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
    adminControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    statusButton: {
        backgroundColor: Colors.light.blue90,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    statusButtonText: {
        color: Colors.light.background,
        fontSize: 12,
        fontWeight: 'bold',
    },
});
