import React, {useState, useEffect, useContext, useRef, memo} from 'react'
import { View, Text, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import { Button } from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons' 
import { DataUserContext } from './DataUserContext'
import { color } from './../utils'
import FadeInView from './FadeInView'

const Delete = (props) =>{
    const {appState} = useContext(DataUserContext)
    const [deleting, setDeleting] = useState(false)

    useEffect(()=>{
        setDeleting(false)
        return ()=>{
            setDeleting(false)
        }
    }, [])
    return (
        <FadeInView duration={500} style={{
            flex:1,
            flexDirection: 'row',   
            justifyContent: 'space-between',
            alignItems: 'center',            
        }}>
            <TouchableOpacity >
                <Text><MaterialCommunityIcons name="arrow-left-circle-outline" size={28} color="white" /></Text>
            </TouchableOpacity>
            <Button
                type="clear"
                title = {<MaterialCommunityIcons name="delete" size={28} color="white" />}
                loadingProps={{
                    color: 'white',
            
                }} 
                loading={deleting}
            >
            
            </Button>
        </FadeInView>
    )}
const Header = (props)=>{  
    const {appState} = useContext(DataUserContext)
    const {navigation, currentUser} = props
    return (
        <View style={{   
            backgroundColor: color.primaryGreen,        
            paddingHorizontal: 20,
            height:65
        }}>  
            { appState.deleteItems?
                <Delete />
                :(
                    <View style={{
                        flex:1,
                        flexDirection: 'row',   
                        justifyContent: 'space-between',
                        alignItems: 'center',            
                    }}>          
                        <Text style={{fontSize:18, color: 'white'}}>Money share v1.0</Text>
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