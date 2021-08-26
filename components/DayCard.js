import React from 'react'
import { View, StyleSheet, Text, Vibration } from 'react-native'
import { ListItem } from 'react-native-elements'
import Ripple from 'react-native-material-ripple'
import PropTypes from 'prop-types'
import { Context } from '../Store'
import {color, formatNumber, toBoolean } from '../utils'
import DateUtils from '../DateUtils'
import useWhyDidYouUpdate from '../hooks/useWhyDidYouUpdate'
const DayCard = (props)=> {
    useWhyDidYouUpdate('DayCard', props)
    const {day} = props
    const [globalState, dispatch] = React.useContext(Context)
    
    const isItemSelected = (created)=>{
        return globalState.itemsToDelete.includes(created)
    }
    const onPressItem=(created)=>{
        if (globalState.itemsToDelete.length > 0){
            if (isItemSelected(created)){
                dispatch({type: 'REMOVE_ITEM_TO_DELETE',  created})
            }
            else{
                dispatch({type: 'ADD_ITEM_TO_DELETE',  created})                
            }            
        }
    }
    const onLongPressItem=(created)=>{
        if (!isItemSelected(created)){
            Vibration.vibrate(50)
            dispatch({type: 'ADD_ITEM_TO_DELETE',  created}) 
        }        
    }
    console.log('Day Card.js') 
    const dayOfWeek = DateUtils.getDayOfWeek(globalState.currentYear, globalState.currentMonth, parseInt(day.id)).substring(0,3)   
    //const dayObj = globalState.data[globalState.currentYear][globalState.currentMonth].days.find(d=>d.id===day)
    ///const data = Object.keys(dayObj).filter(key=>key!== 'id').sort().reverse().map(created=>)
    const { expenses } = day
    return (
        <View style={styles.card}>
            <View style={{ width: 40, textAlign:'center', alignItems: 'center', justifyContent: 'center'}}>
                <Text>{day.id}</Text>
                <Text>{dayOfWeek}</Text>
            </View>
           
            <View style={{flex:1}}>
                {  Object.keys(expenses).sort().reverse().map((created, i)=>(
                    <ListItem
                        Component={Ripple} 
                        containerStyle={{
                            backgroundColor: isItemSelected(created) ?'rgba(185,185,190,0.2)':'white'
                        }} 
                        key={i} 
                        style={[styles.listItem, 
                            {borderLeftColor: `${expenses[created].amount < 0?'red': color.primaryGreen}`                            
                            }]
                        }
                        onPress={()=>onPressItem(created)}
                        onLongPress={()=>onLongPressItem(created)}
                    >
                        <ListItem.Content>
                            <ListItem.Title>{expenses[created].concept}</ListItem.Title>
                            <ListItem.Subtitle>{expenses[created].comment}</ListItem.Subtitle>
                        </ListItem.Content>
                        <View style={styles.total}>
                            <Text style={{textAlign: 'right', color:`${expenses[created].amount < 0?'red': color.primaryGreen}`}}>
                                {formatNumber(expenses[created].amount)} {expenses[created].currency}
                            </Text>                                          
                        </View>
                    </ListItem>
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