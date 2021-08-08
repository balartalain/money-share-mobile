import React, {useState, useEffect, useRef} from 'react'
import { View, Text, Button} from 'react-native'
import PropTypes from 'prop-types'
import {useUserDataContextHook} from './UserDataContext'
import Header from './Header'
import Menu from './Menu'
import TotalAmount from './TotalAmount'
import MonthsTabView from './MonthsTabView'
import ExpenseList from './ExpenseList'

const MainScreen = ({navigation}) => {
    //const { params } = route
    const {currentUser, appState, loadData} = useUserDataContextHook()
    const [expensesView, setExpensesView] = useState('grid')
    const [errorMsg, setErrorMsg] = useState(null)
    const [status, setStatus] = useState('') // loading, loaded, error
    const mountedRef = useRef(false)

    const _loadData = ()=>{
        setErrorMsg(null)
        loadData().then(()=>{
            if (mountedRef.current){
                setStatus('loadedData')
                setErrorMsg(null)
            }
        }).catch(error=>{
            setErrorMsg(error.message)
        })
    }
    useEffect(()=>{
        mountedRef.current = true
        _loadData()
        return()=>{
            mountedRef.current = false
        } 
    }, [])
    const onChangeExpenseView = ()=>{
        setExpensesView(expensesView==='list'?'grid':'list')
    }
    return (      
        <View style={{flex:1}}>
            { currentUser && 
            <Header navigation={navigation} currentUser={currentUser} /> }
            { status === 'loadedData' &&
            <>
                <Menu /> 
                <TotalAmount />    
                {expensesView === 'grid'? (
                    <MonthsTabView 
                        navigation={navigation} 
                        index={appState.selectedMonth} 
                        onChangeExpenseView={onChangeExpenseView}
                        
                    />
                ):<ExpenseList onChangeExpenseView={onChangeExpenseView}  /> 
                }            
            </>
            }
            { errorMsg && (
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{marginBottom: 10}}>{errorMsg}</Text>
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
        </View>
    )
}  
MainScreen.propTypes = {
    navigation: PropTypes.any
}
export default MainScreen