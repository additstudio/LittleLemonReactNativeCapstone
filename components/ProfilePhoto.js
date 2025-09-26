import { TouchableOpacity, Text, View, StyleSheet, Image, ActivityIndicator} from 'react-native';
import * as React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {colors} from './Colors';

const ProfilePhoto = ( {navigation}) => {

    const [photo, setPhoto] = useState('')
    const [initials, setInitials] = useState('')
    const [imagePresent, setImagePresent] = useState(false)

    const getImage = async () => {
        
        try {
            const savedImageURI = await AsyncStorage.getItem('userPhoto')
            if (savedImageURI !== null) {
                setPhoto(savedImageURI)
                setImagePresent(true) 
            }
        } catch (e) {
            console.error('cannot find image',e)
        }
    }

    const getInitials = async () => {
        
        try {
            const firstName = await AsyncStorage.getItem('userFirstName');
            const lastName = await AsyncStorage.getItem('userLastName');



            if (firstName !== null && lastName !== null) {
            const userInitials = firstName.charAt(0) + lastName.charAt(0)
            setInitials(userInitials)
            } else {
            setInitials(firstName.charAt(0))
            }
        }
        catch(e) {
            console.error('Error extracting initials.', e)
        }
    }
    
    useEffect(() => {

        getInitials();
        getImage();
        

    }, [])

    return (
    
    <View style={styles.container}><TouchableOpacity onPress={() => navigation.navigate('Profile')}>
    {imagePresent ? <Image style={styles.photos} source={{uri: photo}} /> :
    <Text style={styles.initials}>{initials}</Text> }
    </TouchableOpacity>
    </View>

    )
}

const styles = StyleSheet.create( {

    container: {
        borderRadius: 75,
        overflow: 'hidden',
        backgroundColor: colors.llgreen,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
    },

    photos: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
        alignSelf: 'center',
    },

    initials: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center'
        
    }

})

export default ProfilePhoto;
