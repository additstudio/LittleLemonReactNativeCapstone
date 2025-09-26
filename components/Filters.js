import {Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import {colors} from './Colors'

export const Filters = ( { onChange, selections, categories } ) => {

    return(
        <View style={styles.filtersContainer}>
            { categories.map( (category, index) => (
                <TouchableOpacity key={index} style={[styles.button, {backgroundColor: selections[index] ? colors.llyellow : colors.llgrey} ]} onPress={() => onChange(index)} ><Text style={styles.buttonText}>{category}</Text></TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 100,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        margin: 5,
    },

    buttonText: {
        fontSize: 16,
        alignSelf: 'center',
        fontFamily: 'Karla_700Bold',
        color: colors.llgreen,

    },

    filtersContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft:10,
        marginBottom: 10,
        borderBottomColor: colors.llgrey,
        borderStyle: 'solid',
        borderBottomWidth: 1,

      },
})
