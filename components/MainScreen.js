import React, {useState, useEffect, useRef, memo} from 'react'
import { View, Button, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions} from "react-native";
import { Avatar, Divider } from "react-native-elements";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import AsyncStorageHelper from '../AsyncStorageHelper';
import { color, currentMonth } from './../utils'
import Header from './Header'
import Menu from './Menu';
import TotalAmount from './TotalAmount';
import MonthsTabView from './MonthsTabView';
import { getUserData, createExpense } from '../controllers/index';
import {currentYear, equalsIntegers} from '../utils';

const width = Dimensions.get('window').width;
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
                (currency == 'USD')?totalAmountUSD += parseInt(amount): totalAmountCUP += parseInt(amount)
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
          const year = appState.selectedYear,
          month = appState.selectedMonth;
          params.newExpense["year"] = year;
          params.newExpense["month"] = month+1;
          params.newExpense.day = (params.newExpense.day < 10)?"0"+params.newExpense.day:params.newExpense.day;
          createExpense(appState.loggedUser, params.newExpense).then(result=>{
            if (result.data){
              let userData = appState.userData,
              currObj = userData;
              [result.data.year, result.data.month, result.data.day].forEach(k=>{
                currObj[k] = currObj[k] || {}
                currObj = currObj[k];  
              })
              currObj[params.newExpense.created] = result.data;
              setAppState({...appState, userData})
            }
          }).catch(err=>{
            console.log(error);
          }).finally(()=>{
            params.newExpense = null;
          })
          
          
      }
    }, [params] )
    
    useEffect(()=>{  
      let isMounted = true;
      const loggedUser = params.loggedUser;
      debugger;
        getUserData(loggedUser)
        .then(data=>{
          if (isMounted){
            debugger;
            const userData = data.data;
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
        }).catch(error=>{
          console.log(error);
        })  
        return () => {
          isMounted = false;
        }; 
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
      const _userData = {...appState.userData};
      appState.itemsToDelete.forEach(item=>{
        delete _userData[selectedYear][item.month+1][item.day][item.time];
      })
      setAppState({...appState, _userData, itemsToDelete:[]});      
    }
    const onCancelDelete = ()=>{
      // TODO: Esto es ineficiente debido a que solo queremos cancelar , 
      // es mejor separar itemsToDelete en un estado separado
      setAppState({...appState, itemsToDelete:[]});
    }
    console.log('Render')    
    const {totalAmountUSD, totalAmountCUP} = calculateTotalAmount();
    const {loadedData, years, selectedYear, selectedMonth, itemsToDelete, userData} = appState;
    return (      
      <View style={{flex:1}}>
        <Header deleteItems={itemsToDelete.length > 0} 
          onDelete={onDeleteItems}
          onCancelDelete={onCancelDelete}
        />        
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
              <Divider orientation="horizontal" />
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