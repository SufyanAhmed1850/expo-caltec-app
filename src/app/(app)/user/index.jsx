import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useAuth } from '@/src/context/authContext';

const User = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <View style={styles.container}>
            <Text>User Component</Text>
            <Pressable onPress={handleLogout} style={styles.signOutBtn}>
                <Text style={styles.signOutBtnText}>SIGN OUT</Text>
            </Pressable>
        </View>
    );
};

export default User;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signOutBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#222',
    },
    signOutBtnText: {
        fontSize: 14,
        color: '#FFF',
    },
});
