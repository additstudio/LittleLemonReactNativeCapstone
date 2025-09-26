import { View, Image, StyleSheet } from 'react-native'
import * as React from 'react';

function LogoHeader () {
    return (
        <Image source={require('../assets/littleLemonLogo.png')} style={styles.logo} />
    )

}

const styles = StyleSheet.create( {

    logo: {
        width: 150,
        height: 35,
        resizeMode: 'contain',
    }
})
export default LogoHeader;