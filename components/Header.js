import React, {useState, useEffect, useRef, memo} from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions} from "react-native";
import { Avatar, Divider, Button } from "react-native-elements";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import AsyncStorageHelper from '../AsyncStorageHelper';
import { color, currentMonth } from './../utils'
import Menu from './Menu';
import MonthsTabView from './MonthsTabView';
import { getUserData } from '../controllers/index';
import {currentYear, equalsIntegers} from '../utils';
import FadeInView from './FadeInView'

const Delete = (props) =>{
  const [deleting, setDeleting] = useState(false);

  useEffect(()=>{
    setDeleting(false);
    return ()=>{
      setDeleting(false);
    }
  }, [])
  return (
    <FadeInView duration={500} style={{
      flex:1,
      flexDirection: 'row',   
      justifyContent: 'space-between',
      alignItems: 'center',            
    }}>
    <TouchableOpacity
          onPress={props.onCancelDelete} >
      <Text><MaterialCommunityIcons name="arrow-left-circle-outline" size={28} color="white" /></Text>
      </TouchableOpacity>
      <Button
          onPress={()=>{setDeleting(true); props.onDelete()}}
          type="clear"
          title = {<MaterialCommunityIcons name="delete" size={28} color="white" />}
          loadingProps={{
            color: 'white',
            
          }} 
          loading={deleting}
        >
            
      </Button>
    </FadeInView>
)}
const Header = (props)=>{  
    return (
      <View style={{   
        backgroundColor: color.primaryGreen,        
        paddingHorizontal: 20,
        height:65
      }}>  
        { props.deleteItems?
          <Delete onCancelDelete={props.onCancelDelete} onDelete={props.onDelete} />
        :(
          <View style={{
            flex:1,
            flexDirection: 'row',   
            justifyContent: 'space-between',
            alignItems: 'center',            
          }}>          
            <Text style={{fontSize:18, color: 'white'}}>Money share</Text>
            <Avatar
              rounded
              overlayContainerStyle={{backgroundColor: 'gray'}}
              size="medium"
              title="BP"
              onPress={() => props.navigation.openDrawer()}
              activeOpacity={0.7}        
            />
          </View>
        )}
      </View>
    )
  }
  export default Header;