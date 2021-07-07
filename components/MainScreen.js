import React, {useState, useEffect, useRef} from 'react'
import { View, Text, Button} from 'react-native'
import PropTypes from 'prop-types'
import {useAppUser} from './AppUserContext'
import {DataUserContext} from './DataUserContext'
import Header from './Header'
import Menu from './Menu'
import TotalAmount from './TotalAmount'
import MonthsTabView from './MonthsTabView'
import ExpenseList from './ExpenseList'
import Heroku from '../controllers/index'
import {equalsIntegers} from '../utils'
import DateUtils from '../DateUtils'

const MainScreen = ({navigation, route}) => {

    //const { params } = route
    const [currentUser, setCurrentUser] = useState(null)
    const [appState, setAppState] = useState({
        selectedMonth: null,
        selectedYear: null,
        years: [],      
        userData: null,
        itemsToDelete:[]
    })  
    const {appUser} = useAppUser()
    const [expensesView, setExpensesView] = useState('grid')
    const [errorMsg, setErrorMsg] = useState('')
    const [status, setStatus] = useState('') // loading, loaded, error
    const mountedRef = useRef(false)

    const loadData = async()=>{
        setStatus('loading')
        Heroku.getUserData(currentUser.id)
            .then(data=>{
                if (mountedRef.current){
                    const userData = data.data
                    const years = Object.keys(userData)  
                    const index = years.findIndex((e)=>equalsIntegers(e, DateUtils.CURRENT_YEAR))  
                    if (index === -1){
                        years.push(DateUtils.CURRENT_YEAR)
                    }
                    years.sort()   
                    setAppState({
                        ...appState,
                        userData,
                        years,
                        selectedMonth: DateUtils.CURRENT_MONTH,
                        selectedYear: DateUtils.CURRENT_YEAR
                    })  
                    setStatus('loaded')
            
                }
            }).catch(error=>{
                if (!error.response){
                    setErrorMsg('No hay conexión a internet')
                }
                else{
                    setErrorMsg(error)
                } 
                setStatus('error')
            })  
    }

    useEffect(()=>{
        mountedRef.current = true
        return ()=>{
            mountedRef.current = false
        }
    }, [])
    useEffect(()=>{
        if (appUser){ 
            setCurrentUser(appUser)
        }
    }, [appUser])

    useEffect(()=>{
        if (currentUser){ 
            loadData()
        }
    }, [currentUser])
    const onChangeExpenseView = ()=>{
        setExpensesView(expensesView==='list'?'grid':'list')
    }
    //const {userData, selectedYear, selectedMonth} = appState
    return (      
        <View style={{flex:1}}>
            { status === 'loaded'&& (
                <DataUserContext.Provider value={{ appState, setAppState}} >
                    <Header currentUser={currentUser} />  
                    <Menu /> 
                    <TotalAmount />
                    {expensesView === 'grid'? (
                        <MonthsTabView 
                            navigation={navigation} 
                            // selectedYear={selectedYear} 
                            index={DateUtils.CURRENT_MONTH}
                            // itemsToDelete={itemsToDelete}
                            // onSelectedMonth={onSelectedMonth}
                            // onPress={onPressDay}             
                            // onLongPress={onLongPressDay} 
                            // onDeleteItems={onDeleteItems}   
                            // onChangeExpenseView={onChangeExpenseView}   
                        
                        />
                    ):<ExpenseList onChangeExpenseView={onChangeExpenseView}  />  
                    }                      
                </DataUserContext.Provider>
            )}
            { status === 'error '&& (
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
            )}
            {
                /*  status === 'loading' && Show loading */
            }
        </View>
    )
}  
MainScreen.propTypes = {
    navigation: PropTypes.Object,
    route: PropTypes.Object,
}
export default MainScreen


// const getAsyncPromise = async (promiseArray)=>{
//   const response = await Promise.all(promiseArray.map(f=>f()))
//   //console.log(response)
//   return response;
// }
//   const [_years, monthdata] = await getAsyncPromise([ ()=>getUserYears('balartalain'), 
//                     ()=>getMonthData('balartalain', currentYear, currentMonth+1)
//                   ]);