import {  Text, View, Pressable,TouchableOpacity, Image, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as React from 'react';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { colors } from '../components/Colors'
import * as SQLite from 'expo-sqlite';
import {useSQLiteContext} from 'expo-sqlite';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Filters } from '../components/Filters';
import debounce from 'lodash.debounce';
import { CartIcon } from '../components/CartIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ( {navigation}) => {

    const db= useSQLiteContext();
    
    const [menu, setMenu] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchBarText, setSearchBarText] = useState('')
    const categories = ['starters', 'mains', 'desserts']
    const [filterSelections, setFilterSelections] = useState(
        categories.map(() => false)
      );
    const [query, setQuery] = useState('');

    function useUpdateEffect(effect, dependencies = []) {
        const isInitialMount = useRef(true);
      
        useEffect(() => {
          if (isInitialMount.current) {
            isInitialMount.current = false;
          } else {
            return effect();
          }
        }, dependencies);
      }

    const FilterSection = () => {
        return (
            <View style={styles.filterView}>
            <Text style={styles.filterTitle}>Order for Delivery</Text>
            <Filters 
            selections={filterSelections} 
            onChange={handleFiltersChange}
            categories={categories}/>
            </View>
        )
    }

    const handleFiltersChange = async (index) => {
        const arrayCopy = [...filterSelections];
        arrayCopy[index] = !filterSelections[index];
        setFilterSelections(arrayCopy);
      };


    const sortMenu = (menuItems) => {

        const sorted = [...menuItems].sort((a, b) => 
        a.name.localeCompare(b.name)
      );

      return sorted
    } 
    

    const loadTable = async () => {

        try {
            const results = await db.getAllAsync(`SELECT * FROM menu`);
            return results;
        }
        catch (e) {
            console.error('Loading database error', e)
        }
        }
    

    const saveTable = async (menuItems) => {

        try {

        const insertPromises = menuItems.map(dish => {
            return db.runAsync(
              `INSERT INTO menu (name, desc, price, category, image) VALUES (?,?,?,?,?);`,
              [dish.name, dish.desc, dish.price, dish.category, dish.image]
            );
          });
          await Promise.all(insertPromises);
          console.log('Dishes Saved');
        }
        catch (e) {
            console.log('saving table error', e)
        }

    }

    const fetchMenu = async () => {

        try {
            
            const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
            const json = await response.json();
            const jsonMenu = json.menu.map(dish => ({
                name: dish.name,
                desc: dish.description,
                price: dish.price,
                category: dish.category,
                image: 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/'+dish.image+'?raw=true'
            }));

            return jsonMenu
            
        }
        catch(e) {
            console.error('error fetchiing menu', e)
        }

    }

    const Item = ( {name, price, desc, image, category}) => (
        <TouchableOpacity onPress={() => navigation.navigate('MenuItem', {name: name, desc: desc, price: price, image: image})}>
        <View style={styles.menuItemContainer}>
            <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemTitle}>{name}</Text>
            <Text style={styles.menuItemDes}>{desc}</Text>
            <Text style={styles.menuItemPrice}>$ {price.toFixed(2)} </Text>
            </View>
            <View style={styles.menuImageContainer}>
                <Image style ={styles.menuImage} source={{uri: image}} />
            </View>
        </View>
        </TouchableOpacity>
    )

    const renderItem = ({item }) => 
        <Item  
            name={item.name} 
            price={item.price} 
            desc={item.desc}
            image={item.image}
            category={item.category}
    />

    useEffect(() => {

    (async () => {
        try {
            let menuItems = await loadTable();
            if (menuItems === null) {
                const menuItems = await fetchMenu();
                saveTable(menuItems)
                console.log('Menu fetched from server.')
            } else {
                console.log('Saved Menu loaded from SQLite')
            }
            
            const sorted = sortMenu(menuItems);
            setMenu(sorted)

        }
        catch(e) {
            console.error('initial load table error', e)
        }
        finally {
            setIsLoading(false)
        }
})()

},[]);

