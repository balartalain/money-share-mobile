import React, {useState, useEffect, useRef} from 'react'
import { SafeAreaView, ScrollView, View, TouchableOpacity, Pressable, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { Avatar } from "react-native-elements";
import Constants from 'expo-constants';
import MonthsTabView from './components/MonthsTabView';
import Menu from './components/Menu';

import FakeData from './components/FakeData';

const getFakeYears = ()=>{
  return Object.keys(FakeData);  
}
const getFakeYearData = (year) =>{
  return FakeData[year];
}
const Header = ()=>{
  return (
    <View style={{
      flex:'1 1' , 
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor:'#3EB489',
      paddingVertical: 10,
      paddingHorizontal: 20
    }}
    >
      <Text style={{fontSize:18, color: 'white'}}>Money share</Text>
      <Avatar
        rounded
        overlayContainerStyle={{backgroundColor: 'gray'}}
        size="medium"
        title="BP"
        onPress={() => console.log("Works!")}
        activeOpacity={0.7}        
      />
    </View>
  )
}
const App = () =>{
  const [index, setIndex] = useState(0);
  const onSelectedItem = (i) => {
    setIndex(i);
    console.log('onSelectedItem '+ i);
  }
    return (
      <SafeAreaView style={styles.container}>
        <Header/>
        <Menu items={getFakeYears()} selectedItem={2} onSelectedItem={onSelectedItem}/>
        <MonthsTabView  data={getFakeYearData(Object.keys(FakeData)[index]) }  index={index}/>         
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