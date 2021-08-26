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
        
        data.find(year=>parseInt(year.id) === currentYear).months.forEach(m=>{
            m.days.forEach(d=>{          
                const {expenses} = d
                Object.keys(d.expenses).filter(created=>!toBoolean(expenses[created].delete)).forEach(created=>{   
                    let { currency, amount} = expenses[created];
                    (currency == 'USD')?totalUSD += parseFloat(amount): totalCUP += parseFloat(amount)                   
                })
            })
        })
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