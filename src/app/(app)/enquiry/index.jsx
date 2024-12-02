import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Text,
    ScrollView,
    Platform,
} from 'react-native';
import {
    Searchbar,
    Menu,
    AnimatedFAB,
    TouchableRipple,
} from 'react-native-paper';
import { useNavigation, useRouter } from 'expo-router';
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/src/context/authContext';
import { Colors } from '@/src/constants/Colors';
import StatusPill from '@/src/components/StatusPill';

export default function EnquiryList() {
    const [enquiries, setEnquiries] = useState([]);
    const [filteredEnquiries, setFilteredEnquiries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [visible, setVisible] = useState(false);
    const [isExtended, setIsExtended] = useState(true);
    const { user } = useAuth();
    const router = useRouter();
    const navigation = useNavigation();

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const fetchEnquiries = useCallback(() => {
        const enquiriesRef = collection(db, 'enquiries');
        let q = query(enquiriesRef, orderBy('timestamp', 'desc'));

        if (user?.role !== 'admin') {
            q = query(q, where('userId', '==', user?.uid));
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedEnquiries = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setEnquiries(fetchedEnquiries);
            setFilteredEnquiries(fetchedEnquiries);
        });

        return unsubscribe;
    }, [user]);

    useEffect(() => {
        const unsubscribe = fetchEnquiries();
        return () => unsubscribe();
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

    const renderItem = ({ item }) => (
        <TouchableRipple
            style={styles.enquiryItemTouchable}
            onPress={() => router.push(`/enquiry/${item.enquiryNumber}`)}
            asChild
            rippleColor={Colors.light.blackOpacity20}
            borderless
        >
            <View style={styles.enquiryItem}>
                <View style={styles.enquiryHeader}>
                    <Text style={styles.enquiryNumber}>
                        {item.enquiryNumber}
                    </Text>
                    <Text style={styles.enquiryDate}>
                        {new Date(item.timestamp).toLocaleDateString()}
                    </Text>
                </View>
                <Text style={styles.customerName}>{item.userName}</Text>
                <View style={styles.enquiryFooter}>
                    <Text style={styles.amount}>
                        PKR {item.totalAmount.toLocaleString()}
                    </Text>
                    <StatusPill status={item.status} />
                </View>
            </View>
        </TouchableRipple>
    );

    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setIsExtended(currentScrollPosition <= 0);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder='Search enquiries'
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={styles.searchInput}
                    iconColor={Colors.light.black30}
                    placeholderTextColor={Colors.light.black30}
                    rippleColor={Colors.light.red30}
                    selectionColor={Colors.light.black30}
                />
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <TouchableRipple
                            onPress={openMenu}
                            style={styles.filterButton}
                            rippleColor={Colors.light.black10}
                            borderless={true}
                        >
                            <Text style={styles.filterButtonLabel}>
                                {statusFilter}
                            </Text>
                        </TouchableRipple>
                    }
                    contentStyle={styles.menuContent}
                >
                    <Menu.Item
                        onPress={() => {
                            setStatusFilter('All');
                            closeMenu();
                        }}
                        title='All'
                        titleStyle={styles.menuItemText}
                    />
                    <Menu.Item
                        onPress={() => {
                            setStatusFilter('Pending');
                            closeMenu();
                        }}
                        title='Pending'
                        titleStyle={styles.menuItemText}
                    />
                    <Menu.Item
                        onPress={() => {
                            setStatusFilter('Approved');
                            closeMenu();
                        }}
                        title='Approved'
                        titleStyle={styles.menuItemText}
                    />
                    <Menu.Item
                        onPress={() => {
                            setStatusFilter('Declined');
                            closeMenu();
                        }}
                        title='Declined'
                        titleStyle={styles.menuItemText}
                    />
                </Menu>
            </View>
            <FlatList
                data={filteredEnquiries}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                onScroll={onScroll}
            />
            <AnimatedFAB
                label={'New Enquiry '}
                icon={'plus'}
                extended={isExtended}
                onPress={() => router.push('/enquiry/newEnquiry')}
                visible={true}
                animateFrom={'right'}
                iconMode={'dynamic'}
                style={[styles.fab, { right: 16 }]}
                labelStyle={styles.fabLabel}
                rippleColor={Colors.light.white90}
                color={Colors.light.background}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    searchBar: {
        flex: 1,
        marginRight: 10,
        backgroundColor: Colors.light.background,
        borderWidth: 1,
        borderColor: Colors.light.black30,
        borderRadius: 99,
    },
    searchInput: {
        color: Colors.light.text,
    },
    filterButton: {
        borderWidth: 1,
        borderColor: Colors.light.black30,
        minWidth: 100,
        borderRadius: 99,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    filterButtonLabel: {
        color: Colors.light.text,
    },
    menuContent: {
        backgroundColor: Colors.light.background,
        borderRadius: 8,
    },
    menuItemText: {
        color: Colors.light.text,
    },
    listContainer: {
        gap: 12,
    },
    enquiryItemTouchable: {
        borderRadius: 12,
    },
    enquiryItem: {
        backgroundColor: Colors.light.cardBg,
        borderRadius: 12,
        padding: 16,
        // marginBottom: 12,
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
    fab: {
        margin: 16,
        bottom: 0,
        backgroundColor: Colors.light.red90,
    },
});
