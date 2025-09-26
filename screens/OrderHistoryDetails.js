import {View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import {useState, useEffect} from 'react'
import { CustomButton } from '../components/CustomButton'
import {colors} from '../components/Colors'
import { dateFormatter } from '../components/dateFormatter'
import AsyncStorage from '@react-native-async-storage/async-storage'

const dimensions = Dimensions.get('window');
const smallButtonWidth = dimensions.width * 0.375;
const smallButtonMargin = dimensions.width * 0.025;

const OrderHistoryDetails = ( {route, navigation}) => {
    const {orderDate, orderNum, orderDetails} = route.params

    const Item = ( {name, price, qty} ) => (
    
        <View style={styles.menuItemContainer}>
            <View style={styles.menuItemTitleContainer}>
            <Text style={styles.menuItemTitle}>{name}</Text>
            </View>
            <View style={styles.menuItemQtyContainer}>
            <Text style={styles.menuItemQty}>{qty}</Text>
            </View>
            <View style={styles.menuItemPriceContainer}>
            <Text style={styles.menuItemPrice}>$ {(price*qty).toFixed(2)}</Text>
            </View>
        </View>
    
    )
    
    const renderItem = ( {item} ) =>
        <Item name={item.name} price={item.price} qty={item.qty} />

    
    const copyToCart = async () => {

        try {
            const stringifyList = JSON.stringify(orderDetails)
            await AsyncStorage.setItem('SavedOrderList', stringifyList)
        }
        catch (e) {
            console.log('copy to cart error', e)
        }
        finally {
            navigation.navigate('Cart',{})
        }

    }
    
    const totalOrderQty = orderDetails.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.qty;
      }, 0)
    
    const totalOrderAmount = orderDetails.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.price * currentItem.qty;
    
      }, 0)

    return (
        <View style={styles.container}>
        <View>
            <Text style={styles.title}>Your Order Number #{orderNum}</Text>
            <Text style={styles.orderDate}>Order date: {dateFormatter.format(orderDate)}</Text>
        </View>
            <FlatList data={orderDetails} keyExtractor={(id, index) => id + index} renderItem={renderItem} />
            <View style={styles.totalContainer}>
            <View style={styles.totalItemRowContainer}>
            <View style={styles.totalTitleContainer}><Text style={styles.totalItemTitle}>Total Order Qty:</Text></View>
            <View style={styles.totalItemContainer}><Text style={styles.totalText}>{totalOrderQty}</Text></View>
            </View>
            <View style={styles.totalItemRowContainer}>
            <View style={styles.totalTitleContainer}><Text style={styles.totalItemTitle}>Total Order Amt:</Text></View>
            <View style={styles.totalItemContainer}><Text style={styles.totalText}>$ {totalOrderAmount.toFixed(2)}</Text></View>
            </View>
            </View>
        <CustomButton title='Order Again' onPress={copyToCart} />
        </View>

    )
}

const styles = StyleSheet.create( {
    container: {
        flex: 5,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 5,
        fontFamily: 'MarkaziText_500Medium',
    },

    orderDate: {

        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        fontFamily: 'Karla_400Regular',
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginBottom: 20,

    },

    menuItemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
        borderBottomColor: colors.llgrey,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        marginLeft: 20,
        marginRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'white',
    },

    menuItemTitleContainer: {
        flex: 2,
    },

    menuItemQtyContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },

    menuItemPriceContainer: {
        flex: 1.5,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        
    },

    totalContainer: {
        flex: 3,
        width: '60%',
        margin: 20,
        alignSelf: 'flex-end',
    },

    totalItemRowContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
        alignSelf: 'flex-end',

    },

    totalItemContainer: {
        flex: 1,

    },

    totalTitleContainer: {
        flex: 2,

    },

    totalText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        fontFamily: 'Karla_400Regular',
        alignSelf: 'flex-end',
    },

    menuItemTitle: {
        fontSize: 16,
        color: colors.llgreen,
        fontWeight: 'bold',
        fontFamily: 'Karla_400Regular',

    },

    menuItemQty: {
        fontSize: 16,
        color: colors.llgreen,
        fontFamily: 'Karla_400Regular',
        alignSelf: 'center',
    },

    menuItemPrice: {
        fontSize: 16,
        color: colors.llgreen,
        fontFamily: 'Karla_400Regular',
        alignSelf: 'flex-end'
        
    },

    totalItemTitle: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        fontFamily: 'Karla_400Regular',
    },

    smallButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: 20,
        position: 'absolute',
        bottom: 70,
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
})

export default OrderHistoryDetails;