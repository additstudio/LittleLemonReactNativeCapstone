import {TouchableOpacity} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {colors} from './Colors';

export const BackButton = ({navigation}) => {
    return(
        <TouchableOpacity onPress={() => navigation.goBack()} >
        <Ionicons name="arrow-back-circle-sharp" size={28} color={colors.llgreen} />
        </TouchableOpacity>
    )
}