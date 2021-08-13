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

const { width } = Dimensions.get('window')
const ENV = getEnvironment().envName

const Delete = (props) =>{
    const {deleteItems, markedItemsToDelete, setMarkedItemsToDelete} = useUserDataContextHook()
    const [trashColor, setTrashColor] = useState('white')
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
                console.log(finished)
                isVisible.current = true
            })
        } else  
        if (!props.visible && !isVisible.current ){
            setShouldBeRender(false)
        }

    }, [props.visible])

    useEffect(() => {
        if (markedItemsToDelete.length > 1){
            setTrashColor('orange')
            setTimeout(()=>{setTrashColor('white')}, 200)
        }
    }, [markedItemsToDelete.length])
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
                    style={{
                        flex:1,
                        flexDirection: 'row',   
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 10,            
                        top:0, 
                        left: 0,           
                        height: 65,        
                        width: width,
                        position: 'absolute',
                        zIndex: 1,
                        backgroundColor: color.primaryGreen,
                        opacity: opacityStyle,
                        transform: transform
                               
                    }}>
                    <Ripple onPress={()=>setMarkedItemsToDelete([])} >
                        <AntDesign name="arrowleft" size={24} color='white' />
                    </Ripple>
                    <Ripple onPress={()=>deleteItems()} >
                        <AntDesign name="delete" size={24} color={trashColor} />
                    </Ripple>
                </Animated.View>
            }
        </>
    )}
const Header = (props)=>{  
    const {currentUser, markedItemsToDelete} = useContext(UserDataContext)
    const {navigation} = props
    return (
        <View style={{   
            backgroundColor: color.primaryGreen,        
            paddingHorizontal: 20,
            height:65
            
        }}>  
            <Delete visible={ markedItemsToDelete.length > 0} />
            <View style={{
                flex:1,
                flexDirection: 'row',   
                justifyContent: 'space-between',
                alignItems: 'center',            
            }}>          
                <Text style={{fontSize:18, color: 'white'}}>Money share 11 {ENV !== 'PRODUCTION'?ENV.substring(0, 3):''}</Text>
                <TouchableOpacity onPress={()=>{navigation.navigate('Users')}}>
                    <Text style={{fontSize:18, color: 'white'}}>{currentUser.name.split(' ')[0]}</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    )
}
Header.propTypes = {
    navigation: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}
export default React.memo(Header)