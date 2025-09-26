import { View, Text, TouchableOpacity, FlatList, StyleSheet,Dimensions, Modal, Alert} from 'react-native';
import { useState, useEffect } from 'react';
import { colors } from '../components/Colors';
import { CustomButton } from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';

const dimensions = Dimensions.get('window');
const smallButtonWidth = dimensions.width * 0.375;
const smallButtonMargin = dimensions.width * 0.025;

const Cart = ({ route, navigation }) => {

    const {name, price} = route.params
    const [orderList, setOrderList] = useState([])
    const [orderRef, setOrderRef] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [updateModalVisible, setUpdateModalVisible] = useState(false)

const Item = ( {name, price, qty} ) => (
    
    <View style={styles.menuItemContainer}>
        <View style={styles.menuItemTitleContainer}>
        <Text style={styles.menuItemTitle}>{name}</Text>
        </View>
        <View style={styles.menuItemQtyContainer}>
        <Entypo name="circle-with-minus" size={16} color={colors.llyellow} style={{alignSelf: 'center', paddingRight: 5}} onPress={() => minusQty(name)}/>
        <Text style={styles.menuItemQty}>{qty}</Text>
        <Entypo name="circle-with-plus" size={16} color={colors.llyellow} style={{alignSelf: 'center', paddingLeft: 5}} onPress={() => addQty(name)}/>
        </View>
        <View style={styles.menuItemPriceContainer}>
        <Text style={styles.menuItemPrice}>$ {(price*qty).toFixed(2)}</Text>
        <Entypo name="circle-with-cross" size={16} color={colors.llgreen} style={{alignSelf: 'center', paddingLeft: 5}} onPress={() => deleteItem(name)}/>
        </View>
    </View>

)

const renderItem = ( {item} ) =>
    <Item name={item.name} price={item.price} qty={item.qty} />

const saveList = async( updatedList ) => {
    const stringifyList = JSON.stringify(updatedList)
    await AsyncStorage.setItem('SavedOrderList', stringifyList)
    console.log('item saved!', stringifyList)
}

const confirmOrder = (totalOrderQty) => {

    if (totalOrderQty > 0) {
        submitOrder();
        setUpdateModalVisible(true)
    }
    else {
        Alert.alert('There are no items in the order.')
    }
}

const clearOrder = async () => {
    try {
        await AsyncStorage.removeItem('SavedOrderList')
        setOrderList([])
    }
    catch (e) {
        console.error('error clearing order', e)
    }
}

const submitOrder = async() => {

    try {
        
        const orderHistory = await AsyncStorage.getItem('OrderHistory')

        if (orderHistory !== null) {

            const jsonHistory = JSON.parse(orderHistory)

            const newOrderNum = jsonHistory.length + 1001;

            const newOrder = {
                orderTime: Date.now(),
                orderNum: newOrderNum,
                order: orderList,
            }

            const updatedOrderHistory = ([...jsonHistory, newOrder])
            
            const stringifyUpdatedHistory = JSON.stringify(updatedOrderHistory)

            await AsyncStorage.setItem('OrderHistory', stringifyUpdatedHistory)

            setOrderRef(newOrderNum)

        } 

        else {

            const newOrder = {
                orderTime: Date.now(),
                orderNum: 1001,
                order: orderList,
            }

            const updatedOrderHistory = ([newOrder])
            
            const stringifyUpdatedHistory = JSON.stringify(updatedOrderHistory)
            
            await AsyncStorage.setItem('OrderHistory', stringifyUpdatedHistory)

            setOrderRef(1001)
        }
    }

    catch (e) {
        console.error('Error updating Order History', e)
    }
}

const deleteItem = ( nameToDelete ) => {
        const updatedList = orderList.filter(item => item.name !== nameToDelete)
        setOrderList(updatedList)
        saveList(updatedList)
}

const minusQty = (nameToMinus) => {

    const updatedList = [];

    for (let i = 0; i < orderList.length; i++) {
      const item = orderList[i];
  
      if (item.name === nameToMinus) {
        if (item.qty > 1) {
          updatedList.push({ ...item, qty: item.qty - 1 });
        }
      } else {
        updatedList.push(item);
      }
    }

      setOrderList(updatedList)
      saveList(updatedList)

}

const addQty = (nameToAdd) => {

    const updatedList = [];

    for (let i = 0; i < orderList.length; i++) {
      const item = orderList[i];
  
      if (item.name === nameToAdd) {
          updatedList.push({ ...item, qty: item.qty + 1 });
      } else {
        updatedList.push(item);
      }
    }

      setOrderList(updatedList)
      saveList(updatedList)

}



useEffect(() => {


    (async () => {

    try {
      
        const savedList = await AsyncStorage.getItem('SavedOrderList')

    
        if (savedList !== null) {
         const jsonList = JSON.parse(savedList)
         console.log('saved list:', jsonList)

         const existingItemIndex = jsonList.findIndex(item => item.name === name);

         if (existingItemIndex !== -1) {
            const updatedList = jsonList.map((item, index) =>
              index === existingItemIndex ? { ...item, qty: item.qty + 1 } : item
            );
            setOrderList(updatedList)
            saveList(updatedList)
            console.log('updated order list:', orderList)
        } else {
            const updatedList = name ? [...jsonList, {name: name, price: price, qty: 1}] : jsonList
            setOrderList(updatedList)
            saveList(updatedList)
            console.log('updated order list:', orderList)
        }
        } else 
         {

            setOrderList(name ? [{name: name, price: price, qty: 1}] : [])
            console.log('updated order list with one item:', orderList)
            saveList(name ? [{name: name, price: price, qty: 1}] : [])
            }
        
    }

    catch(e) {
        console.log('error creating local orderList', e )
    }

    finally {
        setIsLoading(false)
    }
})()
},[])

const totalOrderQty = orderList.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.qty;
  }, 0)

