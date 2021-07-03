import React, {useState, useEffect, useRef} from 'react'
import { SafeAreaView, ScrollView, View, TouchableOpacity, Pressable, Text, StyleSheet, Dimensions, StatusBar } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Constants from 'expo-constants'
import MainScreen from './components/MainScreen'
import AddExpense from './components/AddExpense'
import FacebookLogin from './components/FacebookLogin'
import AsyncStorageHelper  from './AsyncStorageHelper'
import {registerUser} from './controllers'
import Users from './components/Users'

function useForceUpdate(){
    const [value, setValue] = useState(0) // integer state
    return () => setValue(value => value + 1) // update the state to force render
}

const Stack = createStackNavigator()
const App = () =>{
    const forceUpdate = useForceUpdate()
    const [userInfo, setUserInfo] = useState(null)
    const success = (_userInfo)=>{           
        registerUser({
            id: _userInfo.id,
            name: _userInfo.name,
            email: _userInfo.email
        }).then(()=>{
            AsyncStorageHelper.saveItem('token', _userInfo.token)
            AsyncStorageHelper.saveObject('me', _userInfo)
            setUserInfo(_userInfo)
        }).catch(()=>{
            alert('No tiene conexión a internet')      
            forceUpdate()
        })
    
    }
    useEffect(()=>{
        const checkUser = async()=>{   
            await AsyncStorageHelper.removeObject('me')
            const _userInfo = await AsyncStorageHelper.getObject('me')
            if (_userInfo != null){
                setUserInfo(_userInfo)
            }
        }
        checkUser()
    }, [])
    const logout = ()=>{
        AsyncStorageHelper.removeObject('token')
        AsyncStorageHelper.removeObject('me')
        setUserInfo(null)        
    }
    return (
        <SafeAreaView style={styles.container}>  
            { userInfo ?(
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
            ):<FacebookLogin onSuccess={(userInfo)=>success(userInfo)} /> 
            } 
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