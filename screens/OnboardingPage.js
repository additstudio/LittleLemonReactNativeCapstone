import { Text, View, TextInput, Pressable, StyleSheet,Alert, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {useState, useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../components/Colors';
import { validateEmail, validateAlpha } from '../components/ValidateUser';
import { CustomButton } from '../components/CustomButton';


const OnboardingPage = ( {navigation}) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const saveUser = async(name,email) => {

        if (name === '' || email === '') {
            Alert.alert('User Details cannot be empty')
        } else if (!validateEmail(email)) {
            Alert.alert('Please enter a valid email address.')
        } else if (!validateAlpha(name)) {
            Alert.alert('Please enter a valid first name.')
        }
        else {
        try {
            await AsyncStorage.setItem('userFirstName', name)
            await AsyncStorage.setItem('userEmail', email)
        }
        catch(e) {
            console.error('Error in saving user details:', e)
        }
        finally {
            navigation.navigate('Home')
        }
    }
    }

    return(

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style ={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
                <View style={styles.innerContainer}><Text style ={styles.title}>Let us get to know you!</Text>
                <TextInput style={styles.inputField} placeholder='Your First Name' value={name} onChangeText={setName} clearButtonMode='always'/>
                <TextInput style={styles.inputField} placeholder='Your Email' value={email} onChangeText={setEmail} clearButtonMode='always' keyboardType='email-address'/>
                </View>
                <CustomButton title='Next' onPress={() => saveUser(name, email)}/>
         </KeyboardAvoidingView>

        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        alignItems: 'center',
    },

    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        fontSize: 35,
        margin: 10,
        fontFamily: 'MarkaziText_500Medium',
        color: colors.llgreen,
        alignSelf: 'center',
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

    }

})

export default OnboardingPage;