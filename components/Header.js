import React, {useContext, useEffect, useState} from 'react'
import { View, Text, TouchableOpacity, Dimensions} from 'react-native'
import PropTypes from 'prop-types'
import Ripple from 'react-native-material-ripple'
import { AntDesign } from '@expo/vector-icons' 
import { UserDataContext, useUserDataContextHook } from './UserDataContext'
import { color } from './../utils'
import { getEnvironment } from '../utils'
import { View as MotiView, AnimatePresence } from 'moti'


const { width } = Dimensions.get('window')
const ENV = getEnvironment().envName

const Delete = () =>{
    const {deleteItems, markedItemsToDelete, setMarkedItemsToDelete} = useUserDataContextHook()
    const [color, setColor] = useState('white')
    
    useEffect(() => {
        if (markedItemsToDelete.length > 1){
            setColor('orange')
            setTimeout(()=>{setColor('white')}, 200)
        }
    }, [markedItemsToDelete.length])

    return (
        <MotiView
            from={{
                opacity: 0,
                scale: 0.9,
            }}
            animate={{
                opacity: 1,
                scale: 1,
            }}
            exit={{
                opacity: 0,
                scale: 0.9,
            }} 
            transition={{
                type: 'timing',
                duration: 100
            }}
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
                zIndex: 10,
                backgroundColor: color.primaryGreen        
            }}>
            <Ripple onPress={()=>setMarkedItemsToDelete([])} >
                <AntDesign name="arrowleft" size={24} color='white' />
            </Ripple>
            <Ripple onPress={()=>deleteItems()} >
                <AntDesign name="delete" size={24} color={color} />
            </Ripple>
        </MotiView>
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
            <AnimatePresence>{  markedItemsToDelete.length > 0 && <Delete /> }</AnimatePresence>
            
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
export default Header