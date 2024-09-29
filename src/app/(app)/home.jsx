import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useAuth } from '@/src/context/authContext';

const App = () => {
    const { user } = useAuth();
    console.log(user);

    return (
        <View>
            <Text>Home Component</Text>
            <Text>User: {user.name}</Text>
        </View>
    );
};

export default App;

const styles = StyleSheet.create({});
