import React,{ useContext } from 'react'
import { View, Text} from 'react-native'
import { Divider } from 'react-native-elements'
import { color, formatNumber } from './../utils'
import { Context } from '../Store'
const TotalAmount = ()=>{
    const [gloabalState] = useContext(Context)
    const { data, currentYear } = gloabalState
    const totalAmount = ()=>{
        let totalUSD = 0,
            totalCUP = 0
        if (data && Object.keys(data).length > 0){
            Object.values(data[currentYear]).forEach(month=>{
                month.days.forEach(d=>{          
                    Object.values(d.expenses).forEach(exp=>{   
                        let { currency, amount} = exp;
                        (currency == 'USD')?totalUSD += parseFloat(amount): totalCUP += parseFloat(amount)
                                                
                    })
                })
            })
        }
        return {totalUSD, totalCUP}        
    }
    const {totalUSD, totalCUP} = totalAmount()
    return React.useMemo(() =>{
        console.log('Total Amount')
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
        )},[data, currentYear])
}
TotalAmount.displayName = 'TotalAmount'
export default TotalAmount