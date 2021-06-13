import * as React from 'react';
import { View, Text} from 'react-native';
import {color, monthNames, dayOfWeek } from '../utils'

const InnerCard = (props)=>{
    return (
          <View style={{
              backgroundColor: 'white', 
              flex:0,           
              flexDirection: 'row',
              paddingTop: 10,
              paddingBottom: 10,
              justifyContent:'space-around',
              borderLeftWidth: 5,
              borderLeftColor: `${props.amount < 0?'red': color.primaryGreen}`,
              marginHorizontal: 10,
              marginBottom: 10,
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
          }}>    
            <View style={{flex:1, marginLeft: 10}}>      
              <Text>{props.category}</Text>
              <Text style={{fontSize: 12}}>{props.comment}</Text>
            </View>
            <View style={{flex:0.6, marginRight:10}}><Text style={{textAlign: 'right', color:`${props.amount < 0?'red': color.primaryGreen}`}}>{props.amount} {props.currency}</Text></View>
          </View>
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
            Object.keys(props.data).map((e)=>(
              <InnerCard key={e} 
                amount={props.data[e].amount} 
                category={props.data[e].category} 
                comment={props.data[e].comment}
                currency={props.data[e].currency}
              />     
            ))
          }     
        </View>           
      </View>
    );
  }
  export default DayCard;