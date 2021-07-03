import React,{memo} from 'react'
import { View, Text} from 'react-native'
import { color, formatNumber } from './../utils'

const TotalAmount = memo(({totalAmountUSD, totalAmountCUP})=>{
    return (
        <View style={{flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: 'white',
            paddingVertical: 10
        }}>
            <View><Text style={{fontSize: 18,  fontWeight: 'bold', color: color.primaryGreen}}>{formatNumber(totalAmountUSD)} USD</Text></View>
            <View><Text style={{fontSize: 18,  fontWeight: 'bold', color: color.primaryGreen}}>{formatNumber(totalAmountCUP)} CUP</Text></View>
        </View>
    )
})
TotalAmount.displayName = 'TotalAmount'
export default TotalAmount