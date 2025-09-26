import {View, StyleSheet, Platform, TouchableHighlight, Text} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {colors} from './Colors';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const CartIcon = ( {onPress} ) => {

    const [counterQty, setCounterQty] = useState(0)
    const [isLoading, setIsLoading] = useState(true);

    const getCounter = async () => {
        
        try {
            const savedOrder = await AsyncStorage.getItem('SavedOrderList')
    
            if (savedOrder !== null) {
    
                const orders = JSON.parse(savedOrder)

                const totalOrderQty = orders.reduce((accumulator, currentItem) => {
                    return accumulator + currentItem.qty;
                  }, 0)

                setCounterQty(totalOrderQty)
                }
            }
        
        catch (e) {
            console.log('counter error', e)
        }
        finally {
            console.log(counterQty)
            setIsLoading(false)
        }
        
    }

    useEffect(() => {

    getCounter();

    },[])
    


    return(
        !isLoading &&
        <>
        <TouchableHighlight onPress={onPress} >
        <View style={styles.container}>
        <View style={styles.iconContainer}>
        <FontAwesome5 name="shopping-cart" size={20} color='white' style={{alignSelf:'center'}}/>
        </View>
        <View style={styles.counterContainer}><Text style={styles.counterText}>{counterQty}</Text></View>
        </View>
        </TouchableHighlight>
        </>
    )
}


const styles = StyleSheet.create({

    container: {
        position: 'absolute',
        bottom: 100,
        right: 50,
        justifyContent: 'center',
        alignItems: 'center',
    
    },

    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderColor: colors.llyellow,
        borderWidth: 3,
        backgroundColor: colors.llgreen,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
    },

    counterContainer: {
        width: 20,
        height: 20,
        borderRadius: 50,
        backgroundColor: 'red',
        overflow: 'hidden',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        position: 'absolute',
        top: 1,
        
    },

    counterText: {
        fontSize: 12,
        fontFamily: 'Karla_400Regular',
        color: 'white',
        alignSelf: 'center'
    }

})