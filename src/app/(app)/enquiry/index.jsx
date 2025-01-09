import { db } from "@/firebaseConfig";
import StatusPill from "@/src/components/StatusPill";
import { Colors } from "@/src/constants/Colors";
import { useAuth } from "@/src/context/authContext";
import { IconDelete } from "@constants/SvgIcons";
import { useRouter } from "expo-router";
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    ActivityIndicator,
    AnimatedFAB,
    Button,
    Dialog,
    Menu,
    Portal,
    Searchbar,
    TouchableRipple,
} from "react-native-paper";
import Toast from "react-native-toast-message";

export default function EnquiryList() {
    const [enquiries, setEnquiries] = useState([]);
    const [filteredEnquiries, setFilteredEnquiries] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [visible, setVisible] = useState(false);
    const [isExtended, setIsExtended] = useState(true);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    if (!user) return;

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const fetchEnquiries = useCallback(() => {
        const enquiriesRef = collection(db, "enquiries");
        let q = query(enquiriesRef, orderBy("timestamp", "desc"));

        if (user?.role !== "admin") {
            q = query(q, where("userId", "==", user?.uid));
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
                    .includes(searchQuery.toLowerCase()),
            );
            const matchesStatus =
                statusFilter === "All" || enquiry.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
        setFilteredEnquiries(filtered);
    }, [searchQuery, statusFilter, enquiries]);

    const handleDeleteEnquiry = async () => {
        if (selectedEnquiry) {
            setIsDeleting(true); // Set loading state to true
            try {
                await deleteDoc(doc(db, "enquiries", selectedEnquiry.id));
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Enquiry deleted successfully",
                });
                setDeleteModalVisible(false);
                setSelectedEnquiry(null);
            } catch (error) {
                console.error("Error deleting enquiry:", error);
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Failed to delete enquiry",
                });
            } finally {
                setIsDeleting(false); // Set loading state to false
            }
        }
    };

    const renderItem = ({ item }) => (
        <TouchableRipple
            style={[
                styles.enquiryItemTouchable,
                !item.isSeen && styles.unseenEnquiry,
            ]}
            onPress={() => handleEnquiryPress(item)}
            rippleColor={Colors.light.black30}
            borderless
        >
            <View style={styles.enquiryItem}>
                <View style={styles.enquiryHeader}>
                    <Text style={styles.enquiryNumber}>
                        {item.enquiryNumber}
                    </Text>
                    <Text style={styles.enquiryDate}>
                        {new Date(item?.timestamp).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </Text>
                </View>
                <Text style={styles.customerName}>{item.userName}</Text>
                <View style={styles.enquiryFooter}>
                    <Text style={styles.amount}>
                        PKR {item.totalAmount.toLocaleString()}
                    </Text>
                    <View style={styles.statusAndDeleteContainer}>
                        <StatusPill status={item.status} />
                        {(user.role === "admin" ||
                            item.status === "Pending") && (
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedEnquiry(item);
                                    setDeleteModalVisible(true);
                                }}
                                style={styles.deleteIcon}
                            >
                                <IconDelete
                                    width={20}
                                    height={20}
                                    pathStroke={Colors.light.red90}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </TouchableRipple>
    );

    const handleEnquiryPress = async (item) => {
        if (!item.isSeen && user.role === "admin") {
            try {
                const enquiryRef = doc(db, "enquiries", item.id);
                await updateDoc(enquiryRef, { isSeen: true });
                // Update the local state to reflect the change
                setEnquiries(
                    enquiries.map((e) =>
                        e.id === item.id ? { ...e, isSeen: true } : e,
                    ),
                );
            } catch (error) {
                console.error("Error updating isSeen status:", error);
            }
        }
        router.push(`/enquiry/${item.enquiryNumber}`);
    };

    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setIsExtended(currentScrollPosition <= 0);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search enquiries"
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
                            setStatusFilter("All");
                            closeMenu();
                        }}
                        title="All"
                        titleStyle={styles.menuItemText}
                    />
                    <Menu.Item
                        onPress={() => {
                            setStatusFilter("Pending");
                            closeMenu();
                        }}
                        title="Pending"
                        titleStyle={styles.menuItemText}
                    />
                    <Menu.Item
                        onPress={() => {
                            setStatusFilter("Approved");
                            closeMenu();
                        }}
                        title="Approved"
                        titleStyle={styles.menuItemText}
                    />
                    <Menu.Item
                        onPress={() => {
                            setStatusFilter("Declined");
                            closeMenu();
                        }}
                        title="Declined"
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
                label={"New Enquiry "}
                icon={"plus"}
                extended={isExtended}
                onPress={() => router.push("/enquiry/newEnquiry")}
                visible={true}
                animateFrom={"right"}
                iconMode={"dynamic"}
                style={[styles.fab, { right: 16 }]}
                labelStyle={styles.fabLabel}
                rippleColor={Colors.light.white90}
                color={Colors.light.background}
            />
            <Portal>
                <Dialog
                    visible={deleteModalVisible}
                    onDismiss={() => setDeleteModalVisible(false)}
                    style={{ backgroundColor: Colors.light.background }}
                >
                    <Dialog.Title style={{ color: Colors.light.text }}>
                        Delete Enquiry
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text style={{ color: Colors.light.text }}>
                            Are you sure you want to delete this enquiry?
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            onPress={() => setDeleteModalVisible(false)}
                            textColor={Colors.light.red90}
                        >
                            Cancel
                        </Button>
                        <Button
                            onPress={handleDeleteEnquiry}
                            textColor={Colors.light.red90}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <ActivityIndicator
                                    size="small"
                                    color={Colors.light.red90}
                                />
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Toast />
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
        justifyContent: "center",
        alignItems: "center",
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
    },
    enquiryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    enquiryNumber: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.light.text,
    },
    enquiryDate: {
        fontSize: 12,
        color: "#fcfcfc",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 99,
        backgroundColor: "#666",
    },
    customerName: {
        fontSize: 16,
        color: Colors.light.black90,
        marginBottom: 8,
    },
    enquiryFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    amount: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.light.red90,
    },
    fab: {
        margin: 16,
        bottom: 0,
        backgroundColor: Colors.light.red90,
    },
    statusAndDeleteContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    deleteIcon: {
        marginLeft: 10,
    },
    unseenEnquiry: {
        borderWidth: 2,
        borderColor: Colors.light.red90,
    },
});
