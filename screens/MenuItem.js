import {View, Text, Image, StyleSheet} from 'react-native';
import { colors } from '../components/Colors'
import { CustomButton } from '../components/CustomButton';
import { CartIcon } from '../components/CartIcon';

const MenuItem = ( {route, navigation}) => {

    const {name, desc, price, image} = route.params

    const buttonTitle = 'Add to Order - $' + price.toFixed(2)

    return (
        <View style={styles.container}>
            <View>
            <Image source={{uri: image}} style={styles.image} />
            <Text style={styles.menuItemTitle}>{name}</Text>
            <Text style={styles.menuItemDes}>{desc}</Text>
            </View>
            <CustomButton title={buttonTitle} onPress={() => navigation.navigate('Cart', {name, price})} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
    },

    image: {
        width: '100%',
        height: '60%',
        resizeMode: 'cover'
    },

    menuItemContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

    },

    menuItemTitle: {
        fontSize: 20,
        color: colors.llgreen,
        fontWeight: 'bold',
        marginTop: 7,
        marginBottom: 5,
        fontFamily: 'Karla_700Bold',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

    },

    menuItemDes: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'Karla_400Regular',
        marginLeft: 20,
        marginRight: 20,
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        
    },

    menuItemPrice: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'Karla_700Bold',
    },

})

export default MenuItem;