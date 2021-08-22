import React, {useState, useEffect, useRef, useContext} from 'react'
import {  View, TouchableOpacity, ScrollView, Text } from 'react-native'
import { ListItem, CheckBox, Button } from 'react-native-elements'
import Heroku from '../controllers/index'
import useAsync from '../hooks/useAsync'
import { OverlayContext } from './OverlayContext'
import { useUserDataContextHook } from './UserDataContext'
import {toBoolean} from '../utils'
import AsyncStorageHelper  from '../AsyncStorageHelper'
import OverlayIndicator from './OverlayIndicator'
import whyDidYouRender from '@welldone-software/why-did-you-render'
import { Context } from '../Store'

whyDidYouRender(React, {
    //onlyLogs: true,
    titleColor: 'green',
    diffNameColor: 'darkturquoise'
})

const Users = ({navigation})=>{
    const [globalState] = useContext(Context)
    const [users, setUsers] = useState(null)
    const [ execute, status, value, error ] = useAsync()
    const [ setSupervisor, statusSP, valueSP, errorSP ] = useAsync()
    //const {showOverlay, hideOverlay} = useContext(OverlayContext)
    const mountedRef = useRef(false)
    const scrollOffset = useRef(0)
    const {loggedUser} = globalState

    const load = async()=>{
        //showOverlay('Obteniendo usuarios...')
        //const me = await AsyncStorageHelper.getObject('me')
        await execute(Heroku.getUsers, [], (response)=>{
            setUsers(response.data)
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
        await setSupervisor(Heroku.setSupervisor, [id], ()=>{
            const _users = {... users}
            _users[id].supervisor = supervisor
            setUsers(_users)
        })       
                
    }
    const changeUser = (id)=>{
        if (!toBoolean(users[loggedUser.id].supervisor))
            return false
        navigation.navigate('Home', { changeUser: {...users[id], id} })
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
                    <Text style={{marginBottom: 10}}>{error.message}</Text>
                    <Button title="Volver a intentarlo" 
                        onPress={load}
                        buttonStyle={{
                            backgroundColor:'red',
                            paddingVertical: 15
                        }}
                    />
                </View>                                         
            )
            }
            { statusSP === 'pending' && 
                <OverlayIndicator overlayLabel={'Guardando cambios'} />
            }
            { statusSP === 'error' && 
                <View><Text>{alert(errorSP.message)}</Text></View>
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