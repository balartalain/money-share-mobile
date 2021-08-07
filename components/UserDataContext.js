import {createContext, useContext} from 'react'
import Heroku from '../controllers/index'
import { CONNECTION_ERROR } from '../ErrorConstants'

export const UserDataContext = createContext()

export const useUserDataContextHook = ()=>{
    const {currentUser, 
        appState, 
        setAppState, 
        markedItemsToDelete, 
        setMarkedItemsToDelete, 
        loadData, 
        logout, setCurrentUser} = useContext(UserDataContext)
    const changeYear = (year)=>{
        setAppState({...appState, selectedYear: year})
    }
    const totalAmount = ()=>{
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
    }
    const deleteItems = ()=>{        
        const deleteAsync = markedItemsToDelete.map(expense=>{
            
            return Heroku.deleteExpense(currentUser.id, expense)
        })

        Promise.all(deleteAsync).then(() => {
            const _userData = {...appState.userData}
            markedItemsToDelete.forEach(expense=>{
                const {year, month, day, created} = expense
                _userData[year][month+1][day][created].deleted = 'true'
            })
            setAppState({...appState, _userData}) 
            setMarkedItemsToDelete([])     
        }).catch((err) => {
            console.log(err)
            setMarkedItemsToDelete([])     
            setTimeout(()=> alert(CONNECTION_ERROR), 100)          
        }) 
    }
    const addExpense = async(newExpense)=>{
        try{
            await Heroku.createExpense(currentUser.id, newExpense)
            const {year, month, day, created} = newExpense
            const _userData = {...appState.userData}
            _userData[year] = _userData[year] || {}
            _userData[year][month] = _userData[year][month] || {}
            _userData[year][month][day] = _userData[year][month][day] || {}
            _userData[year][month][day][created] = {
                amount: newExpense.amount,
                concept: newExpense.concept,
                comment: newExpense.comment,
                currency: newExpense.currency
            }
            setAppState({...appState, userData:_userData})

        }catch(err){
            throw new Error(err)
        }

    }
    return {
        currentUser,
        appState, 
        changeYear, 
        totalAmount, 
        markedItemsToDelete, 
        deleteItems, 
        setMarkedItemsToDelete,
        addExpense,
        loadData,
        logout,
        setCurrentUser
    }
}