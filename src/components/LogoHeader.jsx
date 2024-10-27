import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@constants/Colors';

const { width } = Dimensions.get('window');

export const LogoHeader = () => {
    return (
        <View style={[styles.container]}>
            <Image
                source={require('@assets/images/logo.png')}
                style={styles.logo}
                resizeMode='contain'
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
    },
    logo: {
        width: width * 0.4,
        height: width * 0.13,
    },
});

export default LogoHeader;
