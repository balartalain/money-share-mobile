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
import AnimatedView from './AnimatedView'

const { width } = Dimensions.get('window')
const ENV = getEnvironment().envName

const Delete = (props) =>{
    const {deleteItems, markedItemsToDelete, setMarkedItemsToDelete} = useUserDataContextHook()
    const [trashColor, setTrashColor] = useState('white')
    
    useEffect(() => {
        if (markedItemsToDelete.length > 0){
            setTrashColor('orange')
            setTimeout(()=>{setTrashColor('white')}, 200)
        }
    }, [markedItemsToDelete.length])

    return (        
        <View            
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
                zIndex: 2,
                backgroundColor: color.primaryGreen
                               
            }}>
            <Ripple onPress={()=>setMarkedItemsToDelete([])} >
                <AntDesign name="arrowleft" size={24} color='white' />
            </Ripple>
            <Ripple onPress={()=>deleteItems()} >
                <AntDesign name="delete" size={24} color={trashColor} />
            </Ripple>
        </View>        
        
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
            <AnimatedView style={{
                top:0, 
                left: 0,           
                height: 65,        
                width: width,
                position: 'absolute',
                zIndex:1
                
            }} visible={ markedItemsToDelete.length > 0}><Delete/></AnimatedView> 
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