import React, {useState, useEffect, useRef, useContext} from 'react'
import {  View, TouchableOpacity, ScrollView } from 'react-native'
import { ListItem, CheckBox, Button } from 'react-native-elements'
import Firebase from '../controllers/firebaseAPI'
import { OverlayContext } from './OverlayContext'
import { useUserDataContextHook } from './UserDataContext'
import {toBoolean} from '../utils'
import AsyncStorageHelper  from '../AsyncStorageHelper'
import { CONNECTION_ERROR } from '../ErrorConstants'

const Users = ({navigation})=>{

    const {showOverlay, hideOverlay} = useContext(OverlayContext)
    const {currentUser, setCurrentUser, logout} = useUserDataContextHook()
    const [users, setUsers] = useState(null)
    const [userLogged, setUserLogged] = useState(null)
    const mountedRef = useRef(false)
    const scrollOffset = useRef(0)
    const load = async()=>{
        setUserLogged(await AsyncStorageHelper.getObject('user'))  
        showOverlay('Obteniendo usuarios...')
        //const me = await AsyncStorageHelper.getObject('me')
        Firebase.getUsers().then(_users=>{
            setUsers(_users)                
            
        }).catch((e)=>{
            console.log(e)
            alert(CONNECTION_ERROR)
        }).finally(()=>{
            hideOverlay()
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
        const userLogged = await AsyncStorageHelper.getObject('user')
        if (!toBoolean(users[userLogged.id].supervisor)){
            return
        }
        const supervisor = !toBoolean(users[id].supervisor)
        showOverlay('Cambiando permisos de usuario...')       
        Firebase.setSupervisor(id, {'isSupervisor': supervisor}).then(()=>{
            if (mountedRef.current){
                const _users = {... users}
                _users[id].supervisor = supervisor
                setUsers(_users)
            }
        }).catch(err=>{     
            alert(err)
        }).finally(()=>{
            hideOverlay()
        })
    }
    const changeUser = (id)=>{
        if (!toBoolean(users[userLogged.id].supervisor))
            return false
        navigation.navigate('Home', { changeUser: {...users[id], id} })
    }
    return (
        <View style={{flex:1}}>
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
                            { toBoolean(users[userLogged.id].supervisor) &&
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