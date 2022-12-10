import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import { Button } from 'react-native-elements'
import Firebase from '../controllers/firebaseAPI'
import { CONNECTION_ERROR } from '../ErrorConstants'

const LoginByCode = ({loginSuccess})=>{
    const [isLoading, setLoading] = useState(false)
    const [code, setCode] = useState(null)
    const [error, setError] = useState(null)
    const logIn = ()=>{
        setLoading(true)
        setError(null)
        Firebase.getUsers().then(users=>{
            const userId = Object.keys(users).find(id=>id===code)            
            if (userId){
                const user = users[userId]
                if (!user.denied){
                    loginSuccess({...user, id:userId})
                }
                else{
                    setError('Acceso denegado')
                }
                return
            }   else{
                setError('Código incorrecto')
            }            
        }).catch((e)=>{
            console.log(e)
            alert(CONNECTION_ERROR)
        }).finally(()=>{
            setLoading(false)
        })  

    }
    return (
        <View style={styles.container}>            
            <TextInput style={styles.field} placeholder='Introduzca el código'
                onChangeText={(text) => setCode(text) }
            />
            { error && <Text style={{marginBottom: 10}}>{error}</Text> }
            <Button 
                title='Login'
                loading={isLoading}
                onPress={()=>{ if (!isLoading){ 
                    logIn()
                }
                }}
                buttonStyle={{
                    width: 200
                }}                 
            >
            </Button>
        </View> 
    )
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#const FacebookLogin = ({loginSuccess})=>{e9ebee',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginBtn: {
        backgroundColor: '#4267b2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: 100
        
    },
    field: {    
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(216, 216, 216)'    
    },
})
export default LoginByCode