import React, {useState, useEffect, useRef} from 'react'
import { SafeAreaView, ScrollView, View, TouchableOpacity, Pressable, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Constants from 'expo-constants';
import MainScreen from './components/MainScreen'
import AddExpense from './components/AddExpense'
import AsyncStorageHelper  from './AsyncStorageHelper'

const Stack = createStackNavigator();
const App = () =>{
  const [loggedUser, setLoggedUser] = useState(null);
  const a = async function(){
    //AsyncStorageHelper.saveItem('loggeduser', 'balartalain')
    await AsyncStorageHelper.saveItem('loggeduser', 'balartalain');
    const _loggedUser = await AsyncStorageHelper.getItem('loggeduser');
    setLoggedUser('balartalain')
  }
  useEffect(()=>{
    a();
  }, [])
    return (
      <SafeAreaView style={styles.container}>  
        { loggedUser && 
        <NavigationContainer>
          <Stack.Navigator
            >
            <Stack.Screen name="Home" component={MainScreen} 
              options={{  headerShown: false }}
              initialParams={{ loggedUser: loggedUser }}
            />
            <Stack.Screen name="AddExpense" 
            options={{ title: 'Nuevo Gasto' }}
            component={AddExpense} />
          </Stack.Navigator>
        </NavigationContainer>   
        } 
      </SafeAreaView>
    );  
}
const styles = StyleSheet.create({    
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
export default App;