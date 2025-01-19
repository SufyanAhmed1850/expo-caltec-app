import React, { createContext, useState, useContext, useCallback } from "react";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    deleteDoc,
    updateDoc,
    doc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Alert } from "react-native";

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchServices = useCallback(async () => {
        setLoading(true);
        try {
            const servicesSnapshot = await getDocs(collection(db, "services"));
            const servicesData = servicesSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setServices(servicesData);

            // Extract unique categories
            const uniqueCategories = [
                ...new Set(servicesData.map((service) => service.category)),
            ];
            const categoriesWithCount = uniqueCategories.map((category) => ({
                name: category,
                servicesCount: servicesData.filter(
                    (service) => service.category === category,
                ).length,
            }));
            setCategories(categoriesWithCount);
        } catch (error) {
            console.error("Error fetching services:", error);
            Alert.alert("Error", "Failed to fetch services");
        } finally {
            setLoading(false);
        }
    }, []);

    const addService = async (newService) => {
        if (!newService.category || !newService.name || !newService.price) {
            Alert.alert("Error", "Please fill all fields");
            return false;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, "services"), {
                category: newService.category,
                name: newService.name,
                price: parseFloat(newService.price),
            });
            Alert.alert("Success", "Service added successfully");
            await fetchServices(); // Refresh the services list
            return true;
        } catch (error) {
            console.error("Error adding service:", error);
            Alert.alert("Error", "Failed to add service");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const getServicesByCategory = async (category) => {
        setLoading(true);
        try {
            const q = query(
                collection(db, "services"),
                where("category", "==", category),
            );
            const querySnapshot = await getDocs(q);
            const categoryServices = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            return categoryServices;
        } catch (error) {
            console.error("Error fetching services by category:", error);
            Alert.alert("Error", "Failed to fetch services for this category");
            return [];
        } finally {
            setLoading(false);
        }
    };

    const deleteService = async (serviceId) => {
        setLoading(true);
        try {
            await deleteDoc(doc(db, "services", serviceId));
            await fetchServices(); // Refresh the services list
            return true;
        } catch (error) {
            console.error("Error deleting service:", error);
            Alert.alert("Error", "Failed to delete service");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateService = async (serviceId, updatedService) => {
        setLoading(true);
        try {
            await updateDoc(doc(db, "services", serviceId), updatedService);
            await fetchServices(); // Refresh the services list
            return true;
        } catch (error) {
            console.error("Error updating service:", error);
            Alert.alert("Error", "Failed to update service");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <ServiceContext.Provider
            value={{
                services,
                categories,
                loading,
                fetchServices,
                addService,
                getServicesByCategory,
                deleteService,
                updateService,
            }}
        >
            {children}
        </ServiceContext.Provider>
    );
};

export const useService = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error("useService must be used within a ServiceProvider");
    }
    return context;
};
