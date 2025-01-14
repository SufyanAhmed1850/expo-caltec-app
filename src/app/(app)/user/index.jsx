import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    SafeAreaView,
    RefreshControl,
    Image,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/src/context/authContext';
import { Colors } from '@/src/constants/Colors';
import { IconProfile, IconPhone } from '@constants/SvgIcons';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';

export default function Profile() {
    const { user, logout, updateProfile, isLoading, refreshUserData } =
        useAuth();
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [phone, setPhone] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setCompanyName(user.companyName || '');
            setPhone(user.phone || '');
            setProfileImage(user.profileImage || null);
        }
    }, [user]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={handleLogout}
                    style={styles.logoutButton}
                >
                    <Ionicons
                        name='log-out-outline'
                        size={24}
                        color={Colors.light.background}
                    />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const handleImagePick = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert(
                'Permission Required',
                'You need to grant camera roll permissions to change your profile picture.'
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            setIsFormChanged(true);
        }
    };

    const handleUpdate = async () => {
        if (!name || !companyName || !phone) {
            Alert.alert(
                'Update Profile',
                'Please fill all the required fields!',
                [{ text: 'OK' }]
            );
            return;
        }

        const response = await updateProfile(
            name,
            companyName,
            phone,
            profileImage
        );
        if (response.success) {
            Alert.alert('Success', response.msg, [{ text: 'OK' }]);
            setIsFormChanged(false);
        } else {
            Alert.alert('Error', response.msg, [{ text: 'OK' }]);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await logout();
            if (!response.success) {
                Alert.alert('Error', response.msg, [{ text: 'OK' }]);
            }
        } catch (error) {
            console.error('Error logging out:', error);
            Alert.alert('Error', 'Failed to log out. Please try again.', [
                { text: 'OK' },
            ]);
        }
    };

    const onRefresh = useCallback(async () => {
        const response = await refreshUserData();
        if (!response.success) {
            Alert.alert('Error', response.msg, [{ text: 'OK' }]);
        }
    }, [refreshUserData]);

    const handleInputChange = (field, value) => {
        switch (field) {
            case 'name':
                setName(value);
                break;
            case 'companyName':
                setCompanyName(value);
                break;
            case 'phone':
                setPhone(value);
                break;
        }
        setIsFormChanged(true);
    };

    const navigateToUsersList = () => {
        router.push('/user/usersList');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollView}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading.refresh}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <TouchableOpacity
                        style={styles.avatarContainer}
                        onPress={handleImagePick}
                    >
                        {profileImage ? (
                            <Image
                                source={{ uri: profileImage }}
                                style={styles.avatar}
                            />
                        ) : (
                            <View style={styles.avatar}>
                                <IconProfile
                                    width={60}
                                    height={60}
                                    pathStroke={Colors.light.background}
                                />
                            </View>
                        )}
                        <Text style={styles.changePhotoText}>Change Photo</Text>
                    </TouchableOpacity>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <IconProfile
                                width={24}
                                height={24}
                                pathStroke={Colors.light.black30}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Full Name'
                                placeholderTextColor={Colors.light.black30}
                                value={name}
                                onChangeText={(text) =>
                                    handleInputChange('name', text)
                                }
                            />
                        </View>
                        <View style={styles.inputWrapper}>
                            <Ionicons
                                name='business-outline'
                                size={24}
                                color={Colors.light.black30}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Company Name'
                                placeholderTextColor={Colors.light.black30}
                                value={companyName}
                                onChangeText={(text) =>
                                    handleInputChange('companyName', text)
                                }
                            />
                        </View>
                        <View style={styles.inputWrapper}>
                            <IconPhone
                                width={24}
                                height={24}
                                pathStroke={Colors.light.black30}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Phone Number'
                                placeholderTextColor={Colors.light.black30}
                                value={phone}
                                onChangeText={(text) =>
                                    handleInputChange('phone', text)
                                }
                                keyboardType='phone-pad'
                            />
                        </View>
                        <View style={styles.inputWrapper}>
                            <Ionicons
                                name='mail-outline'
                                size={24}
                                color={Colors.light.black30}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                value={user?.email}
                                editable={false}
                            />
                        </View>
                    </View>
                    {user && user.role === 'admin' && (
                        <TouchableOpacity
                            style={styles.adminButton}
                            onPress={navigateToUsersList}
                        >
                            <Text style={styles.adminButtonText}>
                                View All Users
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[
                            styles.updateButton,
                            !isFormChanged && styles.disabledButton,
                        ]}
                        onPress={handleUpdate}
                        disabled={!isFormChanged || isLoading.update}
                    >
                        {isLoading.update ? (
                            <ActivityIndicator
                                color={Colors.light.background}
                            />
                        ) : (
                            <Text style={styles.updateButtonText}>
                                Update Profile
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        paddingVertical: 64,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.light.red90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    changePhotoText: {
        marginTop: 10,
        color: Colors.light.blue90,
        fontSize: 16,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        borderWidth: 1,
        borderColor: Colors.light.black30,
        borderRadius: 99,
        marginBottom: 10,
        padding: 14,
    },
    input: {
        flex: 1,
        paddingLeft: 10,
        fontSize: 16,
        color: Colors.light.text,
    },
    disabledInput: {
        color: Colors.light.black30,
    },
    updateButton: {
        backgroundColor: Colors.light.red90,
        padding: 15,
        borderRadius: 99,
        alignItems: 'center',
        marginBottom: 10,
    },
    disabledButton: {
        backgroundColor: Colors.light.black30,
    },
    updateButtonText: {
        color: Colors.light.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    adminButton: {
        backgroundColor: Colors.light.blue90,
        padding: 15,
        borderRadius: 99,
        alignItems: 'center',
        marginBottom: 10,
    },
    adminButtonText: {
        color: Colors.light.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutButton: {
        marginRight: 15,
    },
});
