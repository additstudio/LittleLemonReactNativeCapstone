import { View, Text, Image, StyleSheet, TextInput, ActivityIndicator, Pressable, Switch, Alert, TouchableWithoutFeedback, Keyboard, Dimensions, TouchableOpacity} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { colors } from '../components/Colors';
import { TextInputMask } from 'react-native-masked-text';
import { validateEmail, validateAlpha, validatePhoneNumber } from '../components/ValidateUser';
import { CustomButton } from '../components/CustomButton';
import * as ImagePicker from 'expo-image-picker';

const dimensions = Dimensions.get('window');
const smallButtonWidth = dimensions.width * 0.375;
const smallButtonMargin = dimensions.width * 0.025;


const Profile = ( {navigation}) => {

    const [preferences, setPreferences] = useState({
        orderStatus: false,
        passwordChanges: false,
        specialOffers: false,
        newsletter: false,
    });

    const [isLoading, setIsLoading] = useState(true)
    const [userProfile, setUserProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        photo: '',
    })

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        handleInputChange('photo', result.assets[0].uri)
    };
    }

    const handleInputChange = (key, value) => {
        setUserProfile((prevUserData) => ({
          ...prevUserData,
          [key]: value,
        }));
      };

    const getPlaceholder = (key, field) => {

        return key ? key : field
    };
    
    const updateState = (key) => () => 
        setPreferences((prevPreference) => ({
            ...prevPreference,
            [key] : !prevPreference[key],
        }))
    


    const getUser = async() => {
        try {
            const firstName = await AsyncStorage.getItem('userFirstName')
            const lastName = await AsyncStorage.getItem('userLastName')
            const email = await AsyncStorage.getItem('userEmail')
            const phoneNumber = await AsyncStorage.getItem('userPhoneNumber')
            const photo = await AsyncStorage.getItem('userPhoto')

            setUserProfile(
                {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: phoneNumber,
                    photo: photo,
               
                })

            const savedPreferences = await AsyncStorage.getItem('userPreferences')

            if (savedPreferences !== null) {
                const jsonResults = JSON.parse(savedPreferences)
                setPreferences(jsonResults)
            }

            }
        catch (e) {
            console.log(e)
        }
        finally {
            setIsLoading(false)

        }
    }

    const Logout = async() => {
        try {
            await AsyncStorage.clear()
        }
        catch(e) {
            console.log(e)
        }
        finally{
            navigation.navigate('Login')
        }
    }

    const saveChanges = async() => {

        if (userProfile.firstName === '' || userProfile.lastName === '' || userProfile.email === '' || userProfile.phoneNumber === null) {
            Alert.alert('Please enter all required personal information.')
        } else if (!validateEmail(userProfile.email)) {
            Alert.alert('Please enter a valid email address.')
        } else if (!validatePhoneNumber(userProfile.phoneNumber)) {
            Alert.alert('Please enter a valid phone number.')
        } else if (!validateAlpha(userProfile.firstName) || !validateAlpha(userProfile.lastName)) {
            Alert.alert('Please enter a valid first & last name.')
        }

        else {
        try {

            await AsyncStorage.setItem('userFirstName', userProfile.firstName)
            await AsyncStorage.setItem('userLastName', userProfile.lastName)
            await AsyncStorage.setItem('userEmail', userProfile.email)
            await AsyncStorage.setItem('userPhoneNumber', userProfile.phoneNumber)

            if (userProfile.photo !== null) {
            await AsyncStorage.setItem('userPhoto', userProfile.photo) }

            const preferencesStringify = JSON.stringify(preferences)
            await AsyncStorage.setItem('userPreferences', preferencesStringify)

        }
        catch (e) {
            console.error('save error', e)
        }
        finally {
            navigation.navigate('Home')
        }
    }
    }

    const photoPlacholderText = () => {
        const firstNameFirstLetter = userProfile.firstName ? userProfile.firstName.charAt(0) : ''
        const lastNameFirstLetter = userProfile.lastName ? userProfile.lastName.charAt(0) : ''

        const initials = firstNameFirstLetter + lastNameFirstLetter

        return initials

    }

    const clearImage = () => {


        Alert.alert('Alert', 'Delete photo?',[
            {
                text: 'Cancel',
                style: 'cancel'

            },
            {   text: 'OK',
                onPress: () => {handleInputChange('photo','')}
            }
        ]) 
  
    }


    useEffect(() => {
        getUser();
    }, [])

    return (

        isLoading ? (
            <View style={styles.container}><ActivityIndicator /></View>
        ) : (

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>            
            <View style={styles.photoPlaceholder}>
            <TouchableOpacity onPress={pickImage} onLongPress={() => userProfile.photo ? clearImage() : {}} >
            {userProfile.photo ? (
                <Image source={{ uri: userProfile.photo }} style={styles.image} />) : <Text style={styles.photoPlaceholderText}>{photoPlacholderText()}</Text>}
            </TouchableOpacity>
            </View>
            <Text style={styles.title}>Personal Information</Text>

            <View>
                <TextInput style={styles.inputField} placeholder={getPlaceholder(userProfile.firstName, 'Your First Name')} value={userProfile.firstName} onChangeText={(text) => handleInputChange('firstName', text)} clearButtonMode='always' />
                <TextInput style={styles.inputField} placeholder={getPlaceholder(userProfile.lastName, 'Your Last Name')} value={userProfile.lastName} onChangeText={(text) => handleInputChange('lastName', text)} clearButtonMode='always' />
                <TextInput style={styles.inputField} placeholder={getPlaceholder(userProfile.email, 'Your Email')} value={userProfile.email} onChangeText={(text) => handleInputChange('email', text)} clearButtonMode='always' keyboardType='email-address'/>
                <TextInputMask type='custom' options={{
                    mask: '(999) 999-9999',
                }} style={styles.inputField} placeholder={getPlaceholder(userProfile.phoneNumber, 'Your Phone Number')} value={userProfile.phoneNumber} onChangeText={(text) => handleInputChange('phoneNumber', text)} clearButtonMode='always' keyboardType='numeric'/>
            </View>

            <View style={styles.bottomContainer}>
            <Text style={styles.subtitle}>Your Notifications Preferences</Text>

            

                <View style={styles.preferenceContainer}>
                <Text style={styles.preferenceText}>Update of Order Status: </Text>
                <Switch value={preferences.orderStatus} onValueChange={updateState('orderStatus')} style={styles.switch} trackColor={{false: 'white', true: colors.llyellow}}
          ios_backgroundColor="white"/>
                </View>
                <View style={styles.preferenceContainer}>
                <Text style={styles.preferenceText}>Password Changes Alert: </Text>
                <Switch value={preferences.passwordChanges} onValueChange={updateState('passwordChanges')} style={styles.switch} trackColor={{false: 'white', true: colors.llyellow}}
          ios_backgroundColor="white"/>
                </View>
                <View style={styles.preferenceContainer}>
                <Text style={styles.preferenceText}>Special Offers Alert: </Text>
                <Switch value={preferences.specialOffers} onValueChange={updateState('specialOffers')} style={styles.switch} trackColor={{false: 'white', true: colors.llyellow}}
          ios_backgroundColor="#white"/>
                </View>
                <View style={styles.preferenceContainer}>
                <Text style={styles.preferenceText}>Newsletter Subscription: </Text>
                <Switch value={preferences.newsletter} onValueChange={updateState('newsletter')} style={styles.switch} trackColor={{false: 'white', true: colors.llyellow}}
          ios_backgroundColor="white"/>
                </View>
            
            </View>


            <View style={styles.smallButtonContainer}>
                <TouchableOpacity style={[styles.smallButton,{backgroundColor:'grey'}]} onPress={()=>navigation.goBack()}><Text style={styles.smallButtonText}>Discard Changes</Text></TouchableOpacity>
                <TouchableOpacity style={styles.smallButton} onPress={saveChanges}><Text style={[styles.smallButtonText, {fontWeight: 'bold'}]}>Save Changes</Text></TouchableOpacity>
            </View>
            
                <CustomButton title='Logout' onPress={Logout}/>
            </View>
            </TouchableWithoutFeedback>

            
        )
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'MarkaziText_500Medium',
    },

    subtitle: {
        fontSize: 26,
        fontWeight: 'bold',
        margin: 10,
        alignSelf: 'flex-start',
        fontFamily: 'MarkaziText_500Medium',

    },

    inputField: {
        borderWidth: 1,
        borderColor: 'gray',
        width: 250,
        height: 40,
        borderRadius: 5,
        padding: 5,
        margin: 10,
        fontFamily: 'Karla_400Regular',

    },

    bottomContainer: {
        justifyContent: 'flex-start',
        margin: 5,

    },

    preferenceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
    
    },

    preferenceText: {
        fontSize: 14, 
        fontFamily: 'Karla_400Regular',
    },

    switch: {
        transform: [{ scaleX: .8 }, { scaleY: .8 }]
    },

    smallButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: 10,
        alignSelf: 'center',
    },

    smallButton: {

        width: smallButtonWidth,
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor: colors.llgreen,
        alignSelf: 'center',
        margin: smallButtonMargin,
        
    },

    smallButtonText: {
        fontSize: 14,
        alignSelf: 'center',
        color: 'white',
        fontFamily: 'Karla_700Bold',

    },

    photoPlaceholder: {
        backgroundColor: colors.llgreen,
        borderRadius: 75,
        overflow: 'hidden',
        width: 75,
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },

    photoPlaceholderText: {

        fontSize: 25,
        alignSelf: 'center',
        color: 'white',
        fontWeight: 'bold',
    },

    image: {
        width: 75,
        height: 75,
      }

    

})

export default Profile;