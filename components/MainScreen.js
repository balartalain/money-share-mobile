import React, {useState, useEffect, useRef} from 'react'
import { View, Text, Button} from 'react-native'
import PropTypes from 'prop-types'
import {useUserDataContextHook} from './UserDataContext'
import Header from './Header'
import Menu from './Menu'
import TotalAmount from './TotalAmount'
import MonthsTabView from './MonthsTabView'
import ExpenseList from './ExpenseList'
import useWhyDidYouUpdate from '../hooks/useWhyDidYouUpdate'
import whyDidYouRender from '@welldone-software/why-did-you-render'

whyDidYouRender(React, {
    //onlyLogs: true,
    titleColor: 'green',
    diffNameColor: 'darkturquoise'
})

const MainScreen = ({navigation, route}) => {
    useWhyDidYouUpdate('Main Screen', {navigation, route})
    const { params } = route
    const {currentUser, setCurrentUser, appState, loadData} = useUserDataContextHook()
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
        if (params && params.changeUser && params.changeUser.id !== currentUser.id){ 
            const changeToUser = params.changeUser         
            setCurrentUser(changeToUser)
            params.changeUser = null
        }
    }, [params] )
    useEffect(()=>{
        mountedRef.current = true
        _loadData()
        return()=>{
            mountedRef.current = false
        } 
    }, [currentUser])

    const onChangeExpenseView = ()=>{
        setExpensesView(expensesView==='list'?'grid':'list')
    }
    console.log('Main Screen')
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
MainScreen.whyDidYouRender