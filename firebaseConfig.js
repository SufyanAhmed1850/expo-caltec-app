// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore, collection } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyB-NVD2owf6uMCSEiBuyTAUm2wk0k4r83Y',
    authDomain: 'caltec-app.firebaseapp.com',
    projectId: 'caltec-app',
    storageBucket: 'caltec-app.appspot.com',
    messagingSenderId: '319670660015',
    appId: '1:319670660015:web:8a80b4fad84618d8a41d5a',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export const usersRef = collection(db, 'users');
export const instrumentsRef = collection(db, 'instruments');
export const enquiriesRef = collection(db, 'enquiries');
