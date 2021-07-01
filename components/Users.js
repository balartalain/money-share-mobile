    import React, {useState, useEffect, useRef} from 'react'
    import { SafeAreaView, ScrollView, View, TouchableOpacity, Pressable, Text } from 'react-native';
    import { Navigation } from 'react-native-navigation';
    import { ListItem, CheckBox } from 'react-native-elements'
    import {getUsers, setSupervisor} from '../controllers';
    import OverlayIndicator from './OverlayIndicator';

    const Users = ({navigation})=>{
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(false);
    const mountedRef = useRef(false)
    useEffect(()=>{
        mountedRef.current = true
        setLoading(true);
        getUsers().then(_users=>{
                if (mountedRef.current){
                    setUsers(_users.data);
                }
            }).catch(err=>{
                alert('Error de conexión')
            }).finally(()=>{
                setLoading(false);
            })
        return () => {
          mountedRef.current = false
        }; 
    }, [])
    const _setIsSupervisor = (id, isSupervisor)=>{
        
        setLoading(true);        
        setSupervisor(id, {'isSupervisor': isSupervisor}).then(res=>{
            if (mountedRef.current){
                const _users = {... users};
                _users[id].supervisor = isSupervisor;
                setUsers(_users);
            }
        }).catch(err=>{
            alert("No tiene conexión a internet")
        }).finally(()=>{
            setLoading(false);
        })
    }
    return (
        <View style={{flex:1}}>
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
                                        onPress={()=>_setIsSupervisor(id, users[id].supervisor === "true"?"false":"true")}
                                        checked={users[id].supervisor === "true"} />
                        </View>
                    </ListItem.Content>
                  </ListItem>
                ))
            }
            { loading && <OverlayIndicator />}
        </View>        
    )
}
export default Users;