import React from 'react'
import { View, StyleSheet, Text, Vibration } from 'react-native'
import { ListItem } from 'react-native-elements'
import Ripple from 'react-native-material-ripple'
import PropTypes from 'prop-types'
import { useUserDataContextHook } from './UserDataContext'
import {color, formatNumber, toBoolean } from '../utils'
import DateUtils from '../DateUtils'
import useWhyDidYouUpdate from '../hooks/useWhyDidYouUpdate'
const DayCard = (props)=> {
    useWhyDidYouUpdate('DayCard', props)
    const {month, day} = props
    const {appState, markedItemsToDelete, setMarkedItemsToDelete} = useUserDataContextHook()
    const data = appState.userData[appState.selectedYear][month+1][day]
    
    const getDayOfWeek = ()=>{
        let date = new Date()
        date.setFullYear(appState.selectedYear)
        date.setMonth(month)
        date.setDate(day)
        return DateUtils.DAYS_OF_WEEK[date.getDay()].substring(0,3)   
    }    
    const isItemSelected = (created)=>{
        return markedItemsToDelete.find(e=>e.created === created) !== undefined
    }
    const onPressItem=(created)=>{
        if (markedItemsToDelete.length > 0){
            if (isItemSelected(created)){
                setMarkedItemsToDelete([...markedItemsToDelete.filter(e=>e.created!==created)])
            }
            else{
                setMarkedItemsToDelete([...markedItemsToDelete, {
                    year: appState.selectedYear,
                    month: month+1,
                    day,
                    created
                }])
            }            
        }
    }
    const onLongPressItem=(created)=>{
        if (!isItemSelected(created)){
            Vibration.vibrate(50)
            setMarkedItemsToDelete([...markedItemsToDelete, {
                year: appState.selectedYear,
                month: month+1,
                day,
                created
            }])
        }        
    }
    console.log('Day Card.js')
    return (
        <View style={styles.card}>
            <View style={{ width: 40, textAlign:'center', alignItems: 'center', justifyContent: 'center'}}>
                <Text>{day.length === 1?('0'+day):day}</Text>
                <Text>{ getDayOfWeek() }</Text>
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