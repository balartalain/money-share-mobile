import React, {useState, useEffect, useRef} from 'react'
import { View, Button, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Avatar } from "react-native-elements";
import { color, currentMonth } from './../utils'
import Menu from './Menu';
import MonthsTabView from './MonthsTabView';
import { getUserData } from '../controllers/index';
import {currentYear, equalsIntegers} from '../utils';

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
const MainScreen = ({navigation, route}) => {
    const { params } = route;
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [years, setYears] = useState([]);
    const [loadedYears, setLoadedYears] = useState(false);
    const [monthData, setMonthData] = useState({});
    const [userData, setUserData] = useState({});
    
    const getAsyncPromise = async (promiseArray)=>{
        const response = await Promise.all(promiseArray.map(f=>f()))
        //console.log(response)
        return response;
    }
    useEffect(()=>{
      if (params && params.data){
        params.data = null;
        setMonthData(userData[currentYear]);
        console.log(monthData)
      }
    })
    useEffect(()=>{
      (async () => {
        const userData = await getUserData('balartalain');
        const _years = Object.keys(userData);  
        const index = _years.findIndex((e)=>equalsIntegers(e, currentYear));  
        if (index === -1){
          _years.push(currentYear);
        }
        _years.sort();               
        setYears(_years);
        setUserData(userData);
        setMonthData(userData[currentYear]);
        setLoadedYears(true);
      })()            
    }, [])
    const onSelectedItem = (item) => {
      setSelectedYear(item); 
      setMonthData(userData[item]);
    }
    return (
      <View style={{flex:1}}>
        <Header/>        
        { !loadedYears ?
          (
            <View style={{flex:1}}>            
              <View style={{flex:1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color={color.primaryGreen}/>
              </View>
            </View>
          )
          :(
            <View style={{flex:1}}>
              <Menu items={years} selectedItem={selectedYear} onSelectedItem={onSelectedItem}/> 
              <MonthsTabView navigation={navigation} selectedYear={selectedYear}  data={monthData}  index={currentMonth}/>
            </View>
           )
        }
      </View>
    );
  };  
  export default MainScreen;


  // const getAsyncPromise = async (promiseArray)=>{
  //   const response = await Promise.all(promiseArray.map(f=>f()))
  //   //console.log(response)
  //   return response;
  // }
  //   const [_years, monthdata] = await getAsyncPromise([ ()=>getUserYears('balartalain'), 
  //                     ()=>getMonthData('balartalain', currentYear, currentMonth+1)
  //                   ]);