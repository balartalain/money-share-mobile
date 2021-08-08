import React, { useState } from 'react'
import { StyleSheet, Text, Platform,  View, Image } from 'react-native'
import * as Facebook from 'expo-facebook'
import { Button } from 'react-native-elements'

const FacebookLogin = ({loginSuccess})=>{
    const [messageInfo, setMessageInfo] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [isLoginSuccess, setLogingSuccess] = useState(false)
    async function fakeLogin(){
        try {
            const data = {
                id: '10222108852244678',
                name: 'Alain Pérez Balart',
                email: 'balartalain@gmail.com',
                token: 'EAAInQQgBZBoMBAPNJy7ZBHHKXwzlC7KjRc20IddoWWdZAZAqZC9rsbpYrUZC2HpHv6VRsEr5JhIExQrT6VCQj9ZBOpJxKKV9A8Mo3kgQp2hZAduDkQnff1Ine2cfJkD8gxfHyrZCVknsPZAddOZC0OlckXwzqbhoTwZB1UWBKRsJJEoAsCc1bBATQFCPhttVrEZBS3YRKGZCvkAs4ErTZCcIGxSlZCIgDjyuVSfIF0X4CBJcaR3MUAZDZD',
                picture:{
                    data:{
                        url: '../assets/picture.png'
                    }
                },
                expirationDate: new Date()
            }
            setTimeout(()=>{
                loginSuccess({ ...data })}, 3000)     
        } catch ({ message }) {
            setMessageInfo(null)
            alert(`Facebook Login Error: ${message}`)
        }
    }
    async function logIn() {
        try {
            setLoading(true)
            await Facebook.initializeAsync({
                appId: '606110214126211',
            })
            const {
                type,
                token,
                expirationDate,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', 'email'],
            })
            if (type === 'success') {
            // Get the user's name using Facebook's Graph API
                setMessageInfo('Recuperando información de facebook')
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
                const data = await response.json()  
                setLogingSuccess(true) 
                loginSuccess({ ...data, token, expirationDate }) 
            } else {
            // type === 'cancel'
            }
        } catch ({ message }) {
            setLogingSuccess(false)
            alert(`Facebook Login Error: ${message}`)
        }
        finally{
            setLoading(false)
            setMessageInfo(null)                        
        }
    }
    return (     
        !isLoginSuccess &&
        <View style={styles.container}>
            <Image
                style={{ width: 220, height: 220, borderRadius: 50, marginVertical: 10 }}
                source={require('../assets/icons8-money-bag-100.png')} />
            { messageInfo && <Text style={{marginBottom: 10}}>{messageInfo}</Text> }
            <Button 
                title='Login with Facebook'
                loading={isLoading}
                onPress={()=>{ if (!isLoading){ 
                    if (Platform.OS !== 'web') logIn();else fakeLogin()
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
        //backgroundColor: '#e9ebee',
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
    logoutBtn: {
        backgroundColor: 'grey',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        position: 'absolute',
        bottom: 0
    },
})
export default FacebookLogin