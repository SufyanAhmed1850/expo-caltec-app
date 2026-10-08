import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import Toast from 'react-native-toast-message';

import { apiRequest } from '@/src/lib/apiClient';
import { addSocketListener } from '@/src/lib/socketClient';
import { useAuth } from '@context/authContext';

const EnquiryContext = createContext();

export const EnquiryProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const { authStatus } = useAuth();

    const fetchServices = useCallback(async () => {
        if (authStatus !== 'authenticated') {
            setServices([]);
            return [];
        }

        setLoading(true);
        try {
            const response = await apiRequest('/services');
            setServices(response.services || []);
            return response.services || [];
        } catch (error) {
            console.error('Error fetching services:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Failed to fetch services',
            });
            return [];
        } finally {
            setLoading(false);
        }
    }, [authStatus]);

    const fetchEnquiries = useCallback(async () => {
        if (authStatus !== 'authenticated') {
            setEnquiries([]);
            return [];
        }

        setLoading(true);
        try {
            const response = await apiRequest('/enquiries');
            setEnquiries(response.enquiries || []);
            return response.enquiries || [];
        } catch (error) {
            console.error('Error fetching enquiries:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Failed to fetch enquiries',
            });
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
        fetchEnquiries();

        const cleanups = [
            addSocketListener('service:changed', fetchServices),
            addSocketListener('enquiry:created', fetchEnquiries),
            addSocketListener('enquiry:updated', fetchEnquiries),
            addSocketListener('enquiry:deleted', fetchEnquiries),
        ];

        return () => cleanups.forEach((cleanup) => cleanup());
    }, [authStatus, fetchEnquiries, fetchServices]);

    const submitEnquiry = useCallback(async (enquiryData) => {
        setLoading(true);
        try {
            const response = await apiRequest('/enquiries', {
                method: 'POST',
                body: enquiryData,
            });
            await fetchEnquiries();
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Enquiry submitted successfully',
            });
            return {
                success: true,
                enquiryNumber: response.enquiryNumber,
                enquiry: response.enquiry,
            };
        } catch (error) {
            console.error('Error submitting enquiry:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Failed to submit enquiry',
            });
            return {
                success: false,
                msg: error.message || 'Failed to submit enquiry',
            };
        } finally {
            setLoading(false);
        }
    }, [fetchEnquiries]);

    const getEnquiry = useCallback(async (enquiryNumber) => {
        const response = await apiRequest(
            `/enquiries/${encodeURIComponent(enquiryNumber)}`
        );
        return response.enquiry;
    }, []);

    const updateEnquiryStatus = useCallback(async (enquiryNumber, status) => {
        const response = await apiRequest(
            `/enquiries/${encodeURIComponent(enquiryNumber)}/status`,
            {
                method: 'PATCH',
                body: { status },
            }
        );
        await fetchEnquiries();
        return response.enquiry;
    }, [fetchEnquiries]);

    const markEnquirySeen = useCallback(async (enquiryNumber) => {
        const response = await apiRequest(
            `/enquiries/${encodeURIComponent(enquiryNumber)}/seen`,
            { method: 'PATCH' }
        );
        await fetchEnquiries();
        return response.enquiry;
    }, [fetchEnquiries]);

    const deleteEnquiry = useCallback(async (enquiryNumber) => {
        await apiRequest(`/enquiries/${encodeURIComponent(enquiryNumber)}`, {
            method: 'DELETE',
        });
        await fetchEnquiries();
        return true;
    }, [fetchEnquiries]);

    return (
        <EnquiryContext.Provider
            value={{
                services,
                enquiries,
                loading,
                fetchServices,
                fetchEnquiries,
                submitEnquiry,
                getEnquiry,
                updateEnquiryStatus,
                markEnquirySeen,
                deleteEnquiry,
            }}
        >
            {children}
        </EnquiryContext.Provider>
    );
};

export const useEnquiry = () => {
    const context = useContext(EnquiryContext);
    if (!context) {
        throw new Error('useEnquiry must be used within an EnquiryProvider');
    }
    return context;
};
