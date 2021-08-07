import React, {useContext} from 'react'
import { View, Text, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import { Button } from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons' 
import { UserDataContext, useUserDataContextHook } from './UserDataContext'
import { color } from './../utils'
import FadeInView from './FadeInView'
import { getEnvironment } from '../utils'
const ENV = getEnvironment().envName

const Delete = () =>{
    const {deleteItems, setMarkedItemsToDelete} = useUserDataContextHook()
    return (
        <FadeInView duration={500} style={{
            flex:1,
            flexDirection: 'row',   
            justifyContent: 'space-between',
            alignItems: 'center',            
        }}>
            <TouchableOpacity onPress={()=>setMarkedItemsToDelete([])} >
                <Text><MaterialCommunityIcons name="arrow-left-circle-outline" size={28} color="white" /></Text>
            </TouchableOpacity>
            <Button
                type="clear"
                title = {<MaterialCommunityIcons name="delete" size={28} color="white" />}
                loadingProps={{
                    color: 'white',
            
                }} 
                onPress={()=>deleteItems()}
                //loading={deleting}
            >
            
            </Button>
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
                        <Text style={{fontSize:18, color: 'white'}}>Money share {ENV !== 'PRODUCTION'?ENV.substring(0, 3):''}</Text>
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