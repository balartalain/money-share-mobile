import React, {useState, useEffect, useRef, memo} from 'react'
import { View, Button, Text, StyleSheet, ActivityIndicator, TouchableOpacity} from "react-native";
import { Avatar } from "react-native-elements";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import AsyncStorageHelper from '../AsyncStorageHelper';
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
  const TotalAmount = React.memo(({totalAmountUSD, totalAmountCUP})=>{
    console.log('TotalAmount')
    return (
      <View style={{flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingVertical: 10
      }}>
      <View><Text style={{fontSize: 18,  fontWeight: 'bold', color: color.primaryGreen}}>{totalAmountUSD} USD</Text></View>
      <View><Text style={{fontSize: 18,  fontWeight: 'bold', color: color.primaryGreen}}>{totalAmountCUP} CUP</Text></View>
    </View>
    )
  })
const MainScreen = ({navigation, route}) => {

    const { params } = route;
    const [appState, setAppState] = useState({
      loggedUser: null,
      selectedMonth: null,
      selectedYear: null,
      years: [],
      loadedData: false,
      userData: null,
      itemsToDelete:[]
    });  
    const calculateTotalAmount = ()=>{
      let totalAmountUSD = 0,
      totalAmountCUP = 0;
      const {userData, selectedYear} = appState;
      if (userData){
        Object.keys(userData[selectedYear]).forEach(m=>{
          const monthData = userData[selectedYear][m];
          Object.keys(monthData).forEach(d=>{          
            Object.keys(monthData[d]).forEach(time=>{   
              let { currency, amount} = monthData[d][time];
                (currency == 'USD')?totalAmountUSD += amount: totalAmountCUP += amount
              })
            })
          })
        }
        return {totalAmountUSD, totalAmountCUP};        
    }
    const getAsyncPromise = async (promiseArray)=>{
        const response = await Promise.all(promiseArray.map(f=>f()))
        //console.log(response)
        return response;
    }
    
    useEffect(()=>{
      if (params && params.newExpense){   
        const {year, month, day, created} = params.newExpense;
          let userData = Object.assign({}, appState.userData),
          currObj = userData;
          [year, month, day].forEach(k=>{
            currObj[k] = currObj[k] || {}
            currObj = currObj[k];  
          })
          currObj[created] = params.newExpense.data;
          AsyncStorageHelper.saveObject(`${ appState.loggedUser }:data`, userData);
          setAppState({...appState, userData})
          //setUserData(_userData);
          params.newExpense = null;
      }
    }, [params] )
    
    const fetchUserData = async () =>{
      let loggedUser = await AsyncStorageHelper.getItem('loggeduser');
      let userData;
      userData =  await AsyncStorageHelper.getObject(`${loggedUser}:data`);
      if (!userData){
        userData = await getUserData(loggedUser) ;   
        await AsyncStorageHelper.saveObject(`${_loggedUser}:data`, userData);        
      }
      const years = Object.keys(userData);  
      const index = years.findIndex((e)=>equalsIntegers(e, currentYear));  
      if (index === -1){
        years.push(currentYear);
      }
      years.sort();   
        
      setAppState({
        ...appState,
        loggedUser,
        years,
        userData,
        selectedMonth: currentMonth,
        selectedYear: currentYear,
        loadedData: true
      })         
    }
    useEffect(()=>{  
      if (!appState.loggedUser){
        fetchUserData()
      }
    }, [])
    useEffect(()=>{        
      setAppState({...appState, itemsToDelete:[]}); 
    }, [appState.selectedYear])
    const onSelectedItem = (selectedYear) => {
      setAppState({...appState, selectedMonth: currentMonth, selectedYear});
    }
    const onSelectedMonth = (selectedMonth) => {
      setAppState({...appState, selectedMonth});
    }
    const onLongPressDay = (month, day, time)=>{
      console.log('onLongPressDay '+ month+' '+ day+' '+time)
      const found = appState.itemsToDelete.find(item=>{
        return (item.month === month && item.day === day && item.time === time);
      })
      if (!found){
        const itemsToDelete = [...appState.itemsToDelete]
        itemsToDelete.push({month, day, time})
        setAppState({...appState, itemsToDelete });
        console.log('Items '+ itemsToDelete.map(i=>JSON.stringify(i)))
      }
    }
    const onPressDay = (month, day, time)=>{
      console.log('onPressDay '+ month+' '+ day+' '+time)
      const found = appState.itemsToDelete.find(item=>{
        return (item.month === month && item.day === day && item.time === time);
      })
      if (appState.itemsToDelete.length > 0){
        let itemsToDelete = [...appState.itemsToDelete]      
        if (found){
          itemsToDelete = itemsToDelete.filter(item=>!(item.month === month && 
                                                    item.day === day && 
                                                    item.time === time))
        }
        else{
          itemsToDelete.push({month, day, time})
        }
        appState.itemsToDelete = {itemsToDelete}
        setAppState({...appState, itemsToDelete})
      }
    }
    const onDeleteItems = ()=>{
      debugger;
      const _userData = {...appState.userData};
      appState.itemsToDelete.forEach(item=>{
        delete _userData[selectedYear][item.month+1][item.day][item.time];
      })
      setAppState({...appState, _userData, itemsToDelete:[]});      
    }
    console.log('Render')    
    const {totalAmountUSD, totalAmountCUP} = calculateTotalAmount();
    const {loadedData, years, selectedYear, selectedMonth, itemsToDelete, userData} = appState;
    return (      
      <View style={{flex:1}}>
        <Header/>        
        { !loadedData ?
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
              <TotalAmount totalAmountUSD={totalAmountUSD} totalAmountCUP={totalAmountCUP} />
              <MonthsTabView 
                navigation={navigation} 
                selectedYear={selectedYear}  
                data={userData[selectedYear]}  
                index={selectedMonth}
                itemsToDelete={itemsToDelete}
                onSelectedMonth={onSelectedMonth}
                onPress={onPressDay}             
                onLongPress={onLongPressDay} 
                onDeleteItems={onDeleteItems}               
              />
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