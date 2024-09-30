import React, { createContext, useState, useEffect, useContext } from 'react';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
} from 'firebase/auth';
import { auth, db, storage } from '@/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);
    const [isLoading, setIsLoading] = useState({
        refresh: false,
        update: false,
        logout: false,
    });

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user.uid);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        });
        return unsub;
    }, []);

    const updateUserData = async (userId) => {
        try {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let data = docSnap.data();
                setUser((prevUser) => ({
                    ...prevUser,
                    name: data.name,
                    companyName: data.companyName,
                    phone: data.phone,
                    userId: data.userId,
                    role: data.role,
                    profileImage: data.profileImage,
                }));
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            throw error;
        }
    };

    const refreshUserData = async () => {
        try {
            setIsLoading((prev) => ({ ...prev, refresh: true }));
            if (!user || !user.uid) {
                throw new Error('User not authenticated');
            }
            await updateUserData(user.uid);
            setIsLoading((prev) => ({ ...prev, refresh: false }));
            return { success: true, msg: 'Profile refreshed successfully' };
        } catch (error) {
            setIsLoading((prev) => ({ ...prev, refresh: false }));
            return { success: false, msg: error.message };
        }
    };

    const login = async (email, password) => {
        try {
            setIsLoading((prev) => ({ ...prev, login: true }));
            await signInWithEmailAndPassword(auth, email, password);
            setIsLoading((prev) => ({ ...prev, login: false }));
            return { success: true };
        } catch (error) {
            setIsLoading((prev) => ({ ...prev, login: false }));
            let msg = error.message;
            if (msg.includes('auth/invalid-email'))
                msg = 'Please provide a valid email';
            if (msg.includes('auth/invalid-credential'))
                msg = 'Please verify your credentials';
            return { success: false, msg };
        }
    };

    const logout = async () => {
        try {
            setIsLoading((prev) => ({ ...prev, logout: true }));
            await signOut(auth);
            setIsLoading((prev) => ({ ...prev, logout: false }));
            return { success: true };
        } catch (error) {
            setIsLoading((prev) => ({ ...prev, logout: false }));
            return { success: false, msg: error.message, error };
        }
    };

    const register = async (
        email,
        password,
        name,
        companyName,
        phone,
        role,
        profileImage
    ) => {
        try {
            setIsLoading((prev) => ({ ...prev, register: true }));
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            let profileImageUrl = null;
            if (profileImage) {
                const response = await fetch(profileImage);
                const blob = await response.blob();
                const imageRef = ref(
                    storage,
                    `profileImages/${userCredential.user.uid}`
                );
                await uploadBytes(imageRef, blob);
                profileImageUrl = await getDownloadURL(imageRef);
            }

            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name,
                email,
                companyName,
                phone,
                userId: userCredential.user.uid,
                role,
                profileImage: profileImageUrl,
            });
            setIsLoading((prev) => ({ ...prev, register: false }));
            return {
                success: true,
                msg: 'Registration successful. You can now log in.',
            };
        } catch (error) {
            setIsLoading((prev) => ({ ...prev, register: false }));
            let msg = error.message;
            if (msg.includes('auth/invalid-email'))
                msg = 'Please provide a valid email';
            if (msg.includes('auth/email-already-in-use'))
                msg = 'Email already in use';
            return { success: false, msg };
        }
    };

    const updateProfile = async (name, companyName, phone, profileImage) => {
        try {
            setIsLoading((prev) => ({ ...prev, update: true }));

            if (!user || !user.uid) {
                throw new Error('User not authenticated');
            }
            if (!name || !companyName || !phone) {
                throw new Error('Name, company name, and phone are required');
            }

            const userRef = doc(db, 'users', user.uid);
            const updateData = {
                name,
                companyName,
                phone,
            };

            if (profileImage) {
                // Convert image URI to Blob
                const response = await fetch(profileImage);
                const blob = await response.blob();

                // Determine MIME type from the blob
                const mimeType = blob.type || 'image/jpeg'; // Fallback to 'image/jpeg' if type is unknown

                // Upload the image to Firebase storage with metadata
                const imageRef = ref(storage, `profileImages/${user.uid}`);
                const metadata = {
                    contentType: mimeType,
                };
                await uploadBytes(imageRef, blob, metadata);

                // Get the download URL of the uploaded image
                const downloadURL = await getDownloadURL(imageRef);
                updateData.profileImage = downloadURL;
            }

            // Update Firestore user document with new data
            await updateDoc(userRef, updateData);

            // Update local user state
            setUser((prevUser) => ({
                ...prevUser,
                ...updateData,
            }));

            setIsLoading((prev) => ({ ...prev, update: false }));
            return { success: true, msg: 'Profile updated successfully' };
        } catch (error) {
            console.error('Error updating profile:', error);
            setIsLoading((prev) => ({ ...prev, update: false }));
            return { success: false, msg: error.message };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
                register,
                updateProfile,
                refreshUserData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error('useAuth must be wrapped inside AuthContextProvider');
    }
    return value;
};
