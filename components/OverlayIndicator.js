import React from 'react'
import { View,Dimensions, ActivityIndicator } from 'react-native'
import FadeInView from './FadeInView'
import {color} from './../utils'

const {width, height} = Dimensions.get('window')
const OverlayIndicator = ()=>{
    return (  
             
        <FadeInView duration={500} style={{  position: 'absolute',
            width: width,
            height: height,
            zIndex: 2,
            alignItems: 'center',
            justifyContent:'center'
        }}>
            
            <View style={{  
                position: 'absolute',
                width: width,
                height: height,
                backgroundColor: 'black',
                opacity: 0.1
            }}>
            </View>
            <ActivityIndicator size="large" color={color.primaryGreen}/>                
  
        </FadeInView>
                      
    )
}
export default OverlayIndicator