import React, {useState, useEffect} from 'react'
import { SafeAreaView, StyleSheet, Text} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Spinner from 'react-native-loading-spinner-overlay'
import Constants from 'expo-constants'
import {AppUserProvider, useAppUser} from './components/AppUserContext'
import MainScreen from './components/MainScreen'
import AddExpense from './components/AddExpense'
import FacebookLogin from './components/FacebookLogin'
import AsyncStorageHelper  from './AsyncStorageHelper'
import OverlayIndicator from './components/OverlayIndicator'
import Users from './components/Users'

function useForceUpdate(){
    const [value, setValue] = useState(0) // integer state
    return () => setValue(value + 1) // update the state to force render
}

const Stack = createStackNavigator()
const App = () =>{
    const [appUser, setAppUser] = useState(null)
    const [overlay, setShowOverlay] = useState(false)
    const [loading, setLoading] = useState(true)
    //const {appUser} = useAppUser()
    // const success = (_userInfo)=>{           
    //     registerUser({
    //         id: _userInfo.id,
    //         name: _userInfo.name,
    //         email: _userInfo.email
    //     }).then(()=>{
    //         //AsyncStorageHelper.saveItem('token', _userInfo.token)
    //         AsyncStorageHelper.saveObject('me', _userInfo)
    //         setUserInfo(_userInfo)
    //     }).catch(()=>{
    //         alert('No tiene conexión a internet')      
    //         forceUpdate()
    //     })
    
    // }
    // useEffect(()=>{
    //     const checkUser = async()=>{   
    //         const _userInfo = await AsyncStorageHelper.getObject('me')
    //         if (_userInfo != null){
    //             setUserInfo(_userInfo)
    //         }
    //     }
    //     checkUser()
    // }, [])
    // const logout = ()=>{
    //     AsyncStorageHelper.removeObject('token')
    //     AsyncStorageHelper.removeObject('me')
    //     setUserInfo(null)        
    // }
    useEffect(()=>{        
        (async()=>{
            const _appUser = await AsyncStorageHelper.getObject('appUser')
            if (_appUser){
                setAppUser(_appUser)
            }
        })()
    }, [])
    const _setAppUser = (user)=>{
        setAppUser(user)
    }
    const showOverlay =(show)=>{
        setShowOverlay(show)
    }
    const toggleOverlay = ()=>{
        setShowOverlay(!overlay)
    }
    return (
        <SafeAreaView style={styles.container}> 
            <AppUserProvider updatedUser={_setAppUser}>
                { appUser ?
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
                            > 
                                {(props) => <Users  {...props} onLogout={logout}/>}
                            </Stack.Screen>
                        </Stack.Navigator>              
                    </NavigationContainer>                
                    : <FacebookLogin />
                } 
            </AppUserProvider>
            {overlay && <OverlayIndicator/> }
        </SafeAreaView>
    )  
}
const styles = StyleSheet.create({    
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
})
export default App