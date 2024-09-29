import { createContext, useState, useEffect, useContext } from 'react';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { auth, db } from '@/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

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
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            let data = docSnap.data();
            setUser({
                ...user,
                name: data.name,
                companyName: data.companyName,
                phone: data.phone,
                userId: data.userId,
            });
        }
    };

    const login = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            return { success: true };
        } catch (error) {
            let msg = error.message;
            if (msg.includes('(auth/invalid-email'))
                msg = 'Please provide a valid email';
            if (msg.includes('(auth/invalid-credential)'))
                msg = 'Please verify your credential';
            return { success: false, msg };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, msg: error.message, error };
        }
    };

    const register = async (email, password, name, companyName, phone) => {
        try {
            const response = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            // console.log('Register response.user ==>', response.user);
            await setDoc(doc(db, 'users', response?.user?.uid), {
                name,
                companyName,
                phone,
                userId: response?.user?.uid,
            });
            return { success: true, data: response?.user };
        } catch (error) {
            let msg = error.message;
            if (msg.includes('(auth/invalid-email'))
                msg = 'Please provide a valid email';
            if (msg.includes('(auth/email-already-in-use'))
                msg = 'Email already in use';
            return { success: false, msg };
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, login, logout, register }}
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
