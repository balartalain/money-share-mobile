import React,{memo, useContext, useCallback} from 'react'
import { View, Text} from 'react-native'
import { Divider } from 'react-native-elements'
import { color, formatNumber, toBoolean } from './../utils'
import { Context } from '../Store'
const TotalAmount = memo(()=>{
    const [gloabalState] = useContext(Context)
    const { data, currentYear } = gloabalState
    const totalAmount = useCallback(()=>{
        let totalUSD = 0,
            totalCUP = 0
        
        if (data && Object.keys(data).length > 0){
            Object.keys(data[currentYear]).forEach(m=>{
                const monthData = data[currentYear][m]
                Object.keys(monthData).forEach(d=>{          
                    Object.keys(monthData[d]).forEach(time=>{   
                        if (!toBoolean(monthData[d][time].deleted)){
                            let { currency, amount} = monthData[d][time];
                            (currency == 'USD')?totalUSD += parseFloat(amount): totalCUP += parseFloat(amount)
                        }
                    })
                })
            })
        }
        return {totalUSD, totalCUP}        
    }, [currentYear])
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