import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import { apiRequest } from '@/src/lib/apiClient';
import { addSocketListener } from '@/src/lib/socketClient';
import { useAuth } from '@context/authContext';

const ServiceContext = createContext();

const getErrorMessage = (error, fallback) =>
    error?.message || error?.data?.message || fallback;

export const ServiceProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const { authStatus } = useAuth();

    const fetchServices = useCallback(async () => {
        if (authStatus !== 'authenticated') {
            setServices([]);
            setCategories([]);
            return [];
        }

        setLoading(true);
        try {
            const [servicesResponse, categoriesResponse] = await Promise.all([
                apiRequest('/services'),
                apiRequest('/services/categories'),
            ]);

            setServices(servicesResponse.services || []);
            setCategories(categoriesResponse.categories || []);
            return servicesResponse.services || [];
        } catch (error) {
            console.error('Error fetching services:', error);
            return [];
        } finally {
            setLoading(false);
        }
    }, [authStatus]);

    useEffect(() => {
        if (authStatus !== 'authenticated') {
            return undefined;
        }

        fetchServices();
        return addSocketListener('service:changed', fetchServices);
    }, [authStatus, fetchServices]);

    const addService = useCallback(async (newService) => {
        if (!newService.category || !newService.name || !newService.price) {
            return {
                success: false,
                msg: 'Category, service name, and price are required.',
            };
        }

        setLoading(true);
        try {
            await apiRequest('/services', {
                method: 'POST',
                body: {
                    category: newService.category,
                    name: newService.name,
                    price: Number(newService.price),
                    currency: newService.currency || 'PKR',
                },
            });
            await fetchServices();
            return { success: true, msg: 'Service added successfully.' };
        } catch (error) {
            console.error('Error adding service:', error);
            return {
                success: false,
                msg: getErrorMessage(error, 'Failed to add service.'),
            };
        } finally {
            setLoading(false);
        }
    }, [fetchServices]);

    const getServicesByCategory = useCallback(async (category) => {
        try {
            const response = await apiRequest(
                `/services?category=${encodeURIComponent(category)}`
            );
            return response.services || [];
        } catch (error) {
            console.error('Error fetching services by category:', error);
            return [];
        }
    }, []);

    const deleteService = useCallback(async (serviceId) => {
        setLoading(true);
        try {
            await apiRequest(`/services/${serviceId}`, { method: 'DELETE' });
            await fetchServices();
            return { success: true, msg: 'Service deleted successfully.' };
        } catch (error) {
            console.error('Error deleting service:', error);
            return {
                success: false,
                msg: getErrorMessage(error, 'Failed to delete service.'),
            };
        } finally {
            setLoading(false);
        }
    }, [fetchServices]);

    const updateService = useCallback(async (serviceId, updatedService) => {
        setLoading(true);
        try {
            await apiRequest(`/services/${serviceId}`, {
                method: 'PATCH',
                body: {
                    category: updatedService.category,
                    name: updatedService.name,
                    price: Number(updatedService.price),
                    currency: updatedService.currency || 'PKR',
                },
            });
            await fetchServices();
            return { success: true, msg: 'Service updated successfully.' };
        } catch (error) {
            console.error('Error updating service:', error);
            return {
                success: false,
                msg: getErrorMessage(error, 'Failed to update service.'),
            };
        } finally {
            setLoading(false);
        }
    }, [fetchServices]);

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
        throw new Error('useService must be used within a ServiceProvider');
    }
    return context;
};
