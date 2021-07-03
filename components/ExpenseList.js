import React, {useState, useEffect} from 'react'
import { ScrollView, View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { ListItem } from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons' 
import Collapsible from 'react-native-collapsible'
import {monthNames, dayOfWeek, color, formatNumber} from '../utils'

const transformObjectToArray = (data)=>{

    const getExpenses = (d)=>{
        let expenses = []
        Object.keys(d).sort().reverse().forEach(time=>{
            if (!d[time].deleted){
                let expense={}
                Object.keys(d[time]).forEach(k=>{
                    expense[k] = d[time][k]
                })
                expense.create = time
                expenses.push(expense)
            }
        })  
        return expenses  
    }
    const getDays = (m)=>{
        let days = []
        Object.keys(m).sort().reverse().forEach(d=>{
            const expenses = getExpenses(m[d])
            if (expenses.length){
                days.push({
                    day:d,
                    expenses
                })
            }
        })  
        return days     
    }
    let result = []    
    Object.keys(data).sort().reverse().forEach(m=>{
        const days = getDays(data[m])
        if (days.length){
            result.push({
                month: m,
                days: days
            })   
        }
    })
    return result
}
const ExpenseList = (props)=>{
    const [userData, setUserData] = useState(null)

    useEffect(()=>{
        if (props.userData) {
            setUserData(transformObjectToArray(props.userData))  
        }
    }, [props.userData])

    const [active, setActive] = useState(-1)
    const toggleExpanded = (index)=>{
        setActive( active === index?-1:index)
        // const _collapsed = [];
        // _collapsed[index] = _collapsed[index] === undefined?false:!_collapsed[index]; 
        // setCollapsed(_collapsed);
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
    const getDayOfWeek = (year, month, day)=>{
        let date = new Date()
        date.setFullYear(year)
        date.setMonth(month)
        date.setDate(day)
        return dayOfWeek[date.getDay()].substring(0,3)   
    }
    const RenderItem = ({ item }) => {
        return item.days.map((day)=>{
            return  day.expenses.map((exp, i)=>(
                <ListItem key={i} style={{
                    marginBottom: 3,
                    borderLeftWidth: 5,
                    borderLeftColor: `${exp.amount < 0?'red': color.primaryGreen}`
                }}>
                    <View style={{alignItems: 'center'}}>
                        <Text>{('0' + day.day).slice(-2)}</Text>
                        <Text>{getDayOfWeek(props.selectedYear, item.month-1, day.day)}</Text>
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
        })
            
    }
    //https://github.com/oblador/react-native-collapsible
    return (
        
        <View style={{flex:1}}>
            { userData && userData.length ? 
                <ScrollView>
                    {userData.map((month, i)=>{
                        
                        const {totalUSD, totalCUP} = total(month)
                        return <View key={i}>
                            <TouchableOpacity onPress={()=>toggleExpanded(i)}>
                                <ListItem bottomDivider topDivider >
                                    <ListItem.Content style={{flex:1, 
                                        flexDirection:'row',
                                        justifyContent: 'space-between'
                                    }}>
                                        <ListItem.Title>{monthNames[month.month-1]}</ListItem.Title>
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
                                <RenderItem key={i+'-'+i} item={month} />                            
                            </Collapsible>
                        </View>
                    })
                    }                    
                </ScrollView>
                :<View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}><Text>No hay registros</Text></View> 
            }
            <TouchableOpacity style={styles.fab}
                onPress={props.onChangeExpenseView} >
                <Text style={styles.fabIcon}><MaterialCommunityIcons name="format-list-bulleted" size={30} color="white" /></Text>
            </TouchableOpacity>
        </View>
    )
}
ExpenseList.propTypes = {
    userData: PropTypes.Object,
    onChangeExpenseView: PropTypes.func.isRequired,
    selectedYear: PropTypes.func.isRequired
}
const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        left: 30,
        bottom: 25,
        backgroundColor: color.primaryGreen,
        borderRadius: 28,
        elevation: 8,
    },
    fabIcon: {
        fontSize: 30,
        color: 'white',
    }
})
export default ExpenseList
