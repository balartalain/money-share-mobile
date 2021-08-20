import React, {useState, useEffect, useRef} from 'react'
import { View, SafeAreaView, StyleSheet, Text, Dimensions} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Constants from 'expo-constants'
import Heroku from './controllers/index'
import MainScreen from './components/MainScreen'
import AddExpense from './components/AddExpense'
import * as Facebook from 'expo-facebook'
import FacebookLogin from './components/FacebookLogin'
import AsyncStorageHelper  from './AsyncStorageHelper'
import OverlayIndicator from './components/OverlayIndicator'
import { OverlayContext } from './components/OverlayContext'
import { UserDataContext } from './components/UserDataContext'
import Users from './components/Users'
import useOTAUpdate from './hooks/useOTAUpdate'
import {equalsIntegers, color} from './utils'
import DateUtils from './DateUtils'
import {CONNECTION_ERROR} from './ErrorConstants'
import whyDidYouRender from '@welldone-software/why-did-you-render'

whyDidYouRender(React, {
    //onlyLogs: true,
    titleColor: 'green',
    diffNameColor: 'darkturquoise'
})
  
const { width } = Dimensions.get('window')

const Stack = createStackNavigator()
const App = () =>{
    const [overlay, setShowOverlay] = useState(false)
    const [appState, setAppState] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [overlayLabel, setOverlayLabel] = useState(null)
    const [overlayTop, setOverLayTop] = useState(0)
    const [markedItemsToDelete, setMarkedItemsToDelete] = useState([])    
    const otaUpdateStatus = useOTAUpdate()
    const mountedRef = useRef(false)

    const loginSuccess = (userInfo)=>{   
        showOverlay('Autenticando usuario en Money share') 
        Heroku.registerUser(userInfo).then(()=>{
            AsyncStorageHelper.saveObject('user', userInfo)
            setCurrentUser(userInfo)
        }).catch(()=>{
            alert(CONNECTION_ERROR)
        }).finally(toggleOverlay)
    }
    const logout = ()=>{      
        showOverlay('Cerrando sesión...')  
        Facebook.logOutAsync().then (async ()=>{
            const user = await AsyncStorageHelper.getObject('user')
            var lParams= 'access_token='+user.token
            await fetch(
                'https://graph.facebook.com/'+user.id+'/permissions',{
                    method : 'DELETE',
                    body: lParams
                })
            await AsyncStorageHelper.removeObject('user')
            setCurrentUser(null)
            setAppState(null)
        }).catch((error)=>{
            console.log(error)
            alert(error)
        }).finally(()=>{
            hideOverlay()
        })
        
    }
    const loadData = async()=>{
        try{
            toggleOverlay('Obteniendo datos de '+currentUser.name.split(' ')[0])
            const data = await Heroku.getUserData(currentUser.id)  
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
            
            }   
        } 
        catch(error){
            throw new Error(error)
        }
        finally{
            toggleOverlay()
        }

    }

    useEffect(()=>{    
        (async()=>{
            const user = await AsyncStorageHelper.getObject('user')            
            if (user){
                setCurrentUser(user)
            }
        })()
        mountedRef.current = true                  
        return ()=>{
            mountedRef.current = false
        }
    }, [])

    const showOverlay =(info, top)=>{
        setOverlayLabel(info)
        setOverLayTop(top)
        setShowOverlay(true)
    }
    const hideOverlay = ()=>{
        setShowOverlay(false)
    }
    const toggleOverlay = (info)=>{
        setOverlayLabel(info)
        setShowOverlay(prevState=>!prevState)
    } 
    console.log('App')
    return (
        <SafeAreaView style={styles.container}>             
            <View style={styles.top}></View> 
            <OverlayContext.Provider value={{hideOverlay, showOverlay}}>
                { currentUser ? (
                    <UserDataContext.Provider 
                        value={{currentUser, 
                            appState, 
                            setAppState, 
                            markedItemsToDelete, 
                            setMarkedItemsToDelete,
                            loadData,
                            logout,
                            setCurrentUser
                        }} >
                        <NavigationContainer>
                            <Stack.Navigator
                            >
                                <Stack.Screen name="Home" component={MainScreen} 
                                    options={{  headerShown: false }}              
                                />
                                <Stack.Screen name="AddExpense" 
                                    options={{ title: 'Nuevo Gasto' }}
                                    component={AddExpense} />
                                <Stack.Screen name="Users" 
                                    options={{ title: 'Usuarios' }}  
                                    component={Users}
                                >                                     
                                </Stack.Screen>
                            </Stack.Navigator>              
                        </NavigationContainer> 
                    </UserDataContext.Provider>
                )               
                    : <FacebookLogin loginSuccess={loginSuccess} />
                } 
                {overlay && <OverlayIndicator overlayLabel={overlayLabel} top={overlayTop} /> }
                
            </OverlayContext.Provider>
            {otaUpdateStatus && <View style={{
                //flex:1,
                position: 'absolute',
                bottom: 4,
                left: 0,
                width,
                paddingVertical: 15,
                paddingLeft: 10,
                backgroundColor: 'black',
                zIndex: 20000                             
            }}>
                <Text style={{color: 'white'}}>{otaUpdateStatus}</Text>
            </View> 
            } 
        </SafeAreaView>
    )  
}
const styles = StyleSheet.create({    
    container: {
        flex: 1
    },
    top:{
        height: Constants.statusBarHeight,
        backgroundColor: color.primaryGreen
    }
})
export default App
App.whyDidYouRender = true