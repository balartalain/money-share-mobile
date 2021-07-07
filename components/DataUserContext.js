import {createContext, useContext} from 'react'

export const DataUserContext = createContext([{}, ()=>{}])

export const useDataUserContextHook = ()=>{
    const {appState, setAppState} = useContext(DataUserContext)

    const changeYear = (year)=>{
        setAppState({...appState, selectedYear: year})
    }
    const totalAmount = (()=>{
        let totalUSD = 0,
            totalCUP = 0
        
        const {userData, selectedYear} = appState
        if (userData && Object.keys(userData).length > 0){
            Object.keys(userData[selectedYear]).forEach(m=>{
                const monthData = userData[selectedYear][m]
                Object.keys(monthData).forEach(d=>{          
                    Object.keys(monthData[d]).forEach(time=>{   
                        if (monthData[d][time].deleted !== 'true'){
                            let { currency, amount} = monthData[d][time];
                            (currency == 'USD')?totalUSD += parseFloat(amount): totalCUP += parseFloat(amount)
                        }
                    })
                })
            })
        }
        return {totalUSD, totalCUP}        
    })()
    return {appState, changeYear, totalAmount}
}
// const useDataUser = () => {
//     const [state, setState] = useContext(DataUserContext)

//export  DataUserContext