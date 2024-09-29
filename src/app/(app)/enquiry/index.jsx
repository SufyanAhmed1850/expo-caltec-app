import React, { useState } from 'react';
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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '@constants/Colors';
import instrumentsList from '@/data';
import CustomDropDown from '@components/CustomDropDown';

export default function Enquiry() {
    const [formData, setFormData] = useState({
        companyName: '',
        address: '',
        contactPerson: '',
        designation: '',
        phone: '',
        fax: '',
        email: '',
        placeOfCalibration: 'Site',
        instruments: [{ name: '', quantity: '' }],
        comments: '',
    });

    const addInstrument = () => {
        setFormData({
            ...formData,
            instruments: [...formData.instruments, { name: '', quantity: '' }],
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
        const updatedInstruments = formData.instruments.map((instrument, i) =>
            i === index ? { ...instrument, [field]: value } : instrument
        );
        setFormData({ ...formData, instruments: updatedInstruments });
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        // Here you would typically send the data to your backend
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
                    <Text style={styles.title}>Enquiry</Text>

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
                                data={instrumentsList}
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
                                value={instrument.quantity}
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

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>SUBMIT</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
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
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
