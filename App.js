import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, Pressable, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer, useNavigation} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingPage from './screens/OnboardingPage';
import Home from './screens/Home';
import Profile from './screens/Profile';
import LogoHeader from './components/LogoHeader';
import SplashScreen from './screens/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuItem from './screens/MenuItem';
import Cart from './screens/Cart';
import OrderHistory from './screens/OrderHistory';
import { useEffect, useState } from 'react';
import ProfilePhoto from './components/ProfilePhoto';
import { useFonts } from '@expo-google-fonts/markazi-text/useFonts';
import { MarkaziText_400Regular, MarkaziText_500Medium } from '@expo-google-fonts/markazi-text/';
import { Karla_400Regular, Karla_700Bold } from '@expo-google-fonts/karla';
import { SQLiteProvider } from 'expo-sqlite';
import { BackButton } from './components/BackButton';
import OrderHistoryDetails from './screens/OrderHistoryDetails';

export default function App() {

  const Stack = createNativeStackNavigator();
  
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  let [fontsLoaded] = useFonts({
    MarkaziText_400Regular,
    MarkaziText_500Medium,
    Karla_400Regular,
    Karla_700Bold
  });

const LoginStatus = async() => {

  try {
      const loginName = await AsyncStorage.getItem('userFirstName')
      if (loginName !== null) {
        setIsLoggedIn(true)
      }
      else setIsLoggedIn(false)
  }
  catch(e) {
      console.error('Cannot retreive user info', e)
  }
  finally{
    setIsLoading(false)
  }
}

useEffect(() => {
  
    LoginStatus();

},[])

return (
  <SQLiteProvider databaseName='little_lemon' onInit={async(db) => {

    try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        desc TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL
      );
      PRAGMA journal_mode=WAL;
    `)
    }
    catch(e) {
      console.error('create database error', e)
    }

    finally {
    console.log('table created')
    }
  }}>

  {isLoading && !fontsLoaded ? < SplashScreen/> : 

    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn? 'Home' : 'Login'} 
      screenOptions={{headerTitle: (props) => <LogoHeader {...props}/>}} >
        <Stack.Screen name='Login' component={OnboardingPage} options= {{headerBackVisible: false}}/>
        <Stack.Screen name='Home' component={Home} options={ ( {navigation}) => ({headerBackVisible: false, 
        headerRight:() => <ProfilePhoto navigation={navigation}/> })}/>
        <Stack.Screen name='Profile' component={Profile} options= {{headerBackVisible: false}}/>
        <Stack.Screen name='MenuItem' component={MenuItem} options={ ( {navigation} ) => ({
              headerLeft: () => <BackButton navigation={navigation}/>})}/>
        <Stack.Screen name='Cart' component={Cart} options={ ( {navigation} ) => ({
              headerLeft: () => <BackButton navigation={navigation}/>})}/>
        <Stack.Screen name='OrderHistory' component={OrderHistory} options={{headerBackVisible: false}}/>
        <Stack.Screen name='OrderHistoryDetails' component={OrderHistoryDetails} options={ ( {navigation} ) => ({
              headerLeft: () => <BackButton navigation={navigation}/>})}/>
      </Stack.Navigator>
    </NavigationContainer>
}
  
    </SQLiteProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