useUpdateEffect(() => {
    (async () => {
      const activeCategories = categories.filter((c, i) => {
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );

        const sorted = sortMenu(menuItems)
        setMenu(sorted);

      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

 const filterByQueryAndCategories = async (query, activeCategories) => {

    const cat = activeCategories;
    const searchedText = query.trim();
  
    const conditions = [];
    const values = [];
  
    const placeholders = cat.map(() => "(?)").join(", ");
  
    if (searchedText) {
      conditions.push('name LIKE ?');
      values.push(`%${searchedText}%`)
    }
  
    if (cat.length > 0) {
      conditions.push(`category in (${placeholders})`)
      values.push(...cat)
    }
  
    const filterStatements = conditions.length ? "where " + conditions.join(" and ") : '';
  
    const sql = `SELECT * FROM menu ${filterStatements}`;


    try {
        const filteredResults = await db.getAllAsync(sql, values);
        return filteredResults;

    } catch (e) {
        console.error('error in filtering menu', e)
    }
  }


    return(

    
    !isLoading && 
    <>
    <KeyboardAvoidingView style ={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.headerContainer}>
                <View style={styles.titleContainer}>
                <Text style={styles.title}>Little Lemon</Text>
                <Text style={styles.subtitle}>Chicago</Text>
                </View>
                <View style={styles.desContainer}>
                    <Text style={styles.restDesc}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                    <Image style={styles.coverPhoto} source={require('../assets/coverphoto.jpg')} />
                </View>
            </View>
    </TouchableWithoutFeedback>
    <View style = {styles.searchBarViewContainer} >
        <View style={styles.searchBarView}>
        <FontAwesome name="search" size={16} color={colors.llgrey} style={{padding: 10}} />
        <TextInput style={styles.searchBar} placeholder='Search Menu...' placeholderTextColor={colors.llgrey} value={searchBarText} onChangeText={handleSearchChange} clearButtonMode='always' />
        </View>
    </View>
    <View style={styles.menuContainer}>
    <FilterSection />
    <FlatList data={menu} renderItem={renderItem} keyExtractor={(id, index) => id + index} ListEmptyComponent={<View style={{margin: 5}}><Text style={styles.menuItemDes}>No menu items found.</Text></View>} />
    </View>
    <CartIcon onPress={() => navigation.navigate('Cart', {})}/>
    </KeyboardAvoidingView>
    </>


    )
}

const styles = StyleSheet.create({

    container: {
        flex: 10,
        flexDirection: 'column',

    },

    headerContainer: {
        flex: 3.5,
        backgroundColor: colors.llgreen,
        paddingBottom: 10,

    },

    menuContainer: {
        flex: 5,
        justifyContent: 'center',
        backgroundColor: 'white',
    },

    titleContainer: {
        margin: 10,
        alignContent: 'flex-start'
    },

    title: {
        fontSize: 50,
        color: colors.llyellow,
        fontWeight: 'bold',
        fontFamily: 'MarkaziText_500Medium',
        margin: 0,
    },
    
    subtitle: {
        fontSize: 36,
        color: colors.llgrey,
        fontFamily: 'MarkaziText_400Regular',
        marginTop: 0,

    },

    desContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 150,
        
    },

    restDesc: {
        fontSize: 18,
        color: 'white',
        padding: 10,
        width: 220,
        fontFamily: 'Karla_700Bold',
        textAlign: 'auto',

    },

    coverPhoto: {
        flex: 1,
        width: 150,
        height: 160,
        resizeMode: 'cover',
        borderRadius: 10,
        margin: 10,
    },

    menuItemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        borderBottomColor: colors.llgrey,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        padding: 20,
        backgroundColor: 'white',
    },

    menuTextContainer: {
        flex: 2.5,
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

    menuImage: {
        width: 90,
        height: 90,
        borderRadius: 8,
        resizeMode: 'cover',
        alignSelf: 'center'
    },

    menuImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        margin: 10,
        
    },

    searchBar: {
        width: '90%',
        height: 40,
        padding: 5,
        fontFamily: 'Karla_400Regular',
        color: 'white',
        fontSize: 16,
    

    },

    searchBarView: {
        borderWidth: 2,
        borderColor: 'white',
        width: '95%',
        height: 'auto',
        borderRadius: 8,
        margin: 10,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        
    },

    searchBarViewContainer: {
        backgroundColor: colors.llgreen,
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 'auto',
    },

    filterView: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'white',
    },

    filterTitle: {
        fontSize: 16,
        color: colors.llgreen,
        fontFamily: 'Karla_700Bold',
        alignSelf: 'flex-start',
        marginLeft: 10,
        padding: 5,
    }


})

export default Home;