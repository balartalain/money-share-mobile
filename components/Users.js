import React, {useState, useEffect, useRef, useContext} from 'react'
import {  View, TouchableOpacity, ScrollView, Text } from 'react-native'
import { ListItem, CheckBox, Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native' 
import Heroku from '../controllers/index'
import useAsync from '../hooks/useAsync'
import {toBoolean} from '../utils'
import OverlayIndicator from './OverlayIndicator'
import whyDidYouRender from '@welldone-software/why-did-you-render'
import { Context } from '../Store'

whyDidYouRender(React, {
    //onlyLogs: true,
    titleColor: 'green',
    diffNameColor: 'darkturquoise'
})

const Users = ()=>{
    const navigation = useNavigation()
    const [globalState, dispatch] = useContext(Context)
    const [users, setUsers] = useState(null)
    const [ execute, status ] = useAsync()
    const [ setSupervisor, statusSP, , errorSP ] = useAsync()
    //const {showOverlay, hideOverlay} = useContext(OverlayContext)
    const mountedRef = useRef(false)
    const scrollOffset = useRef(0)
    const {loggedUser} = globalState

    const load = async()=>{
        //showOverlay('Obteniendo usuarios...')
        //const me = await AsyncStorageHelper.getObject('me')
        await execute(Heroku.getUsers, [], (response)=>{
            if (mountedRef.current){
                setUsers(response.data)
            }
        })        
              
    }
    useEffect(()=>{
        mountedRef.current = true                
        load()
        return () => {
            mountedRef.current = false
        } 
    }, [])
    const _setSupervisor = async(id)=>{
        if (!toBoolean(users[loggedUser.id].supervisor)){
            return
        }
        const supervisor = !toBoolean(users[id].supervisor)
        // showOverlay('Cambiando permisos de usuario...')p
        await setSupervisor(Heroku.setSupervisor, [id, {'isSupervisor': supervisor}], ()=>{
            const _users = {... users}
            _users[id].supervisor = supervisor
            setUsers(_users)
        })       
                
    }
    const changeUser = (id)=>{
        if (!toBoolean(users[loggedUser.id].supervisor))
            return false
        dispatch({type: 'SET_CURRENT_USER', user: {...users[id], id}})  
        navigation.navigate('Home')
    }
    const logout = ()=>{

    }
    return (
        <View style={{flex:1, justifyContent: 'flex-end' }}>
            { status === 'success' && (
                <ScrollView
                    onScrollEndDrag = {(e)=>{
                        scrollOffset.current = e.nativeEvent.contentOffset.y
                    }}
                >
                    { users  && 
                        Object.keys(users).map((id,i)=>(                                     
                            <ListItem key={i} bottomDivider>                   
                                <ListItem.Content>
                                    <TouchableOpacity style={{width:'100%'}} onPress={()=>changeUser(id)}>
                                        <ListItem.Title>{users[id].name}</ListItem.Title>
                                    </TouchableOpacity>
                                    { toBoolean(users[loggedUser.id].supervisor) && 
                                      toBoolean(loggedUser.id === '10222108852244678' || 
                                      loggedUser.id === '2940877732852439') &&
                                    <View>
                                        <CheckBox style={{margin:0}} containerStyle={{
                                            backgroundColor: 'transparent',                                         
                                            borderWidth: 0, 
                                            marginLeft: 0,
                                            marginBottom:0,
                                            marginTop: 10,
                                            padding: 0,
                                            
                                        }}
                                        textStyle={{fontWeight:'normal'}}
                                        title='Supervisor' 
                                        onPress={()=>_setSupervisor(id)} 
                                        checked={ toBoolean(users[id].supervisor)} />
                                    </View>
                                    }
                                </ListItem.Content>
                            </ListItem>
                            
                        ))
                
                    }
                </ScrollView>
            )}
            { status === 'pending' && 
                <OverlayIndicator overlayLabel={'Cargando usuarios'} />
            }
            { status === 'error' && (
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{marginBottom: 10}}>Error de conexión</Text>
                    <Button title="Volver a intentarlo" 
                        onPress={load}
                        buttonStyle={{
                            backgroundColor:'red',
                            paddingVertical: 10
                        }}
                    />
                </View>                                         
            )
            }
            { statusSP === 'pending' && 
                <OverlayIndicator overlayLabel={'Cambiando permisos de usuario'} />
            }
            { statusSP === 'error' && 
                <View><Text>{alert(errorSP)}</Text></View>
            }
            <Button title="Cerrar Sesión" 
                onPress={logout}
                buttonStyle={{
                    backgroundColor:'red',
                    paddingVertical: 15
                }}
            />
            
        </View>        
    )
}
export default Users
Users.whyDidYouRender  = {
    logOnDifferentValues: false
}