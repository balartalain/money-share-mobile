import React, {useState, useEffect, useRef} from 'react'
import { View, Button, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import { color } from './../utils'
import Menu from './Menu';
import MonthsTabView from './MonthsTabView';

import FakeData from './FakeData';
const getFakeYears = ()=>{
  return Object.keys(FakeData);  
}
const getFakeYearData = (year) =>{
  return FakeData[year];
}

const Header = ()=>{
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: color.primaryGreen,
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

const MainScreen = ({navigation}) => {
    const [index, setIndex] = useState(0);
    const onSelectedItem = (i) => {
      setIndex(i);
      console.log('onSelectedItem '+ i);
    }
    return (
      <View style={{flex:1}}>
        <Header/>
        <Menu items={getFakeYears()} selectedItem={index} onSelectedItem={onSelectedItem}/>
        <MonthsTabView navigation={navigation}  data={getFakeYearData(Object.keys(FakeData)[index]) }  index={index}/>  
      </View>
    );
  };  
  export default MainScreen;