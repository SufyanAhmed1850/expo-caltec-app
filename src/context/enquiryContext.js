import React, { createContext, useState, useContext, useCallback } from "react";
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import Toast from "react-native-toast-message";

const EnquiryContext = createContext();

export const EnquiryProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchServices = useCallback(async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "services"));
            const servicesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setServices(servicesData);
        } catch (error) {
            console.error("Error fetching services:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to fetch services",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const getNextEnquiryNumber = async () => {
        const enquiriesRef = collection(db, "enquiries");
        const q = query(
            enquiriesRef,
            orderBy("enquiryNumber", "desc"),
            limit(1),
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return "CIS-000001";
        } else {
            const lastEnquiry = querySnapshot.docs[0].data();
            const lastNumber = parseInt(
                lastEnquiry.enquiryNumber.split("-")[1],
            );
            return `CIS-${(lastNumber + 1).toString().padStart(6, "0")}`;
        }
    };

    const submitEnquiry = async (enquiryData) => {
        setLoading(true);
        try {
            const enquiryNumber = await getNextEnquiryNumber();
            const enquiryWithNumber = {
                ...enquiryData,
                enquiryNumber,
                status: enquiryData.status || "Pending",
                isSeen: false, // Add this line
                instruments: enquiryData.instruments.map((instrument) => ({
                    ...instrument,
                    customPrice:
                        parseFloat(instrument.customPrice) || instrument.price,
                    totalPrice:
                        (parseFloat(instrument.customPrice) ||
                            instrument.price) * instrument.quantity,
                })),
            };
            await addDoc(collection(db, "enquiries"), enquiryWithNumber);
            Toast.show({
                type: "success",
                text1: "Success",
                text2: "Enquiry submitted successfully",
            });
            return true;
        } catch (error) {
            console.error("Error submitting enquiry:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to submit enquiry",
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <EnquiryContext.Provider
            value={{
                services,
                loading,
                fetchServices,
                submitEnquiry,
            }}
        >
            {children}
        </EnquiryContext.Provider>
    );
};

export const useEnquiry = () => {
    const context = useContext(EnquiryContext);
    if (!context) {
        throw new Error("useEnquiry must be used within an EnquiryProvider");
    }
    return context;
};
