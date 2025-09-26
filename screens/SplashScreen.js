import { View, Image, StyleSheet } from 'react-native'
import * as React from 'react'

function SplashScreen () {
    return (
        <View style={styles.container}>
        <Image source={require('../assets/LittleLemonLogoBig.png')} style={styles.logo}/>
        </View>
    )

}

const styles = StyleSheet.create( {
    
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    logo: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    }
})
export default SplashScreen;