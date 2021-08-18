import React from 'react'
import { View, Text, Dimensions, ActivityIndicator } from 'react-native'
import FadeInView from './FadeInView'
import {color} from './../utils'

const {width, height} = Dimensions.get('window')
const OverlayIndicator = ({animated, overlayLabel, top})=>{
    return (  
             
        <FadeInView duration={500} style={{  position: 'absolute',
            width: width,
            height: height,
            zIndex: 2,
            alignItems: 'center',
            justifyContent:'center',
            top: top || 0
        }}>
            
            <View style={{  
                position: 'absolute',
                width: width,
                height: height,
                backgroundColor: 'black',
                opacity: 0.1
            }}>
            </View>
            <ActivityIndicator size="large" animated={animated === undefined?true:animated} color={color.primaryGreen}/>                
            {overlayLabel && <Text style={{marginTop: 5}}>{overlayLabel}</Text>}
        </FadeInView>
                      
    )
}
export default OverlayIndicator