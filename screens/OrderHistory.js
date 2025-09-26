import {Text, View, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {useState, useEffect} from 'react';
import { CustomButton } from '../components/CustomButton';
import { colors } from '../components/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dateFormatter } from '../components/dateFormatter';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const OrderHistory = ({navigation}) => {

    const [orderHistory, setOrderHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const getHistory = async () => {
        try {
            const orderHistory = await AsyncStorage.getItem('OrderHistory');
            if (orderHistory !== null) {

                const jsonHistory = JSON.parse(orderHistory)
                const sortedHistory = [...jsonHistory].sort((a, b) => {
                    const dateA = new Date(a.orderTime);
                    const dateB = new Date(b.orderTime);
                    return dateB.getTime() - dateA.getTime();
                  });

                setOrderHistory(sortedHistory)
            }
        }
        catch(e) {
            console.error('Error loading order history', e)
        }
        finally {
            setIsLoading(false)
        }
    }

    const Item = ( { orderTime, orderNum, orderDetails}) => (
        <TouchableOpacity onPress={() => navigation.navigate('OrderHistoryDetails', { orderTime, orderNum, orderDetails})}>
        <View style={styles.innerContainer}>
        <MaterialCommunityIcons name="invoice-list-outline" size={48} color={colors.llgreen} />
        <View style={styles.menuItemContainer}>
            <Text style={styles.menuItemDes}>Order Date: {dateFormatter.format(orderTime)} </Text>
            <Text style={styles.menuItemDes}>Order Number: {orderNum} </Text>
            <Text style={styles.menuItemDes}>Total Order Amt: ${
                orderDetails.reduce((accumulator, currentItem) => accumulator + currentItem.price * currentItem.qty, 0)
                }</Text>
            <Text></Text>
        </View>
        </View>
        </TouchableOpacity>
    )

    const renderItem = ( { item } ) =>
        <Item orderTime={item.orderTime} orderNum={item.orderNum} orderDetails={item.order} />
      
    useEffect(() => {

        getHistory()

    },[])
    return (

        !isLoading &&
        <>
        <View style={styles.container}>
            <Text style={styles.title}>Order History</Text>
            <FlatList data={orderHistory} keyExtractor={ (id, index) => id + index} renderItem={renderItem} ListEmptyComponent={<Text>No Order History.</Text>}/>
        </View>
        <View>
            <CustomButton title='Back to Home' onPress={() => navigation.navigate('Home')} />
        </View>
        </>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    innerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 20,
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

    menuItemTitle: {
        fontSize: 20,
        color: colors.llgreen,
        fontWeight: 'bold',
        marginTop: 7,
        marginBottom: 5,
        fontFamily: 'Karla_700Bold',

    },

    menuItemDes: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'Karla_400Regular',
        marginBottom: 5,
        
    },

    menuItemPrice: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'Karla_700Bold',
    },


})

export default OrderHistory;