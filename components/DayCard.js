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
    
    const data = globalState.data[globalState.currentYear][globalState.currentMonth][day]
   
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
    const dayOfWeek = DateUtils.getDayOfWeek(globalState.currentYear, globalState.currentMonth, props.day).substring(0,3)   
    console.log('Day Card.js')
    return (
        <View style={styles.card}>
            <View style={{ width: 40, textAlign:'center', alignItems: 'center', justifyContent: 'center'}}>
                <Text>{day.length === 1?('0'+day):day}</Text>
                <Text>{ dayOfWeek }</Text>
            </View>
           
            <View style={{flex:1}}>
                {  Object.keys(data).sort().reverse().filter(created => !data[created].deleted || !toBoolean(data[created].deleted) ).map((created, i)=>(
                    <ListItem
                        Component={Ripple} 
                        containerStyle={{
                            backgroundColor: isItemSelected(created) ?'rgba(185,185,190,0.2)':'white'
                        }} 
                        key={i} 
                        style={[styles.listItem, 
                            {borderLeftColor: `${data[created].amount < 0?'red': color.primaryGreen}`                            
                            }]
                        }
                        onPress={()=>onPressItem(created)}
                        onLongPress={()=>onLongPressItem(created)}
                    >
                        <ListItem.Content>
                            <ListItem.Title>{data[created].concept}</ListItem.Title>
                            <ListItem.Subtitle>{data[created].comment}</ListItem.Subtitle>
                        </ListItem.Content>
                        <View style={styles.total}>
                            <Text style={{textAlign: 'right', color:`${data[created].amount < 0?'red': color.primaryGreen}`}}>
                                {formatNumber(data[created].amount)} {data[created].currency}
                            </Text>                                          
                        </View>
                    </ListItem>
                ))
                
                }
            </View>           
        </View>
    )
}
DayCard.propTypes = {
    month: PropTypes.number,
    day: PropTypes.string
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