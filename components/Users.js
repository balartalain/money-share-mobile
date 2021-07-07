import React, {useState, useEffect, useRef} from 'react'
import {  View, TouchableOpacity, ScrollView } from 'react-native'
import { ListItem, CheckBox, Button } from 'react-native-elements'
import PropTypes from 'prop-types'
import * as Facebook from 'expo-facebook'
import {getUsers, setSupervisor} from '../controllers'
import AppUserConext from './AppUserContext'
import OverlayIndicator from './OverlayIndicator'
import AsyncStorageHelper from '../AsyncStorageHelper'

const Users = (props,{navigation})=>{

    const [users, setUsers] = useState(null)
    const [loading, setLoading] = useState(false)
    const mountedRef = useRef(false)
    useEffect(()=>{
        mountedRef.current = true
        setLoading(true)
        //const me = await AsyncStorageHelper.getObject('me')
        getUsers().then(_users=>{
            if (mountedRef.current){
                setUsers(_users.data)
            }
        }).catch(()=>{
            alert('Error de conexión')
        }).finally(()=>{
            setLoading(false)
        })
        return () => {
            mountedRef.current = false
        } 
    }, [])
    const _setIsSupervisor = (id, isSupervisor)=>{
        
        setLoading(true)        
        setSupervisor(id, {'isSupervisor': isSupervisor}).then(()=>{
            if (mountedRef.current){
                const _users = {... users}
                _users[id].supervisor = isSupervisor
                setUsers(_users)
            }
        }).catch(err=>{
            alert(err)
        }).finally(()=>{
            setLoading(false)
        })
    }
    const logout = ()=>{      
        setLoading(true)    
        Facebook.logOutAsync().then (async ()=>{
            const token = await AsyncStorageHelper.getItem('token')
            var lParams= 'access_token='+token
            await fetch(
                'https://graph.facebook.com/'+10222108852244678+'/permissions',{
                    method : 'DELETE',
                    body: lParams
                })
            props.onLogout()
        }).catch((error)=>{
            console.log(error)
            alert(error)
        }).finally(()=>{
            setLoading(false)
        })
        
    }
    return (
        <View style={{flex:1}}>
            <ScrollView>
                { users  && 
                Object.keys(users).map((id,i)=>(                                     
                    <ListItem key={i} bottomDivider>                   
                        <ListItem.Content>
                            <TouchableOpacity style={{width:'100%'}} onPress={()=>navigation.navigate('Home', { changeUser: {...users[id], id} })}>
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
            { loading && <OverlayIndicator />}
        </View>        
    )
}
export default Users