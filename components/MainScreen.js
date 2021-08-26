import React, {useState, useEffect, useRef, useContext, useCallback} from 'react'
import { View, Text, Button} from 'react-native'
import PropTypes from 'prop-types'
import { Context } from '../Store'
import Heroku from '../controllers'
import {equalsIntegers} from '../utils'
import DateUtils from '../DateUtils'
import Header from './Header'
import Menu, {Menu1} from './Menu'
import TotalAmount from './TotalAmount'
import MonthsTabView from './MonthsTabView'
import ExpenseList from './ExpenseList'
import useAsync from '../hooks/useAsync'
import OverlayIndicator from './OverlayIndicator'
import whyDidYouRender from '@welldone-software/why-did-you-render'

whyDidYouRender(React, {
    //onlyLogs: true,
    titleColor: 'green',
    diffNameColor: 'darkturquoise'
})
const keys = ['months', 'days', 'expenses']
const objectToArray = (obj, level)=>{ 
    if (level > 2){
        return Object.keys(obj).map(key=>({
            id:key, 
            ...obj[key]}
        ))
    }                   
    return Object.keys(obj).map(key=>{
        return {
            id:key,
            [keys[level]]: objectToArray(obj[key], level+1)
        }
    }
        
    )
}
const MainScreen = ({navigation, route}) => {    
    const { params } = route
    const [globalState, dispatch] = useContext(Context) 
    const [state, setState] = useState({status: 'idle', error: null})
    const [expensesView, setExpensesView] = useState('grid')
    //const [errorMsg, setErrorMsg] = useState(null)
    const mountedRef = useRef(false)
    const {currentUser} = globalState
    const _loadData = useCallback(async()=>{        
        try{
            //toggleOverlay('Obteniendo datos de '+currentUser.name.split(' ')[0])
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

                // Object.keys(data).forEach(year => {                    
                //     Object.keys(data[year]).forEach(month=>{
                //         data[year][month] = {
                //             id: month,
                //             days: Object.keys(data[year][month]).map(day=>({
                //                 id: day,
                //                 ...data[year][month][day]
                //             }))                         
                //         }
                            
                //     })
                // })
                                     
                dispatch({type: 'LOAD_DATA',data: objectToArray(data, 0), years})
                setState({...state, status: 'success'})           
            }   
        } 
        catch(error){            
            setState({...state, status: 'error', error})             
        }       
    }, [currentUser])

    useEffect(()=>{
        mountedRef.current = true
        _loadData()
        return()=>{
            mountedRef.current = false
        } 
    }, [currentUser])

    useEffect(()=>{
        if (params && params.changeUser && params.changeUser.id !== currentUser.id){             
            dispatch({type: 'SET_CURRENT_USER', user: params.changeUser })
            params.changeUser = null
            
        }
    }, [params] )
    
    const onChangeExpenseView = ()=>{
        setExpensesView(expensesView==='list'?'grid':'list')
    }
    console.log('Main Screen')
    const {status, error} = state
    return (      
        <View style={{flex:1}}>
            <Header navigation={navigation} />
            { status === 'success' &&
            <>
                <Menu /> 
                <TotalAmount />   
                {expensesView === 'grid'? (
                    <MonthsTabView 
                        navigation={navigation} 
                        index={globalState.currentMonth} 
                        onChangeExpenseView={onChangeExpenseView}
                        
                    />
                ):<ExpenseList onChangeExpenseView={onChangeExpenseView}  /> 
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
                            paddingVertical: 15
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
    navigation: PropTypes.any
}
export default MainScreen
MainScreen.whyDidYouRender  = {
    logOnDifferentValues: true
}

// const keys = ['months', 'days']
// const objectToArray = (obj, level)=>{ 
//     if (level > 1){
//         return obj
//     }                   
//     return Object.keys(obj).map(key=>{
//         return {
//             id:key,
//             [keys[level]]: objectToArray(obj[key], level+1)
//         }
//     }
                        
//     )
// }