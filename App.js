import React, {useState, useEffect, useRef} from 'react'
import { SafeAreaView, ScrollView, View, TouchableOpacity, Pressable, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Constants from 'expo-constants';
import MainScreen from './components/MainScreen';
import Profile from './components/Profile'


// import FakeData from './components/FakeData';

// const getFakeYears = ()=>{
//   return Object.keys(FakeData);  
// }
// const getFakeYearData = (year) =>{
//   return FakeData[year];
// }
const Stack = createStackNavigator();
const App = () =>{

    return (
      <SafeAreaView style={styles.container}>  
        <NavigationContainer>
          <Stack.Navigator
            >
            <Stack.Screen name="Home" component={MainScreen} 
              options={{  headerShown: false }}
            />
            <Stack.Screen name="AddExpense" component={Profile} />
          </Stack.Navigator>
        </NavigationContainer>    
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