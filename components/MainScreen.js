import React, {useState, useEffect, useRef, useContext, useCallback} from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import PropTypes from 'prop-types'
import { Context } from '../Store'
import { AntDesign } from '@expo/vector-icons'
import Ripple from 'react-native-material-ripple'
import { useNavigation } from '@react-navigation/native' 
import Heroku from '../controllers/index'
import {equalsIntegers, toBoolean, color} from '../utils'
import DateUtils from '../DateUtils'
import Header from './Header'
import Menu from './Menu'
import TotalAmount from './TotalAmount'
import MonthsTabView from './MonthsTabView'
import ExpenseList from './ExpenseList'
import OverlayIndicator from './OverlayIndicator'
import useWhyDidYouUpdate from '../hooks/useWhyDidYouUpdate'
const compareDays = (d1,d2)=>{
    return parseInt(d2)-parseInt(d1)
}
const compareDates = (date1, date2)=>{
    return date2 - date1
}
const MainScreen = ({route})=>{
    const navigation = useNavigation()
    const [globalState, dispatch] = useContext(Context)
    const [state, setState] = useState({status: 'idle', error: null})
    const [expensesView, setExpensesView] = useState('grid')
    const mountedRef = useRef(false)

    const {currentUser} = globalState
    useWhyDidYouUpdate('MainScreen', {}, state)

    const _loadData = useCallback(async()=>{        
        try{
            setState({...state, status: 'pending'})
            const response = await Heroku.getUserData(currentUser.id)  
            if (mountedRef.current){
                const data = response.data
                const years = Object.keys(data)  
                const index = years.findIndex((e)=>equalsIntegers(e, DateUtils.CURRENT_YEAR))  
                if (index === -1){
                    years.push(DateUtils.CURRENT_YEAR)
                    data[DateUtils.CURRENT_YEAR] = {}
                }
                years.sort()

                Object.keys(data).forEach(year => {                    
                    Object.keys(data[year]).forEach(month=>{
                        const daysKey = Object.keys(data[year][month]).filter(day=>Object.values(data[year][month][day])
                            .find(exp=>!toBoolean(exp.deleted)) != undefined)
                        data[year][month] = {
                            id: month,
                            days: daysKey.sort(compareDays).map(day=>({
                                id: day,
                                expenses: Object.keys(data[year][month][day])
                                    .filter(exp=>!toBoolean(data[year][month][day][exp].deleted))
                                    .sort(compareDates).map(exp=>({
                                        id: exp,
                                        ...data[year][month][day][exp]
                                    }))
                            }))                         
                        }
                            
                    })
                })                 
                dispatch({type: 'LOAD_DATA', data, years})
                setState({...state, status: 'success'})           
            }   
        } 
        catch(error){                        
            console.log(error)
            setState({...state, status: 'error', error:'Error de conexión'})             
        }       
    }, [currentUser])

    useEffect(()=>{
        mountedRef.current = true
        _loadData()
        return()=>{
            mountedRef.current = false
        } 
    }, [currentUser])

    const onChangeExpenseView = useCallback(()=>{
        setExpensesView(expensesView==='list'?'grid':'list')
    }, [expensesView])

    const _addExpenseBtnPress = ()=>{
        navigation.navigate('AddExpense')
    }
    console.log('Main Screen')
    const {status, error} = state
    return (      
        <View style={{flex:1}}>
            <Header currentUser={currentUser} />
            { globalState.data &&
            <>
                <Menu /> 
                <TotalAmount />   
                {expensesView === 'grid'? (
                    <MonthsTabView 
                        onChangeExpenseView={onChangeExpenseView}
                        
                    />
                ):<ExpenseList onChangeExpenseView={onChangeExpenseView}  /> 
                }
                {globalState.itemsToDelete.length === 0 &&                     
                    <View>
                        <Ripple style={styles.fab}
                            onPress={_addExpenseBtnPress} >
                            <AntDesign name="plus" size={24} color="white" />
                        </Ripple>
                        <Ripple style={[styles.fab, {left: 30}]}
                            onPress={onChangeExpenseView} >
                            <AntDesign name="bars" size={24} color="white" />
                        </Ripple>
                    </View>
                }            
            </>
            }
            { status === 'error' && (
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{marginBottom: 10}}>{error}</Text>
                    <Button title="Volver a intentarlo" 
                        onPress={_loadData}
                        buttonStyle={{
                            backgroundColor:'red',
                            paddingVertical: 10
                        }}
                    />
                </View>                                         
            )
            }
            { status === 'pending' && 
                <OverlayIndicator overlayLabel={`Cargando datos de ${currentUser.name.split(' ')[0]}`} />
            }
        </View>
    )
}
 
MainScreen.propTypes = {
    route: PropTypes.object    
}
const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 75,
        backgroundColor: color.primaryGreen,
        borderRadius: 28,
        elevation: 8,
    }
})
export default MainScreen