import React, {useState, useEffect, useRef, memo} from 'react'
import { View, Button, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions} from "react-native";
import { Avatar, Divider } from "react-native-elements";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import AsyncStorageHelper from '../AsyncStorageHelper';
import { color, currentMonth } from './../utils'
import Menu from './Menu';
import MonthsTabView from './MonthsTabView';
import { getUserData } from '../controllers/index';
import {currentYear, equalsIntegers} from '../utils';
import FadeInView from './FadeInView'

const Header = (props)=>{
    return (
      <View style={{   
        backgroundColor: color.primaryGreen,        
        paddingHorizontal: 20,
        height:65
      }}>  
        { props.deleteItems?
        <FadeInView duration={500} style={{
          flex:1,
          flexDirection: 'row',   
          justifyContent: 'space-between',
          alignItems: 'center',            
        }}>
          <TouchableOpacity
              onPress={props.onCancelDelete} >
          <Text><MaterialCommunityIcons name="arrow-left-circle-outline" size={30} color="white" /></Text>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={props.onDelete} >
            <Text><MaterialCommunityIcons name="delete" size={30} color="white" /></Text>
          </TouchableOpacity>
        </FadeInView>
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
              onPress={() => console.log("Works!")}
              activeOpacity={0.7}        
            />
          </View>
        )}
      </View>
    )
  }
  export default Header;