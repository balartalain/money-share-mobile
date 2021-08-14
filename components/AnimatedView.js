import React, {useContext, useEffect, useState, useRef} from 'react'
import { View, Text, TouchableOpacity, Dimensions, Animated} from 'react-native'
import PropTypes from 'prop-types'
import Ripple from 'react-native-material-ripple'
import { AntDesign } from '@expo/vector-icons' 
import { UserDataContext, useUserDataContextHook } from './UserDataContext'
import { color } from './../utils'
import { getEnvironment } from '../utils'
import FadeInView from './FadeInView'
import { useAnimation } from '../hooks/useAnimation'

const AnimatedView = (props) =>{
    const [shouldBeRender, setShouldBeRender] = useState(false)
    const isVisible = useRef(false)
    const animation = useRef(new Animated.Value(0)).current

    // useEffect(() => {
    //     animation.addListener((value) => {
    //         console.log(value)
    //     })
    
    //     return () => {
    //         animation.removeAllListeners()
    //     }
    // }, [])

    useEffect(() => {
        if (!props.visible && isVisible.current ){
            animation.setValue(1)
            Animated.timing(animation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start(()=>{
                isVisible.current = false
                setShouldBeRender(false)
            })
            
        } else  
        if (props.visible && !isVisible.current ){  
            setShouldBeRender(true)                                
            animation.setValue(0)
            Animated.timing(animation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }).start((finished)=>{
                isVisible.current = true
            })
        } else  
        if (!props.visible && !isVisible.current ){
            setShouldBeRender(false)
        }

    }, [props.visible])

    const opacityStyle = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    })
    const transform = [{
        scale: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1]
        })
    }]

    return (
        <> 
            { shouldBeRender &&
                <Animated.View            
                    style={[{...props.style},{
                        opacity: opacityStyle,
                        transform: transform
                    }]}>
                    {props.children}
                </Animated.View>
            }
        </>
    )}
export default AnimatedView