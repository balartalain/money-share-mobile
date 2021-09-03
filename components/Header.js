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

const InnerDelete = ({ itemsToDelete, onDeleteItems, onCancelDelete }) =>{
    // const {deleteItems, markedItemsToDelete, setMarkedItemsToDelete} = useUserDataContextHook()
    const [trashColor, setTrashColor] = useState('white')
    
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
            <Ripple onPress={onCancelDelete} >
                <AntDesign name="arrowleft" size={24} color='white' />
            </Ripple>
            <Ripple onPress={onDeleteItems} >
                <AntDesign name="delete" size={24} color={trashColor} />
            </Ripple>
        </View>        
        
    )}
InnerDelete.propTypes = {
    onDeleteItems: PropTypes.func,
    onCancelDelete: PropTypes.func,
    itemsToDelete: PropTypes.array
}
const Delete = ()=>{
    const [state, dispatch] = useContext(Context) 
    const {currentUser, currentYear, currentMonth, itemsToDelete} = state
    const onCancelDelete=()=>{
        dispatch({type:'CLEAR_ITEMS_TO_DELETE'})
    }
    const onDeleteItems = ()=>{
        const deleteAsync = state.itemsToDelete.map(created=>{ 
            const day = state.data[currentYear][currentMonth].days.find(day=>day.expenses.find(exp=>exp.id===created)).id                    
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
    return <AnimatedView style={{
        top:0, 
        left: 0,           
        height: 65,        
        width: width,
        position: 'absolute',
        zIndex:1
        
    }} visible={ itemsToDelete.length > 0}>
        <InnerDelete itemsToDelete={itemsToDelete} onDeleteItems={onDeleteItems} onCancelDelete={onCancelDelete}/>
    </AnimatedView> 
}

const Header = (props)=>{  
    const navigation = useNavigation()    
    const { currentUser } = props
    console.log('Header')
    return (
        <View style={{   
            backgroundColor: color.primaryGreen,        
            paddingHorizontal: 20,
            height:65
            
        }}>  
            <Delete/> 
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
Header.propTypes = {
    props: PropTypes.object,
    currentUser: PropTypes.object,
    itemsToDelete: PropTypes.array
}
export default React.memo(Header)
Header.whyDidYouRender  = {
    logOnDifferentValues: true
}