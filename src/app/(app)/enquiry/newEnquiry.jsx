import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '@constants/Colors';
import CustomDropDown from '@components/CustomDropDown';
import { useEnquiry } from '@/src/context/enquiryContext';
import { useAuth } from '@/src/context/authContext';
import Toast from 'react-native-toast-message';
import LogoHeader from '@/src/components/LogoHeader';

export default function NewEnquiry() {
    const { user } = useAuth();
    const { services, submitEnquiry } = useEnquiry();
    const [formData, setFormData] = useState({
        companyName: '',
        address: '',
        contactPerson: '',
        designation: '',
        phone: '',
        fax: '',
        email: '',
        placeOfCalibration: 'Site',
        instruments: [{ name: '', quantity: '', price: 0 }],
        comments: '',
        totalAmount: null,
        status: 'Pending',
    });
    const [submittedEnquiryNumber, setSubmittedEnquiryNumber] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Set default values based on logged-in user's information
        if (user) {
            setFormData((prevData) => ({
                ...prevData,
                companyName: user.companyName || '',
                contactPerson: user.name || '',
                phone: user.phone || '',
                email: user.email || '',
            }));
        }
    }, [user]);

    useEffect(() => {
        calculateTotalAmount();
    }, [formData.instruments]);

    const calculateTotalAmount = () => {
        const total = formData.instruments.reduce((sum, instrument) => {
            return sum + instrument.price * instrument.quantity;
        }, 0);
        setFormData((prev) => ({ ...prev, totalAmount: total }));
    };

    const addInstrument = () => {
        setFormData({
            ...formData,
            instruments: [
                ...formData.instruments,
                { name: '', quantity: '', price: 0 },
            ],
        });
    };

    const removeInstrument = (index) => {
        const updatedInstruments = formData.instruments.filter(
            (_, i) => i !== index
        );
        setFormData({
            ...formData,
            instruments: updatedInstruments,
        });
    };

    const updateInstrument = (index, field, value) => {
        const updatedInstruments = formData.instruments.map((instrument, i) => {
            if (i === index) {
                const updatedInstrument = { ...instrument, [field]: value };
                if (field === 'name') {
                    const selectedService = services.find(
                        (service) => service.name === value
                    );
                    updatedInstrument.price = selectedService
                        ? selectedService.price
                        : 0;
                }
                return updatedInstrument;
            }
            return instrument;
        });
        setFormData({ ...formData, instruments: updatedInstruments });
    };

    const isFormValid = () => {
        return (
            formData.companyName &&
            formData.address &&
            formData.contactPerson &&
            formData.designation &&
            formData.phone &&
            formData.fax &&
            formData.email &&
            formData.instruments.every((i) => i.name && i.quantity)
        );
    };

    const handleSubmit = async () => {
        if (!isFormValid()) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please fill all required fields',
            });
            return;
        }

        setIsSubmitting(true);
        const enquiryData = {
            ...formData,
            userId: user.uid,
            userName: user.name,
            timestamp: new Date().toISOString(),
        };

        const success = await submitEnquiry(enquiryData);
        setIsSubmitting(false);
        if (success) {
            setSubmittedEnquiryNumber(enquiryData.enquiryNumber);
            setFormData({
                companyName: user.companyName || '',
                address: '',
                contactPerson: user.name || '',
                designation: '',
                phone: user.phone || '',
                fax: '',
                email: user.email || '',
                placeOfCalibration: 'Site',
                instruments: [{ name: '', quantity: '', price: 0 }],
                comments: '',
                totalAmount: 0,
                status: 'Pending',
            });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={9999}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    keyboardShouldPersistTaps='handled'
                >
                    <LogoHeader />
                    {submittedEnquiryNumber && (
                        <View style={styles.successMessage}>
                            <Text style={styles.successText}>
                                Enquiry submitted successfully!
                            </Text>
                            <Text style={styles.enquiryNumberText}>
                                Enquiry Number: {submittedEnquiryNumber}
                            </Text>
                        </View>
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder='Company Name'
                        placeholderTextColor={Colors.light.black30}
                        value={formData.companyName}
                        onChangeText={(text) =>
                            setFormData({ ...formData, companyName: text })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Address'
                        placeholderTextColor={Colors.light.black30}
                        value={formData.address}
                        onChangeText={(text) =>
                            setFormData({ ...formData, address: text })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Contact Person'
                        placeholderTextColor={Colors.light.black30}
                        value={formData.contactPerson}
                        onChangeText={(text) =>
                            setFormData({ ...formData, contactPerson: text })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Designation'
                        placeholderTextColor={Colors.light.black30}
                        value={formData.designation}
                        onChangeText={(text) =>
                            setFormData({ ...formData, designation: text })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Phone'
                        placeholderTextColor={Colors.light.black30}
                        value={formData.phone}
                        onChangeText={(text) =>
                            setFormData({ ...formData, phone: text })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Fax'
                        placeholderTextColor={Colors.light.black30}
                        value={formData.fax}
                        onChangeText={(text) =>
                            setFormData({ ...formData, fax: text })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Email Address'
                        placeholderTextColor={Colors.light.black30}
                        value={formData.email}
                        onChangeText={(text) =>
                            setFormData({ ...formData, email: text })
                        }
                    />

                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.placeOfCalibration}
                            style={styles.picker}
                            onValueChange={(itemValue) =>
                                setFormData({
                                    ...formData,
                                    placeOfCalibration: itemValue,
                                })
                            }
                        >
                            <Picker.Item label='Site' value='Site' />
                            <Picker.Item label='Lab' value='Lab' />
                            <Picker.Item label='Both' value='Both' />
                        </Picker>
                    </View>

                    {formData.instruments.map((instrument, index) => (
                        <View key={index} style={styles.instrumentRow}>
                            <CustomDropDown
                                onSelect={(selectedName) =>
                                    updateInstrument(
                                        index,
                                        'name',
                                        selectedName
                                    )
                                }
                                placeholder='Select Instrument'
                            />
                            <TextInput
                                style={[styles.input, styles.quantityInput]}
                                placeholder='Qty.'
                                placeholderTextColor={Colors.light.black30}
                                value={instrument.quantity.toString()}
                                onChangeText={(text) =>
                                    updateInstrument(index, 'quantity', text)
                                }
                                keyboardType='numeric'
                            />
                            {index === formData.instruments.length - 1 ? (
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={addInstrument}
                                >
                                    <Text style={styles.buttonText}>+</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeInstrument(index)}
                                >
                                    <Text style={styles.buttonText}>-</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                    <TextInput
                        style={[styles.input, styles.commentsInput]}
                        placeholder='Comments'
                        placeholderTextColor={Colors.light.black30}
                        value={formData.comments}
                        onChangeText={(text) =>
                            setFormData({ ...formData, comments: text })
                        }
                        multiline
                    />
                    <View style={styles.totalAmountContainer}>
                        <Text style={styles.totalAmountLabel}>
                            Total Amount:
                        </Text>
                        <View style={styles.totalAmountInputContainer}>
                            <Text style={styles.currencySymbol}>Rs. </Text>
                            <TextInput
                                style={styles.totalAmountInput}
                                value={formData.totalAmount?.toFixed(0)}
                                onChangeText={(text) =>
                                    setFormData({
                                        ...formData,
                                        totalAmount: parseFloat(text) || null,
                                    })
                                }
                                keyboardType='numeric'
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            !isFormValid() && styles.disabledButton,
                        ]}
                        onPress={handleSubmit}
                        disabled={!isFormValid() || isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator
                                color={Colors.light.background}
                            />
                        ) : (
                            <Text style={styles.submitButtonText}>SUBMIT</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
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
    scrollViewContent: {
        flexGrow: 1,
        padding: 20,
        gap: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: Colors.light.black30,
        borderRadius: 99,
        paddingVertical: 10,
        paddingHorizontal: 14,
        color: Colors.light.text,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.light.black30,
        borderRadius: 99,
    },
    picker: {
        color: Colors.light.text,
    },
    instrumentRow: {
        flexDirection: 'row',
        columnGap: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1,
    },
    quantityInput: {
        flex: 1,
    },
    addButton: {
        backgroundColor: Colors.light.blue60,
        borderRadius: 99,
        width: 40,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButton: {
        backgroundColor: Colors.light.red60,
        borderRadius: 99,
        width: 40,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.light.background,
        fontSize: 24,
        fontWeight: 'bold',
    },
    commentsInput: {
        borderRadius: 16,
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: Colors.light.red90,
        borderRadius: 99,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: Colors.light.black30,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalAmountContainer: {
        marginTop: 20,
    },
    totalAmountLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 8,
    },
    totalAmountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.cardBg,
        borderRadius: 99,
        paddingHorizontal: 16,
    },
    currencySymbol: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.red90,
    },
    totalAmountInput: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.red90,
        paddingVertical: 12,
        paddingLeft: 8,
    },
});
