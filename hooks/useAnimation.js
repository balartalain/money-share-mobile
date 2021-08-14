import { Animated } from 'react-native'
import { useEffect } from 'react'

export const useAnimation = (
    {   fromValue = 0, 
        toValue = 1, 
        duration = 300, 
        useNativeDriver = true,
        autoStart = true

    } = {},
    onAnimationEnd = ()=>{},
) => {
    const animation = new Animated.Value(fromValue)

    const start = (animEndCallback)=>{
        //animation.setValue(fromValue)
        Animated.timing(animation, {
            useNativeDriver,
            toValue,
            duration,
        }).start((finished)=>{
            if (autoStart){
                onAnimationEnd(finished)
            }else if (animEndCallback){
                animEndCallback(finished)
            }
        })
    }

    useEffect(() => {        
        if (autoStart){
            start()
        }
    }, [autoStart])

    return [animation,  start]
}