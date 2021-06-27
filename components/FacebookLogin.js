import React, { useState } from 'react';
import { StyleSheet, Text, Platform,  View, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as Facebook from 'expo-facebook';
import { color } from '../utils'

const FacebookLogin = (props)=>{
    const [isLoggedin, setLoggedinStatus] = useState(false);
    async function fakeLogin(){
        const data = {
            id: '10222108852244678',
            name: 'Alain Pérez Balart',
            email: 'balartalain@gmail.com',
            picture:{
                data:{
                    url: '../assets/picture.png'
                }
            }
        }
        setLoggedinStatus(true);
        props.onSuccess({ ...data, token: 'EAAInQQgBZBoMBAPNJy7ZBHHKXwzlC7KjRc20IddoWWdZAZAqZC9rsbpYrUZC2HpHv6VRsEr5JhIExQrT6VCQj9ZBOpJxKKV9A8Mo3kgQp2hZAduDkQnff1Ine2cfJkD8gxfHyrZCVknsPZAddOZC0OlckXwzqbhoTwZB1UWBKRsJJEoAsCc1bBATQFCPhttVrEZBS3YRKGZCvkAs4ErTZCcIGxSlZCIgDjyuVSfIF0X4CBJcaR3MUAZDZD' })
    }
    async function logIn() {
        try {
          await Facebook.initializeAsync({
            appId: '606110214126211',
          });
          const {
            type,
            token,
            expirationDate,
            permissions,
            declinedPermissions,
          } = await Facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile', 'email'],
          });
          if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            setLoggedinStatus(true);
            const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`);
            const data = await response.json()            
            props.onSuccess({ ...data, token })
            //Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
          } else {
            // type === 'cancel'
          }
        } catch ({ message }) {
          alert(`Facebook Login Error: ${message}`);
        }
      }
    const logout = () => {
      Facebook.logOutAsync();
      setLoggedinStatus(false);
      setUserInfo(null);
      setImageLoadStatus(false);
    }
    return (
      !isLoggedin ? (
        <View style={styles.container}>
          <Image
            style={{ width: 220, height: 220, borderRadius: 50, marginVertical: 20 }}
            source={require("../assets/icons8-money-bag-100.png")} />
          <TouchableOpacity style={styles.loginBtn} onPress={()=>{ if (Platform.OS !== 'web') logIn();else fakeLogin()}}>
            <Text style={{ color: "#fff" }}>Login with Facebook</Text>
          </TouchableOpacity>
        </View>
      ):
      ( <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={color.primaryGreen}/>
          <Text style={{marginVertical: 20}}>Registrando usuario en Money Share</Text>
        </View>
      )
        
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e9ebee',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginBtn: {
      backgroundColor: '#4267b2',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5
    },
    logoutBtn: {
      backgroundColor: 'grey',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      position: "absolute",
      bottom: 0
    },
  });
  export default FacebookLogin