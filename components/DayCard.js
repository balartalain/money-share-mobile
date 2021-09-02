import React from 'react'
import { View, StyleSheet, Text, Vibration } from 'react-native'
import { ListItem } from 'react-native-elements'
import Ripple from 'react-native-material-ripple'
import PropTypes from 'prop-types'
import { Context } from '../Store'
import {color, formatNumber } from '../utils'
import DateUtils from '../DateUtils'
import useWhyDidYouUpdate from '../hooks/useWhyDidYouUpdate'

const Expense = ({expense})=>{
    const [globalState, dispatch] = React.useContext(Context)
    //const [isSelected, setSelected] = useState(false)
    const isItemSelected = ()=>globalState.itemsToDelete.includes(expense.id)
    const onPressItem=()=>{
        if (globalState.itemsToDelete.length > 0){
            if (isItemSelected()){
                dispatch({type: 'UNDO_ITEM_TO_DELETE', created: expense.id})
            }
            else{
                dispatch({type: 'ADD_ITEM_TO_DELETE',  created: expense.id})                
            }            
        }
    }
    const onLongPressItem=()=>{
        if (!isItemSelected()){
            Vibration.vibrate(50)
            dispatch({type: 'ADD_ITEM_TO_DELETE', created: expense.id}) 
        }        
    }

    return (
        <ListItem
            Component={Ripple} 
            containerStyle={{
                backgroundColor: isItemSelected() ?'rgba(185,185,190,0.2)':'white'
            }} 
            style={[styles.listItem, 
                {borderLeftColor: `${expense.amount < 0?'red': color.primaryGreen}`                            
                }]
            }
            onPress={onPressItem}
            onLongPress={onLongPressItem}
        >
            <ListItem.Content>
                <ListItem.Title>{expense.concept}</ListItem.Title>
                <ListItem.Subtitle>{expense.comment}</ListItem.Subtitle>
            </ListItem.Content>
            <View style={styles.total}>
                <Text style={{textAlign: 'right', color:`${expense.amount < 0?'red': color.primaryGreen}`}}>
                    {formatNumber(expense.amount)} {expense.currency}
                </Text>                                          
            </View>
        </ListItem>
    )
}
Expense.propTypes = {
    expense: PropTypes.object
}
const DayCard = (props)=> {
    const {day} = props
    const [globalState] = React.useContext(Context)
    useWhyDidYouUpdate('DayCard', props, globalState) 

    console.log('Day Card.js') 
    const dayOfWeek = DateUtils.getDayOfWeek(globalState.currentYear, globalState.currentMonth-1, parseInt(day.id)).substring(0,3)   
    if (day.expenses.length === 0) return null
    return (
        <View style={styles.card}>
            <View style={{ width: 40, textAlign:'center', alignItems: 'center', justifyContent: 'center'}}>
                <Text>{day.id}</Text>
                <Text>{dayOfWeek}</Text>
            </View>
           
            <View style={{flex:1}}>
                { day.expenses.map((expense)=>(
                    <Expense key={expense.id} expense={expense} />
                    
                ))}
                                
            </View>           
        </View>
    )
}
DayCard.propTypes = {
    day: PropTypes.object
}
const styles = StyleSheet.create({  
    card:{
        flex:1, 
        flexDirection:'row',
        marginVertical: 10,
        
    },  
    listItem: {
        borderLeftWidth: 5,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        marginTop: 4
    },
})
export default React.memo(DayCard)
// export default DayCard