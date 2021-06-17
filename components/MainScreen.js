import React, {useState, useEffect, useRef, memo} from 'react'
import { View, Button, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Avatar } from "react-native-elements";
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
    const [loggedUser, setLoggedUser] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [years, setYears] = useState([]);
    const [loadedData, setLoadedData] = useState(false);
    //const [monthData, setMonthData] = useState({});
    const [userData, setUserData] = useState(null);
    const [totalAmountUSD, setTotalAmountUSD] = useState(0)
    const [totalAmountCUP, setTotalAmountCUP] = useState(0)
  
    const calculateTotalAmount = ()=>{
      let _totalAmountUSD = 0,
      _totalAmountCUP = 0;
      Object.keys(userData[selectedYear]).forEach(m=>{
        const monthData = userData[selectedYear][m];
        Object.keys(monthData).forEach(d=>{          
          Object.keys(monthData[d]).forEach(time=>{   
            let { currency, amount} = monthData[d][time];
              (currency == 'USD')?_totalAmountUSD += amount: _totalAmountCUP += amount
            })
          })
        })
        setTotalAmountCUP(_totalAmountCUP);
        setTotalAmountUSD(_totalAmountUSD);
        console.log('Calculates total')
    }
    const getAsyncPromise = async (promiseArray)=>{
        const response = await Promise.all(promiseArray.map(f=>f()))
        //console.log(response)
        return response;
    }
    
    useEffect(()=>{
      if (params && params.newExpense){   
        const {year, month, day, created} = params.newExpense;
          let _userData = Object.assign({}, userData),
          currObj = _userData;
          [year, month, day].forEach(k=>{
            currObj[k] = currObj[k] || {}
            currObj = currObj[k];  
          })
          currObj[created] = params.newExpense.data;
          AsyncStorageHelper.saveObject(`${ loggedUser }:data`, _userData);
          setUserData(_userData);
          params.newExpense = null;
      }
    }, [params] )
    
    useEffect(()=>{
      if (userData && selectedYear){
        calculateTotalAmount();
      }
    }, [userData, selectedYear])

    const fetchUserData = async (_loggedUser) =>{
      let _userData;
      _userData =  await AsyncStorageHelper.getObject(`${_loggedUser}:data`);
      if (!_userData){
        _userData = await getUserData(_loggedUser) ;   
        await AsyncStorageHelper.saveObject(`${_loggedUser}:data`, _userData);        
      }
      const _years = Object.keys(_userData);  
      const index = _years.findIndex((e)=>equalsIntegers(e, currentYear));  
      if (index === -1){
        _years.push(currentYear);
      }
      _years.sort();               
      //setLoggedUser(_loggedUser);
      setYears(_years);
      setUserData(_userData);
      setSelectedYear(currentYear)
      setLoadedData(true);
    }
    useEffect(()=>{  
      const init = async ()=>{
        const _loggedUser = await AsyncStorageHelper.getItem('loggeduser');
        fetchUserData(_loggedUser);
        setLoggedUser(_loggedUser);
      }
      if (!loggedUser){
        init()
      }
    }, [])
    const onSelectedItem = (year) => {
      setSelectedYear(year); 
      //setMonthData(userData[year]);
    }
    console.log('Render')
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
                index={currentMonth}
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