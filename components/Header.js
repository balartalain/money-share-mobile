import React, {useContext} from 'react'
import { View, Text, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import Ripple from 'react-native-material-ripple'
import { AntDesign } from '@expo/vector-icons' 
import { UserDataContext, useUserDataContextHook } from './UserDataContext'
import { color } from './../utils'
import FadeInView from './FadeInView'
import { getEnvironment } from '../utils'
const ENV = getEnvironment().envName

const Delete = () =>{
    const {deleteItems, setMarkedItemsToDelete} = useUserDataContextHook()
    return (
        <FadeInView duration={500} scaleAnim style={{
            flex:1,
            flexDirection: 'row',   
            justifyContent: 'space-between',
            alignItems: 'center',            
        }}>
            <Ripple onPress={()=>setMarkedItemsToDelete([])} >
                <AntDesign name="arrowleft" size={24} color="white" />
            </Ripple>
            <Ripple onPress={()=>deleteItems()} >
                <AntDesign name="delete" size={24} color="white" />
            </Ripple>
        </FadeInView>
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
            { markedItemsToDelete.length?
                <Delete />
                :(
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
                )}
        </View>
    )
}
Header.propTypes = {
    navigation: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
}
export default Header