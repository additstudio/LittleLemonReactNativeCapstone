import { TouchableOpacity, Text, View, StyleSheet, Dimensions } from "react-native"
import React from 'react'
import {colors} from './Colors'

const dimensions = Dimensions.get('window');
const buttonWidth = dimensions.width * 0.8;

export const CustomButton = ( {title , onPress} ) => {

    return(
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onPress}><Text style={styles.buttonText}>{title}</Text></TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
    button: {
        width: buttonWidth,
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor: colors.llyellow,
        alignSelf: 'center',
        
    },

    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
        fontFamily: 'Karla_700Bold',

    },

    buttonContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: 'white',
        width: dimensions.width,
        height: 80,
        paddingBottom: 20,
    }
})