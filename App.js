import React, {useState, useEffect, useRef, useContext} from 'react'
import { StatusBar } from 'expo-status-bar'
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
import Users from './components/Users'
import useOTAUpdate from './hooks/useOTAUpdate'
import {color} from './utils'
import {CONNECTION_ERROR} from './ErrorConstants'
import whyDidYouRender from '@welldone-software/why-did-you-render'
import Store, { Context } from './Store'

whyDidYouRender(React, {
    //onlyLogs: true,
    titleColor: 'green',
    diffNameColor: 'darkturquoise',
    trackAllPureComponents: true
})

const { width } = Dimensions.get('window')

const Stack = createStackNavigator()
const WrapperApp = () =>{   
    const [state, dispatch] = useContext(Context) 
    const [overlay, setShowOverlay] = useState(false)
    const [overlayLabel, setOverlayLabel] = useState(null)  
    const [updateStatus, updateMessage] = useOTAUpdate()
    const mountedRef = useRef(false)

    const loginSuccess = (userInfo)=>{   
        showOverlay('Autenticando usuario en Money share') 
        Heroku.registerUser(userInfo).then(()=>{
            AsyncStorageHelper.saveObject('user', userInfo)
            //setCurrentUser(userInfo)
            dispatch({type: 'SET_LOGGED_USER', loggedUser: userInfo})
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
            // setCurrentUser(null)
            // setAppState(null)
            dispatch({type: 'SET_LOGGED_USER', user: null})
        }).catch((error)=>{
            console.log(error)
            alert(error)
        }).finally(()=>{
            hideOverlay()
        })
        
    }    

    useEffect(()=>{    
        (async()=>{
            const user = await AsyncStorageHelper.getObject('user')            
            if (user){
                dispatch({type: 'SET_LOGGED_USER', loggedUser: user })
            }
            dispatch({type: 'SET_RENDER_APP', renderApp: true })
        })()
        mountedRef.current = true                  
        return ()=>{
            mountedRef.current = false
        }
    }, [])

    const showOverlay =(info)=>{
        setOverlayLabel(info)
        setShowOverlay(true)
    }
    const hideOverlay = ()=>{
        setShowOverlay(false)
    }
    const toggleOverlay = (info)=>{
        setOverlayLabel(info)
        setShowOverlay(prevState=>!prevState)
    } 
    return React.useMemo(()=>{
        console.log('Wrapper App')
        return ( 
            <>                 
                <View style={styles.top}></View> 
                { state.renderApp && updateStatus === 'completed' && state.loggedUser && (                    
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
                )                                
                } 
                { (state.renderApp && updateStatus === 'completed' && !state.loggedUser) && <FacebookLogin loginSuccess={loginSuccess} /> }
                {overlay && <OverlayIndicator overlayLabel={overlayLabel} /> }                
        
                {updateStatus !== 'completed' && <View style={{
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
                    <Text style={{color: 'white'}}>{updateMessage}</Text>
                </View> 
                } 
            </>
        )},[state.renderApp, state.loggedUser, overlay, updateMessage, updateStatus]) 
}
WrapperApp.whyDidYouRender = {
    logOnDifferentValues: false
}
const App = () =>{
    //const [state, dispatch] = useContext(Context) 
    console.log('App')   
    return (
        <SafeAreaView style={styles.container}>  
            <Store>
                <WrapperApp/>                         
            </Store>      
            <StatusBar style="light" />      
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