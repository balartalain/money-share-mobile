import React, {useState} from 'react';
import { View, Text, Pressable, Vibration, TouchableOpacity} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import {color, monthNames, dayOfWeek } from '../utils'

const InnerCard = (props)=>{
  console.log('InnerCard '+ JSON.stringify(props))
    return (   
          <TouchableOpacity activeOpacity={0.6}
            onPress={()=>props.onPress(props.time)} 
            onLongPress={()=>{
              Vibration.vibrate(100);
              props.onLongPress(props.time)
            }}>                  
              <View style={{flex:1, 
                flexDirection: 'row',
                borderLeftWidth: 5,
                borderLeftColor: `${props.amount < 0?'red': color.primaryGreen}`,
                marginHorizontal: 10,
                marginBottom: 10,
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4,
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: props.selected?'rgba(185,185,190,0.2)':'white'}}>
                  <View style={{flex:1, paddingLeft:10}}>      
                      <Text>{props.category}</Text>
                      <Text style={{fontSize: 12}}>{props.comment}</Text>
                    </View>
                    <View style={{flex:0.6, marginRight:10}}><Text style={{textAlign: 'right', color:`${props.amount < 0?'red': color.primaryGreen}`}}>{props.amount} {props.currency}</Text></View>                                            
              </View>
            </TouchableOpacity>        
    );
  }
  const DayCard = (props)=> {

    const getDayOfWeek = ()=>{
      let date = new Date();
      date.setFullYear(props.selectedYear);
      date.setMonth(props.month)
      date.setDate(props.day)
      return dayOfWeek[date.getDay()].substring(0,3);   
    }
    console.log('Render DayCard '+ props.itemsToDelete.map(i=>JSON.stringify(i)))
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
          <Text style={{ alignItems: 'center'}}>{props.day.length === 1?("0"+props.day):props.day}</Text>
          <Text style={{alignItems: 'center'}}>{getDayOfWeek()}</Text>
        </View>
        <View style={{flex:8,  flexDirection: 'column',
          marginBottom: 10,
        }}>
          {
            Object.keys(props.data).sort().reverse().map((e)=>(
              <InnerCard key={e} 
                time={e} //e is the key time
                amount={props.data[e].amount} 
                category={props.data[e].category} 
                comment={props.data[e].comment}
                currency={props.data[e].currency}
                selected={props.itemsToDelete.find(item=>{ return item.month === props.month && 
                    item.day === props.day &&
                    item.time === e
                })?true:false}
                onPress={(time)=>props.onPress(props.day, time)}
                onLongPress={(time)=>props.onLongPress(props.day, time)}                
              />     
            ))
          }     
        </View>           
      </View>
    );
  }
  export default DayCard;