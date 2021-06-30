import React, {useState, useEffect, useRef} from 'react'
import { SafeAreaView, ScrollView, View, TouchableOpacity, Pressable, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Constants from 'expo-constants';
import MainScreen from './components/MainScreen'
import AddExpense from './components/AddExpense'
import FacebookLogin from './components/FacebookLogin';
import AsyncStorageHelper  from './AsyncStorageHelper'
import {registerUser} from './controllers'
import Users from './components/Users';
import ExpenseList from './components/ExpenseList';

const Stack = createStackNavigator();
const App = () =>{
  const [userInfo, setUserInfo] = useState(null);
  const success = (_userInfo)=>{    
    AsyncStorageHelper.saveItem('token', _userInfo.token);
    registerUser({
      id: _userInfo.id,
      name: _userInfo.name,
      email: _userInfo.email
    }).then(result=>{
      AsyncStorageHelper.saveObject('me', _userInfo);
      setUserInfo(_userInfo);
    }).catch(err=>alert('Error de conexión'));
    
  }
  useEffect(()=>{
    const checkUser = async()=>{
      let _userInfo = null;      
      //const _userInfo = await AsyncStorageHelper.getObject('me');
      if (_userInfo != null){
        setUserInfo(_userInfo);
      }
    }
    checkUser();
  }, [])
    return (
      <SafeAreaView style={styles.container}>  
        { userInfo ?(
            <NavigationContainer>
              <Stack.Navigator
                >
                <Stack.Screen name="Home" component={MainScreen} 
                  options={{  headerShown: false }}              
                />
                <Stack.Screen name="AddExpense" 
                options={{ title: 'Nuevo Gasto' }}
                component={AddExpense} />
                <Stack.Screen name="Users" 
                options={{ title: 'Usuarios' }}
                component={Users} />
              </Stack.Navigator>              
            </NavigationContainer>              
        ):<FacebookLogin onSuccess={success} /> 
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