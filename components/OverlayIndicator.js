import React from 'react'
import { Text, Dimensions, ActivityIndicator } from 'react-native'
import FadeInView from './FadeInView'
import {color} from './../utils'

const dm = Dimensions.get('window')
const OverlayIndicator = ({animated=true, overlayLabel, top=0})=>{
    return (  
             
        <FadeInView duration={500} style={{  position: 'absolute',
            width: dm.width,
            //height: height || dm.height,
            zIndex: 2,
            alignItems: 'center',
            justifyContent:'center',
            top: top || 0,
            bottom: 0
        }}>                        
            <ActivityIndicator size="large" animated color={color.primaryGreen}/>                
            {overlayLabel && <Text style={{marginTop: 5}}>{overlayLabel}</Text>}
        </FadeInView>
                      
    )
}
export default OverlayIndicator