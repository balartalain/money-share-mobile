import React, {useState, useEffect, useRef, useContext, useCallback} from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-elements'
import PropTypes from 'prop-types'
import { Context } from '../Store'
import Heroku from '../controllers'
import {equalsIntegers, toBoolean} from '../utils'
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
    return (new Date(date2) > new Date(date1))?1:0
}
const InnerMainScreen = React.memo(({currentUser, route, onLoadData, onChangeCurrentUser})=>{
    const {params} = route
    const [state, setState] = useState({status: 'idle', error: null})
    const [expensesView, setExpensesView] = useState('grid')
    const mountedRef = useRef(false)
    useWhyDidYouUpdate('InnerMainScreen', {currentUser, route, onLoadData, onChangeCurrentUser}, state)

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
                onLoadData(data, years)                
                setState({...state, status: 'success'})           
            }   
        } 
        catch(error){                        
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

    useEffect(()=>{
        if (params && params.changeUser && params.changeUser.id !== currentUser.id){ 
            onChangeCurrentUser(params.changeUser)                        
            params.changeUser = null
            
        }
    }, [params] )
    
    const onChangeExpenseView = useCallback(()=>{
        setExpensesView(expensesView==='list'?'grid':'list')
    }, [expensesView])

    console.log('Memoized Main Screen')
    const {status, error} = state
    return (      
        <View style={{flex:1}}>
            <Header currentUser={currentUser} />
            { status === 'success' &&
            <>
                <Menu /> 
                <TotalAmount />   
                {expensesView === 'grid'? (
                    <MonthsTabView 
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
}, areEqual)
function areEqual(prevProps, nextProps) {
    //return false
    return prevProps.currentUser.id === nextProps.currentUser.id

}
InnerMainScreen.propTypes = {
    route: PropTypes.object,
    currentUser: PropTypes.object,
    onLoadData: PropTypes.func,
    onChangeCurrentUser: PropTypes.func
}
const MainScreen = ({route}) => {    
    const [globalState, dispatch] = useContext(Context) 
    const onLoadData = (data, years)=>{
        dispatch({type: 'LOAD_DATA', data, years})
    }    
    const onChangeCurrentUser = (user)=>{
        dispatch({type: 'SET_CURRENT_USER', user })
    }
    console.log('Main Screen')
    return <InnerMainScreen currentUser={globalState.currentUser} route={route} 
        onLoadData={onLoadData}  
        onChangeCurrentUser={onChangeCurrentUser}
    />
    
}  
MainScreen.propTypes = {
    route: PropTypes.object
}
export default MainScreen