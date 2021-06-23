import React from 'react'
import { View, Button, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions} from "react-native";
import { color } from './../utils'

const TotalAmount = React.memo(({totalAmountUSD, totalAmountCUP})=>{
    console.log('TotalAmount')
    return (
      <View style={{flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingVertical: 10
      }}>
      <View><Text style={{fontSize: 18,  fontWeight: 'bold', color: color.primaryGreen}}>{totalAmountUSD} USD</Text></View>
      <View><Text style={{fontSize: 18,  fontWeight: 'bold', color: color.primaryGreen}}>{totalAmountCUP} CUP</Text></View>
    </View>
    )
  })
export default TotalAmount;