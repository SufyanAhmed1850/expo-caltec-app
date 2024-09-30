import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    Image,
    Dimensions,
} from 'react-native';
import { useAuth } from '@/src/context/authContext';
import { Colors } from '@constants/Colors';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { IconMail, IconPhone, IconProfile } from '@constants/SvgIcons';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const usersCollection = collection(db, 'users');
            const userSnapshot = await getDocs(usersCollection);
            const userList = userSnapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter((item) => item.id !== user.uid);
            setUsers(userList);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const renderUserItem = ({ item }) => (
        <View style={styles.userItem}>
            <View style={styles.avatarContainer}>
                {item.profileImage ? (
                    <Image
                        source={{ uri: item.profileImage }}
                        style={styles.avatar}
                    />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <IconProfile
                            width={30}
                            height={30}
                            pathStroke={Colors.light.background}
                        />
                    </View>
                )}
            </View>
            <View style={styles.userInfo}>
                <View style={styles.nameContainer}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>{item.role}</Text>
                    </View>
                </View>
                <View style={styles.infoContainer}>
                    <Ionicons
                        name='business-outline'
                        size={16}
                        color={Colors.light.black30}
                    />
                    <Text style={styles.infoText}>{item.companyName}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <IconMail
                        width={16}
                        height={16}
                        pathStroke={Colors.light.black30}
                    />
                    <Text style={styles.infoText}>{item.email}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <IconPhone
                        width={16}
                        height={16}
                        pathStroke={Colors.light.black30}
                    />
                    <Text style={styles.infoText}>{item.phone}</Text>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size='large' color={Colors.light.blue90} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Users List</Text>
            <FlatList
                data={users}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 20,
        color: Colors.light.text,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 16,
    },
    userItem: {
        flexDirection: 'row',
        backgroundColor: '#F2F2F2',
        borderRadius: 18,
        paddingHorizontal: 18,
        paddingVertical: 16,
        gap: 14,
        alignItems: 'center',
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 99,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 40,
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: Colors.light.red90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
        gap: 8,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    roleBadge: {
        backgroundColor: Colors.light.blue90,
        paddingHorizontal: 10,
        paddingTop: 2,
        paddingBottom: 3.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    roleText: {
        color: Colors.light.background,
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoText: {
        fontSize: 14,
        color: Colors.light.black30,
    },
});
