import React, {useState, useEffect, useRef, useContext} from 'react'
import {  View, TouchableOpacity, ScrollView } from 'react-native'
import { ListItem, CheckBox, Button } from 'react-native-elements'
import Heroku from '../controllers/index'
import { OverlayContext } from './OverlayContext'
import { useUserDataContextHook } from './UserDataContext'

const Users = (props,{navigation})=>{

    const {showOverlay, hideOverlay} = useContext(OverlayContext)
    const {currentUser, setCurrentUser, logout} = useUserDataContextHook()
    const [users, setUsers] = useState(null)
    const mountedRef = useRef(false)
    useEffect(()=>{
        mountedRef.current = true
        showOverlay('Obteniendo usuarios...')
        //const me = await AsyncStorageHelper.getObject('me')
        Heroku.getUsers().then(_users=>{
            if (mountedRef.current){
                setUsers(_users.data)
            }
        }).catch(()=>{
            alert('Error de conexión')
        }).finally(()=>{
            hideOverlay()
        })
        return () => {
            mountedRef.current = false
        } 
    }, [])
    const _setIsSupervisor = (id, isSupervisor)=>{
        if (!users[currentUser.id].isSupervisor)
            return false
        showOverlay('Cambiando permisos de usuario...')       
        Heroku.setSupervisor(id, {'isSupervisor': isSupervisor}).then(()=>{
            if (mountedRef.current){
                const _users = {... users}
                _users[id].supervisor = isSupervisor
                setUsers(_users)
            }
        }).catch(err=>{
            alert(err)
        }).finally(()=>{
            hideOverlay()
        })
    }
    const changeUser = (userId)=>{
        if (!(users[currentUser.id].isSupervisor))
            return false
        setCurrentUser(users[userId])
        navigation.navigate('Home')
    }
    return (
        <View style={{flex:1}}>
            <ScrollView>
                { users  && 
                Object.keys(users).map((id,i)=>(                                     
                    <ListItem key={i} bottomDivider>                   
                        <ListItem.Content>
                            <TouchableOpacity style={{width:'100%'}} onPress={()=>changeUser(id)}>
                                <ListItem.Title>{users[id].name}</ListItem.Title>
                            </TouchableOpacity>
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
                                onPress={()=>_setIsSupervisor(id, users[id].supervisor === 'true'?'false':'true')} 
                                checked={users[id].supervisor === 'true'} />
                            </View>
                        </ListItem.Content>
                    </ListItem>
                    
                ))
                
                }
            </ScrollView>
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