import React, {useState, useEffect, useRef, memo} from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions} from "react-native";
import { Avatar, Divider, Button } from "react-native-elements";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import AsyncStorageHelper from '../AsyncStorageHelper';
import { color, currentMonth } from './../utils'
import Header from './Header'
import Menu from './Menu';
import TotalAmount from './TotalAmount';
import MonthsTabView from './MonthsTabView';
import { getUserData, deleteExpense } from '../controllers/index';
import {currentYear, equalsIntegers} from '../utils';

const width = Dimensions.get('window').width;
const MainScreen = ({navigation, route}) => {

    const { params } = route;
    const [appState, setAppState] = useState({
      currentUser: null,
      selectedMonth: null,
      selectedYear: null,
      years: [],      
      userData: null,
      itemsToDelete:[]
    });  
    const [errorMsg, setErrorMsg] = useState("");
    const [status, setStatus] = useState(""); // loading, loaded, error
    const mountedRef = useRef(false),
    calculateTotalAmount = ()=>{
      let totalAmountUSD = 0,
      totalAmountCUP = 0;
      const {userData, selectedYear} = appState;
      if (userData && Object.keys(userData).length > 0){
        Object.keys(userData[selectedYear]).forEach(m=>{
          const monthData = userData[selectedYear][m];
          Object.keys(monthData).forEach(d=>{          
            Object.keys(monthData[d]).forEach(time=>{   
              if (monthData[d][time].deleted !== 'true'){
                let { currency, amount} = monthData[d][time];
                  (currency == 'USD')?totalAmountUSD += parseInt(amount): totalAmountCUP += parseInt(amount)
                }
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
           let userData = appState.userData,
           expense = params.newExpense,
            currObj = userData;
            [expense.year, expense.month, expense.day].forEach(k=>{
              currObj[k] = currObj[k] || {}
              currObj = currObj[k];  
            })
            currObj[expense.created] = expense;
            setAppState({...appState, userData})
            params.newExpense = null;
      }
    }, [params] )

    const loadData = async()=>{
      setStatus("loading");
      getUserData(appState.currentUser.id)
        .then(data=>{
          if (mountedRef.current){
            const userData = data.data;
            const years = Object.keys(userData);  
            const index = years.findIndex((e)=>equalsIntegers(e, currentYear));  
            if (index === -1){
              years.push(currentYear);
            }
            years.sort();   
            setAppState({
              ...appState,
              userData,
              years,
              selectedMonth: currentMonth,
              selectedYear: currentYear
            })  
            setStatus("loaded");
            
          }
        }).catch(error=>{
          if (!error.response){
            setErrorMsg("No hay conexión a internet")
          }
          else{
            setErrorMsg(error);
          } 
          setStatus("error");
        })  
    }
    useEffect(()=>{
      if (appState.currentUser){
        AsyncStorageHelper.saveObject('currentUser', appState.currentUser);
        loadData();
      }
    }, [appState.currentUser])

    useEffect(()=>{  
      const init = async()=>{
        const me = await AsyncStorageHelper.getObject('me');
        setAppState({...appState, currentUser: me});        
      }      
      mountedRef.current = true
      init();
      return () => {
        mountedRef.current = false
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
      month = month + 1;
      const found = appState.itemsToDelete.find(item=>{
        return (item.month === month && item.day === day && item.time === time);
      })
      if (!found){
        const itemsToDelete = [...appState.itemsToDelete]
        itemsToDelete.push({year: appState.selectedYear, month, day, created:time})
        setAppState({...appState, itemsToDelete });
      }
    }
    const onPressDay = (month, day, time)=>{
      month = month + 1;
      const found = appState.itemsToDelete.find(item=>{
        return (item.month === month && item.day === day && item.created === time);
      })
      if (appState.itemsToDelete.length > 0){
        let itemsToDelete = [...appState.itemsToDelete]      
        if (found){
          itemsToDelete = itemsToDelete.filter(item=>!(item.month === month && 
                                                    item.day === day && 
                                                    item.created === time))
        }
        else{
          itemsToDelete.push({year: appState.selectedYear, month, day, created:time})
        }
        appState.itemsToDelete = {itemsToDelete}
        setAppState({...appState, itemsToDelete})
      }
    }
    const onDeleteItems = ()=>{    
      // const res = await axios.delete('https://httpbin.org/delete', { data: { answer: 42 } });      
        const deleteAsync = appState.itemsToDelete.map(item=>{
          return deleteExpense(appState.currentUser.id, item)
        })
        Promise.all(deleteAsync).then(result => {
          const _userData = {...appState.userData};
          appState.itemsToDelete.forEach(item=>{
            _userData[selectedYear][item.month][item.day][item.created].deleted = "true";
          })
          setAppState({...appState, _userData, itemsToDelete:[]});      
        }).catch(reason => {
          console.log('Error '+ reason);
          setAppState({...appState, itemsToDelete:[]});
          setTimeout(()=> alert("No tiene conexión a internet"), 100)          
        });      
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
        { appState.currentUser &&
        <Header deleteItems={itemsToDelete.length > 0} 
          onDelete={onDeleteItems}
          onCancelDelete={onCancelDelete}
          navigation={navigation}
          currentUser={appState.currentUser}
        />  
       }      
        { (status === "loading" || status === "") ?
          (
            <View style={{flex:1}}>            
              <View style={{flex:1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color={color.primaryGreen}/>
              </View>
            </View>
          )
          : status==="loaded" ?
          (
            <View style={{flex:1}}>
              <Menu items={years} selectedItem={selectedYear} onSelectedItem={onSelectedItem}/> 
              <TotalAmount totalAmountUSD={totalAmountUSD} totalAmountCUP={totalAmountCUP} />
              <Divider orientation="horizontal" />
              <MonthsTabView 
                navigation={navigation} 
                selectedYear={selectedYear}  
                data={userData[selectedYear] || {}}  
                index={selectedMonth}id
                itemsToDelete={itemsToDelete}
                onSelectedMonth={onSelectedMonth}
                onPress={onPressDay}             
                onLongPress={onLongPressDay} 
                onDeleteItems={onDeleteItems}               
              />
            </View>
           ):
            (
              <View style={{flex:1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{marginBottom: 10}}>{errorMsg}</Text>
                  <Button title="Volver a intentarlo" 
                    onPress={loadData}
                    buttonStyle={{
                      backgroundColor:'red',
                      paddingVertical: 15
                    }}
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