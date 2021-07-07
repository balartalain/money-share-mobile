import React from 'react'
import { View, Text, Vibration, TouchableOpacity} from 'react-native'
import { useDataUserContextHook } from './DataUserContext'
import {color, formatNumber } from '../utils'
import DateUtils from '../DateUtils'

const InnerCard = (props)=>{
    //console.log('InnerCard '+ JSON.stringify(props))

    const {amount, concept, comment, currency, } = props.data
    return (   
        <TouchableOpacity activeOpacity={0.6}
            onLongPress={()=>{
                Vibration.vibrate(50)
                //props.onLongPress(props.time)
            }}>                  
            <View style={{flex:1, 
                flexDirection: 'row',
                borderLeftWidth: 5,
                borderLeftColor: `${amount < 0?'red': color.primaryGreen}`,
                marginHorizontal: 10,
                marginBottom: 10,
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4,
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: props.selected?'rgba(185,185,190,0.2)':'white'}}>
                <View style={{flex:1, paddingLeft:10}}>      
                    <Text>{concept}</Text>
                    <Text style={{fontSize: 12}}>{comment}</Text>
                </View>
                <View style={{flex:0.6, marginRight:10}}>
                    <Text style={{textAlign: 'right', color:`${amount < 0?'red': color.primaryGreen}`}}>{formatNumber(amount)} {currency}</Text></View>                                            
            </View>
        </TouchableOpacity>        
    )
}
const DayCard = (props)=> {
    const {appState} = useDataUserContextHook()
    const getDayOfWeek = ()=>{
        let date = new Date()
        date.setFullYear(appState.selectedYear)
        date.setMonth(props.month)
        date.setDate(props.day)
        return DateUtils.DAYS_OF_WEEK[date.getDay()].substring(0,3)   
    }
    const data = appState.userData[appState.selectedYear][props.month+1][props.day]
    
    return (
        <View style={{
            flex:0,
            flexDirection:'row', 
            marginTop: 10,
        }}>
            <View style={{flex:1, 
                paddingTop: 2, 
                alignItems: 'center',
                justifyContent: 'flex-start'
      
            }}>
                <Text style={{ alignItems: 'center'}}>{props.day.length === 1?('0'+props.day):props.day}</Text>
                <Text style={{alignItems: 'center'}}>{getDayOfWeek()}</Text>
            </View>
            <View style={{flex:8,  flexDirection: 'column',
                marginBottom: 10,
            }}>
                {
                    Object.keys(data).sort().reverse().map((e)=>(
                        data[e].deleted !== 'true' && 
              <InnerCard key={e} 
                  time={e} //e is the key time
                  data={data[e]}                   
              />     
              
                    ))
                }     
            </View>           
        </View>
    )
}
export default DayCard