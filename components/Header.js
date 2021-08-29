import React, {useContext, useEffect, useState} from 'react'
import { View, Text, TouchableOpacity, Dimensions} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import PropTypes from 'prop-types'
import Ripple from 'react-native-material-ripple'
import { AntDesign } from '@expo/vector-icons' 
import { color, ENV } from './../utils'
import AnimatedView from './AnimatedView'
import { Context } from '../Store'
import Heroku from '../controllers'
import { CONNECTION_ERROR } from '../ErrorConstants'
const { width } = Dimensions.get('window')

const Delete = (props) =>{
    const [state, dispatch] = useContext(Context) 
    // const {deleteItems, markedItemsToDelete, setMarkedItemsToDelete} = useUserDataContextHook()
    const [trashColor, setTrashColor] = useState('white')
    const { currentUser, currentYear, currentMonth, itemsToDelete } = state

    const deleteItems = ()=>{
        const deleteAsync = state.itemsToDelete.map(created=>{ 
            const day = state.data[currentYear][currentMonth].days.find(day=>Object.keys(day).find(e=>e===created)).id        
         
            const expense = {
                year: currentYear,
                month: currentMonth,
                day,
                created
            }
            return Heroku.deleteExpense(currentUser.id, expense)
        })

        Promise.all(deleteAsync).then(() => {
            dispatch({type:'DELETE_ITEMS'})    
        }).catch((err) => {
            console.log(err)
            dispatch({type: 'CLEAR_ITEMS_TO_DELETE'})    
            setTimeout(()=> alert(CONNECTION_ERROR), 100)          
        }) 
    }
    useEffect(() => {
        if (itemsToDelete.length > 0){
            setTrashColor('orange')
            setTimeout(()=>{setTrashColor('white')}, 200)
        }
    }, [itemsToDelete.length])

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
            <Ripple onPress={()=>dispatch({type:'CLEAR_ITEMS_TO_DELETE'})} >
                <AntDesign name="arrowleft" size={24} color='white' />
            </Ripple>
            <Ripple onPress={()=>deleteItems()} >
                <AntDesign name="delete" size={24} color={trashColor} />
            </Ripple>
        </View>        
        
    )}
const Header = (props)=>{  
    const navigation = useNavigation()    
    const { currentUser, itemsToDelete } = props
    console.log('Header')
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
                
            }} visible={ itemsToDelete.length > 0}><Delete/></AnimatedView> 
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
            
        </View>
    )
}

// function areEqual(prevProps, nextProps) {

//     return prevProps.currentUser.id === nextProps.currentUser.id
// }
export default React.memo(Header)
Header.whyDidYouRender  = {
    logOnDifferentValues: true
}