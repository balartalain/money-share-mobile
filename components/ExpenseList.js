import React, {useState, useContext} from 'react'
import { ScrollView, FlatList, View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { ListItem } from 'react-native-elements'
import Collapsible from 'react-native-collapsible'
import {Context} from '../Store'
import {color, formatNumber} from '../utils'
import DateUtils from '../DateUtils'

const ExpenseList = (props)=>{
    const [globalState] = useContext(Context)
    const [active, setActive] = useState(-1)

    const toggleExpanded = (index)=>{
        setActive( active === index?-1:index)
    }
    const total = (month)=>{
        let totalUSD = 0,
            totalCUP = 0
        month.days.forEach(day => {
            day.expenses.forEach(exp=>{
                if (exp.currency === 'USD'){
                    totalUSD += parseFloat(exp.amount)
                }
                else {
                    totalCUP += parseFloat(exp.amount)
                }
            })
        })
        return {
            totalUSD, totalCUP
        }
    }
    const renderItem = ({item}) => {
        if (item.expenses.length === 0){
            return <View style={{alignItems: 'center', padding: 20}}><Text>No hay registros</Text></View>
        }
        return item.expenses.map((exp, i)=>(
            <ListItem key={i} style={{
                marginBottom: 3,
                borderLeftWidth: 5,
                borderLeftColor: `${exp.amount < 0?'red': color.primaryGreen}`
            }}>
                <View style={{alignItems: 'center'}}>
                    <Text>{('0' + item.id).slice(-2)}</Text>
                    <Text>{DateUtils.getDayOfWeek(globalState.currentYear, globalState.currentMonth-1, item.id).substring(0,3)}</Text>
                </View>
                <ListItem.Content>
                    <ListItem.Title>{exp.concept}</ListItem.Title>
                    <ListItem.Subtitle>{exp.comment}</ListItem.Subtitle>
                </ListItem.Content>
                <View><Text style={{
                    color: `${exp.amount < 0?'red': color.primaryGreen}`
                }}>{formatNumber(exp.amount)} {exp.currency}</Text></View>
            </ListItem>
        ))
    }
    const keyExtractor=(item) =>{
        return item.id.toString()
    } 
    //https://github.com/oblador/react-native-collapsible
    const data = globalState.data[globalState.currentYear]
    return (        
        <View style={{flex:1}}>
            { Object.keys(data).length > 0 ? 
                <ScrollView>
                    {Object.keys(data).sort().reverse().map((month, i)=>{
                        const {totalUSD, totalCUP} = total(data[month])
                        return <View key={i}>
                            <TouchableOpacity onPress={()=>toggleExpanded(i)}>
                                <ListItem bottomDivider topDivider >
                                    <ListItem.Content style={{flex:1, 
                                        flexDirection:'row',
                                        justifyContent: 'space-between'
                                    }}>
                                        <ListItem.Title>{DateUtils.MONTH_NAMES[month-1]}</ListItem.Title>
                                        <View style={{alignItems:'flex-end'}}>
                                            <Text style={{
                                                color: `${totalUSD < 0?'red': color.primaryGreen}`
                                            }}>{formatNumber(totalUSD)} USD</Text>
                                            <Text style={{
                                                color: `${totalCUP < 0?'red': color.primaryGreen}`
                                            }}>{formatNumber(totalCUP)} CUP</Text>
                                        </View>                                       
                                    </ListItem.Content>
                                </ListItem>
                            </TouchableOpacity>
                            <Collapsible collapsed={i !== active} align="center">
                                { data[month].days.length === 0?
                                    <View style={{alignItems: 'center', padding: 20}}><Text>No hay registros</Text></View>
                                    :
                                    <FlatList
                                        data={data[month].days}
                                        renderItem={renderItem}
                                        keyExtractor={keyExtractor}
                                    /> 
                                }                          
                            </Collapsible>
                        </View>
                    })
                    }                    
                </ScrollView>
                :<View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}><Text>No hay registros</Text></View> 
            }       
        </View>
    )
}
ExpenseList.propTypes = {
    onChangeExpenseView: PropTypes.func
}
export default ExpenseList
//Convertir realtime DB a un lista de items
// const messageList = Object.keys(messageObject).map(key => ({
//     ...messageObject[key],
//     uid: key,
// }))

