import React,{memo} from 'react'
import { View, Text} from 'react-native'
import { Divider } from 'react-native-elements'
import { useUserDataContextHook } from './UserDataContext'
import { color, formatNumber } from './../utils'

const TotalAmount = memo(()=>{
    const {totalAmount} = useUserDataContextHook()
    const {totalUSD, totalCUP} = totalAmount()
    return (
        <>
            <View style={{flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: 'white',
                paddingVertical: 10
            }}>
                <View><Text style={{fontSize: 18,  fontWeight: 'bold', color: color.primaryGreen}}>{formatNumber(totalUSD)} USD</Text></View>
                <View><Text style={{fontSize: 18,  fontWeight: 'bold', color: color.primaryGreen}}>{formatNumber(totalCUP)} CUP</Text></View>
            </View>
            <Divider orientation="horizontal" />
        </>
    )
})
TotalAmount.displayName = 'TotalAmount'
export default TotalAmount