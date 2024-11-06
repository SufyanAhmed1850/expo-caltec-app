import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import {
    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/src/context/authContext';
import { Colors } from '@/src/constants/Colors';
import Toast from 'react-native-toast-message';
import { IconProfile, IconPhone, IconMail } from '@constants/SvgIcons';
import { Ionicons } from '@expo/vector-icons';
import StatusPill from '@/src/components/StatusPill';

export default function EnquiryDetailsPage() {
    const { enquiry } = useLocalSearchParams();
    const [enquiryData, setEnquiryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [approvingStatus, setApprovingStatus] = useState(false);
    const [decliningStatus, setDecliningStatus] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchEnquiryDetails();
    }, [enquiry]);

    const fetchEnquiryDetails = async () => {
        try {
            const enquiriesRef = collection(db, 'enquiries');
            const q = query(
                enquiriesRef,
                where('enquiryNumber', '==', enquiry)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const enquiryDoc = querySnapshot.docs[0];
                setEnquiryData({ id: enquiryDoc.id, ...enquiryDoc.data() });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Enquiry not found',
                });
            }
        } catch (error) {
            console.error('Error fetching enquiry details:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to fetch enquiry details',
            });
        } finally {
            setLoading(false);
        }
    };

    const updateEnquiryStatus = async (newStatus) => {
        const setStatusFunction =
            newStatus === 'Approved' ? setApprovingStatus : setDecliningStatus;
        setStatusFunction(true);
        try {
            if (!enquiryData || !enquiryData.id) {
                throw new Error('Enquiry data not available');
            }
            const enquiryRef = doc(db, 'enquiries', enquiryData.id);
            await updateDoc(enquiryRef, { status: newStatus });
            setEnquiryData((prevData) => ({ ...prevData, status: newStatus }));
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Enquiry status updated',
            });
        } catch (error) {
            console.error('Error updating enquiry status:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to update enquiry status',
            });
        } finally {
            setStatusFunction(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color={Colors.light.red90} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{ title: `${enquiryData?.enquiryNumber}` }}
            />
            <ScrollView style={styles.scrollView}>
                <View style={styles.headerCard}>
                    <Text style={styles.enquiryNumber}>
                        {enquiryData?.enquiryNumber}
                    </Text>
                    <Text style={styles.date}>
                        {new Date(enquiryData?.timestamp).toLocaleDateString()}
                    </Text>
                    <StatusPill status={enquiryData?.status} />
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Customer</Text>
                    <View style={styles.infoRow}>
                        <IconProfile
                            width={20}
                            height={20}
                            pathStroke={Colors.light.black60}
                            style={styles.icon}
                        />
                        <Text style={styles.infoText}>
                            {enquiryData?.userName}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons
                            name='business-outline'
                            size={20}
                            color={Colors.light.black60}
                            style={styles.icon}
                        />
                        <Text style={styles.infoText}>
                            {enquiryData?.companyName}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <IconMail
                            width={20}
                            height={20}
                            pathStroke={Colors.light.black60}
                            style={styles.icon}
                        />
                        <Text style={styles.infoText}>
                            {enquiryData?.email}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <IconPhone
                            width={20}
                            height={20}
                            pathStroke={Colors.light.black60}
                            style={styles.icon}
                        />
                        <Text style={styles.infoText}>
                            {enquiryData?.phone}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Enquiry</Text>
                    <View style={styles.infoRow}>
                        <Ionicons
                            name='location-outline'
                            size={20}
                            color={Colors.light.black60}
                            style={styles.icon}
                        />
                        <Text style={styles.infoText}>
                            Place of Calibration:{' '}
                            {enquiryData?.placeOfCalibration}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons
                            name='cash-outline'
                            size={20}
                            color={Colors.light.black60}
                            style={styles.icon}
                        />
                        <Text style={styles.infoText}>
                            Total Amount: PKR{' '}
                            {enquiryData?.totalAmount.toLocaleString()}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Instruments</Text>
                    {enquiryData?.instruments.map((instrument, index) => (
                        <View
                            key={index}
                            style={[
                                styles.instrumentItem,
                                index < enquiryData.instruments.length - 1 &&
                                    styles.instrumentItemBorder,
                            ]}
                        >
                            <Text style={styles.instrumentName}>
                                {instrument.name}
                            </Text>
                            <Text style={styles.instrumentDetail}>
                                Quantity: {instrument.quantity}
                            </Text>
                            <Text style={styles.instrumentDetail}>
                                Price: PKR {instrument.price.toLocaleString()}
                            </Text>
                        </View>
                    ))}
                </View>

                {user?.role === 'admin' && (
                    <View style={styles.adminActions}>
                        <Text style={styles.sectionTitle}>Admin Actions</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.approveButton]}
                                onPress={() => updateEnquiryStatus('Approved')}
                                disabled={approvingStatus || decliningStatus}
                            >
                                {approvingStatus ? (
                                    <ActivityIndicator color='white' />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        Approve
                                    </Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.declineButton]}
                                onPress={() => updateEnquiryStatus('Declined')}
                                disabled={approvingStatus || decliningStatus}
                            >
                                {decliningStatus ? (
                                    <ActivityIndicator color='white' />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        Decline
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>
            <Toast />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    headerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: '#F8F8F8',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
    },
    enquiryNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#444',
    },
    date: {
        marginRight: 'auto',
        fontSize: 12,
        color: '#fcfcfc',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 99,
        backgroundColor: '#444',
    },
    infoCard: {
        backgroundColor: '#F8F8F8',
        borderRadius: 20,
        padding: 16,
        paddingBottom: 6,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 14,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        gap: 12,
    },
    icon: {
        width: 20,
        height: 20,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
    },
    instrumentItem: {
        marginBottom: 8,
        paddingBottom: 8,
    },
    instrumentItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
    },
    instrumentName: {
        fontSize: 16,
        fontWeight: '600',
    },
    instrumentDetail: {
        fontSize: 14,
        color: '#666',
    },
    adminActions: {
        marginBottom: 32,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 99,
        alignItems: 'center',
    },
    approveButton: {
        backgroundColor: '#33D69F',
        marginRight: 8,
    },
    declineButton: {
        backgroundColor: Colors.light.red90,
        marginLeft: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