const totalOrderAmount = orderList.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.price * currentItem.qty;

  }, 0)

const handleModalClose = (destination) => {
    setUpdateModalVisible(false)
    navigation.navigate(destination)
    clearOrder();
}

return (

    !isLoading &&
    <View style={styles.container}>
        <Text style={styles.title}>Your Order</Text>
        <FlatList data={orderList} keyExtractor={ (id, index) => id + index} renderItem={renderItem} ListEmptyComponent={<View style={{marginLeft: 20}} ><Text style={styles.menuItemTitle}>Your order is empty.</Text></View>}/> 
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

        <Modal animationType='slide' transparent={true} visible={updateModalVisible} onRequestClose={() => {setUpdateModalVisible(!updateModalVisible)}}>
        
        <View style={styles.modalView}>
            <Text style={styles.title}>Order Confirmed!</Text>
            <Text style={styles.orderNum}>Order Number: {orderRef} </Text>
            <TouchableOpacity style={[styles.smallButton, {backgroundColor: 'grey'}]} onPress={() => handleModalClose('OrderHistory')}><Text style={[styles.smallButtonText, {color: 'white'}]}>Go to Order History</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.smallButton, {backgroundColor: colors.llyellow}]} onPress={() => handleModalClose('Home')}><Text style={[styles.smallButtonText, {color: 'black'}]}>Back to Home</Text></TouchableOpacity>
        </View>

        </Modal>

        <View style={styles.smallButtonContainer}>
            <TouchableOpacity style={[styles.smallButton,{backgroundColor: 'grey'}]} onPress={clearOrder}><Text style={styles.smallButtonText}>Clear Order</Text></TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Home')}><Text style={styles.smallButtonText}>Add More Dishes</Text></TouchableOpacity>
        </View>
        <View>
            <CustomButton title='Confirm Order' onPress={() => confirmOrder(totalOrderQty)} />
        </View>


    </View>

)
}

export default Cart;


const styles = StyleSheet.create({

    container: {
        flex: 5,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        margin: 20,
        fontFamily: 'MarkaziText_500Medium',
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

    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 200,
        marginBottom: 200,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 50,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },

       orderNum: {
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
        fontFamily: 'Karla_700Bold',
        marginBottom: 20,

    },
})