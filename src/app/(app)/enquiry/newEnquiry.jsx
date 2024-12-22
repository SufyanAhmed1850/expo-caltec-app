import React, { useState, useEffect } from "react";
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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@constants/Colors";
import CustomDropDown from "@components/CustomDropDown";
import { useEnquiry } from "@/src/context/enquiryContext";
import { useAuth } from "@/src/context/authContext";
import Toast from "react-native-toast-message";
import LogoHeader from "@/src/components/LogoHeader";

export default function NewEnquiry() {
    const { user } = useAuth();
    const { services, submitEnquiry } = useEnquiry();
    const [formData, setFormData] = useState({
        companyName: "",
        address: "",
        contactPerson: "",
        designation: "",
        phone: "",
        fax: "",
        email: "",
        placeOfCalibration: "Site",
        instruments: [{ name: "", quantity: "", price: "", customPrice: "" }],
        comments: "",
        totalAmount: 0,
        discountPercentage: "",
        discountedAmount: 0,
        status: "Pending",
    });
    const [submittedEnquiryNumber, setSubmittedEnquiryNumber] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData((prevData) => ({
                ...prevData,
                companyName: user.companyName || "",
                contactPerson: user.name || "",
                phone: user.phone || "",
                email: user.email || "",
            }));
        }
    }, [user]);

    useEffect(() => {
        calculateTotalAmount();
    }, [formData.instruments, formData.discountPercentage]);

    const calculateTotalAmount = () => {
        const total = formData.instruments.reduce((sum, instrument) => {
            const price = instrument.price;
            return sum + price * instrument.quantity;
        }, 0);

        let discountAmount;
        let discountedTotal;
        if (formData.discountPercentage) {
            discountAmount = (total * formData.discountPercentage) / 100;
            discountedTotal = total - discountAmount;
        } else {
            discountedTotal = formData.instruments.reduce((sum, instrument) => {
                const price =
                    instrument.customPrice > 0
                        ? instrument.customPrice
                        : instrument.price;
                return sum + price * instrument.quantity;
            }, 0);
        }

        setFormData((prev) => ({
            ...prev,
            totalAmount: total,
            discountedAmount: discountedTotal,
        }));
    };

    const addInstrument = () => {
        setFormData({
            ...formData,
            instruments: [
                ...formData.instruments,
                { name: "", quantity: "", price: "", customPrice: "" },
            ],
        });
    };

    const removeInstrument = (index) => {
        const updatedInstruments = formData.instruments.filter(
            (_, i) => i !== index,
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
                if (field === "name") {
                    const selectedService = services.find(
                        (service) => service.name === value,
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

    const handleDiscountChange = (value) => {
        const discount = parseFloat(value) || "";
        setFormData((prev) => ({
            ...prev,
            discountPercentage: discount,
            instruments: prev.instruments.map((instrument) => ({
                ...instrument,
                customPrice: "", // Reset custom price when applying discount
            })),
        }));
    };

    const handleCustomPriceChange = (index, value) => {
        updateInstrument(index, "customPrice", parseFloat(value) || "");
        setFormData((prev) => ({
            ...prev,
            discountPercentage: "", // Reset discount when applying custom price
        }));
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
                type: "error",
                text1: "Error",
                text2: "Please fill all required fields",
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

        try {
            const success = await submitEnquiry(enquiryData);
            if (success) {
                // Make a POST request to localhost:8000
                const response = await fetch(
                    "https://mail-server-caltec-app.onrender.com/mail/",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            data: JSON.stringify(enquiryData),
                        }),
                    },
                );

                if (!response.ok) {
                    throw new Error("Failed to send data to server");
                }

                setSubmittedEnquiryNumber(enquiryData.enquiryNumber);
                setFormData({
                    companyName: user.companyName || "",
                    address: "",
                    contactPerson: user.name || "",
                    designation: "",
                    phone: user.phone || "",
                    fax: "",
                    email: user.email || "",
                    placeOfCalibration: "Site",
                    instruments: [
                        { name: "", quantity: "", price: 0, customPrice: 0 },
                    ],
                    comments: "",
                    totalAmount: 0,
                    discountPercentage: 0,
                    discountedAmount: 0,
                    status: "Pending",
                });
            }
        } catch (error) {
            console.error("Error submitting enquiry:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to submit enquiry",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={9999}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    keyboardShouldPersistTaps="handled"
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
                        placeholder="Company Name"
                        placeholderTextColor={Colors.light.black30}
                        value={formData.companyName}
                        onChangeText={(text) =>
                            setFormData({ ...formData, companyName: text })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Address"
                        placeholderTextColor={Colors.light.black30}
                        value={formData.address}
                        onChangeText={(text) =>
                            setFormData({ ...formData, address: text })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Contact Person"
                        placeholderTextColor={Colors.light.black30}
                        value={formData.contactPerson}
                        onChangeText={(text) =>
                            setFormData({ ...formData, contactPerson: text })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Designation"
                        placeholderTextColor={Colors.light.black30}
                        value={formData.designation}
                        onChangeText={(text) =>
                            setFormData({ ...formData, designation: text })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone"
                        placeholderTextColor={Colors.light.black30}
                        value={formData.phone}
                        onChangeText={(text) =>
                            setFormData({ ...formData, phone: text })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Fax"
                        placeholderTextColor={Colors.light.black30}
                        value={formData.fax}
                        onChangeText={(text) =>
                            setFormData({ ...formData, fax: text })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
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
                            <Picker.Item label="Site" value="Site" />
                            <Picker.Item label="Lab" value="Lab" />
                            <Picker.Item label="Both" value="Both" />
                        </Picker>
                    </View>

                    {formData.instruments.map((instrument, index) => (
                        <View key={index} style={styles.instrumentRow}>
                            <View style={styles.instrumentInputs}>
                                <View style={styles.topInputs}>
                                    <View style={styles.selectContainer}>
                                        <CustomDropDown
                                            onSelect={(selectedName) =>
                                                updateInstrument(
                                                    index,
                                                    "name",
                                                    selectedName,
                                                )
                                            }
                                            placeholder="Select Instrument"
                                        />
                                    </View>
                                    <View style={styles.quantityContainer}>
                                        <TextInput
                                            style={styles.quantityInput}
                                            placeholder="Qty."
                                            placeholderTextColor={
                                                Colors.light.black30
                                            }
                                            value={instrument.quantity.toString()}
                                            onChangeText={(text) =>
                                                updateInstrument(
                                                    index,
                                                    "quantity",
                                                    text,
                                                )
                                            }
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                                <View style={styles.bottomInputs}>
                                    <View style={styles.priceContainer}>
                                        <Text style={styles.inputLabel}>
                                            Default Price (PKR)
                                        </Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput
                                                style={styles.priceInput}
                                                editable={false}
                                                value={instrument.price.toLocaleString()}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.customPriceContainer}>
                                        <Text style={styles.inputLabel}>
                                            Custom Price (PKR)
                                        </Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput
                                                style={styles.customPriceInput}
                                                placeholder="Enter custom price"
                                                placeholderTextColor={
                                                    Colors.light.black30
                                                }
                                                value={instrument.customPrice.toString()}
                                                onChangeText={(text) =>
                                                    handleCustomPriceChange(
                                                        index,
                                                        text,
                                                    )
                                                }
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
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
                        placeholder="Comments"
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
                                editable={false}
                                value={formData.totalAmount.toLocaleString()}
                            />
                        </View>
                        <View style={styles.discountContainer}>
                            <Text style={styles.discountLabel}>Ask % off:</Text>
                            <TextInput
                                style={styles.percentDiscountInput}
                                placeholder="Enter discount %"
                                value={formData.discountPercentage.toString()}
                                onChangeText={handleDiscountChange}
                                keyboardType="numeric"
                            />
                        </View>
                        <View>
                            <Text style={styles.discountedAmountLabel}>
                                Discounted Amount:
                            </Text>
                            <View style={styles.discountedAmountInputContainer}>
                                <Text style={styles.currencySymbol}>Rs. </Text>
                                <TextInput
                                    style={styles.discountedAmountInput}
                                    editable={false}
                                    value={formData.discountedAmount.toLocaleString()}
                                />
                            </View>
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
        backgroundColor: "#FFFFFF",
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
        fontWeight: "bold",
        color: Colors.light.text,
        marginBottom: 20,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: Colors.light.black30,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        color: Colors.light.text,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.light.black30,
        borderRadius: 10,
    },
    picker: {
        color: Colors.light.text,
    },
    instrumentRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 16,
    },
    instrumentInputs: {
        flex: 1,
        gap: 12,
    },
    topInputs: {
        flexDirection: "row",
        gap: 12,
    },
    selectContainer: {
        flex: 2,
    },
    quantityContainer: {
        flex: 1,
    },
    quantityInput: {
        backgroundColor: Colors.light.background,
        borderWidth: 1,
        borderColor: Colors.light.black30,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        color: Colors.light.text,
    },
    bottomInputs: {
        flexDirection: "row",
        gap: 12,
    },
    priceContainer: {
        flex: 1,
    },
    customPriceContainer: {
        flex: 1,
    },

    inputLabel: {
        fontSize: 12,
        color: Colors.light.black60,
        marginBottom: 4,
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.light.background,
        borderWidth: 1,
        borderColor: Colors.light.black30,
        borderRadius: 10,
        paddingHorizontal: 10,
    },

    priceInput: {
        flex: 1,
        paddingVertical: 10,
        color: Colors.light.text,
        fontSize: 14,
    },
    customPriceInput: {
        flex: 1,
        paddingVertical: 10,
        color: Colors.light.text,
        fontSize: 14,
    },
    addButton: {
        backgroundColor: Colors.light.blue60,
        borderRadius: 99,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 32,
    },
    removeButton: {
        backgroundColor: Colors.light.red60,
        borderRadius: 99,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 32,
    },
    buttonText: {
        color: Colors.light.background,
        fontSize: 24,
        fontWeight: "bold",
    },
    commentsInput: {
        borderRadius: 16,
        height: 100,
        textAlignVertical: "top",
    },
    submitButton: {
        backgroundColor: Colors.light.red90,
        borderRadius: 99,
        padding: 16,
        alignItems: "center",
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: Colors.light.black30,
    },
    submitButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    totalAmountContainer: {
        marginTop: 12,
        gap: 14,
    },
    totalAmountLabel: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.light.text,
    },
    totalAmountInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.light.cardBg,
        borderRadius: 10,
        paddingHorizontal: 16,
    },
    currencySymbol: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.light.red90,
    },
    totalAmountInput: {
        backgroundColor: Colors.light.cardBg,
        flex: 1,
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.light.red90,
        paddingVertical: 12,
        paddingLeft: 8,
    },
    successMessage: {
        backgroundColor: Colors.light.green10,
        padding: 16,
        borderRadius: 10,
        marginBottom: 20,
    },
    successText: {
        color: Colors.light.green90,
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    enquiryNumberText: {
        color: Colors.light.green90,
        fontSize: 14,
    },
    discountContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    discountLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.light.text,
        marginRight: 10,
    },
    percentDiscountInput: {
        flex: 1,
        backgroundColor: Colors.light.cardBg,
        borderRadius: 10,
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.light.red90,
        padding: 10,
    },
    discountedAmountLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.light.text,
        marginBottom: 5,
    },
    discountedAmountInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.light.cardBg,
        borderRadius: 10,
        paddingHorizontal: 16,
    },
    discountedAmountInput: {
        flex: 1,
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.light.red90,
        paddingVertical: 12,
        paddingLeft: 8,
    },
});
