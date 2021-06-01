import React, {useState, useEffect, useRef} from 'react'
import { SafeAreaView, ScrollView, View, TouchableOpacity, Pressable, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import Constants from 'expo-constants';
import YearsTabView from './components/YearsTabView';
import Menu from './components/Menu';

const App = () =>{
  
    return (
      <SafeAreaView style={styles.container}>
        <Menu />
        {
          //<YearsTabView /> 
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