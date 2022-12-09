import { ENV } from '../utils'
import firebaseDB from '../firebaseConfig'
import { ref, set, get, update } from 'firebase/database'
import {CONNECTION_ERROR} from '../ErrorConstants'
const TIMEOUT = 10000 // 5 seconds
const dbName = (!ENV || ENV === 'PRODUCTION')?'':'test/'
const Firebase = {
    getWithTimeOut: (ref)=>{
        return new Promise((resolve, reject)=>{
            let timeout = false
            let rejectTimeout = setTimeout(() => {   
                clearTimeout(rejectTimeout)
                rejectTimeout = null
                timeout = true        
                reject(CONNECTION_ERROR)
            }, TIMEOUT)
            get(ref).then(snapshot=>{
                if (!timeout){
                    if (snapshot.val() == null) {    
                        resolve({})        
                    } else {        
                        resolve(snapshot.val())        
                    }
                }
            }).catch(error=>{
                if (!timeout){
                    reject(error)
                }
            })
        })
    },
    setWithTimeOut: (ref, dataToSave)=>{
        return new Promise((resolve, reject)=>{
            let timeout = false
            let rejectTimeout = setTimeout(() => {   
                clearTimeout(rejectTimeout)
                rejectTimeout = null
                timeout = true            
                reject(CONNECTION_ERROR)
            }, TIMEOUT)
            set(ref, dataToSave).then(()=>{
                if (!timeout){
                    resolve()                            
                }
            }).catch(error=>{
                if (!timeout){
                    reject(error)
                }
            })
        })
    },
    updateWithTimeOut: (ref, dataToSave)=>{
        return new Promise((resolve, reject)=>{
            let timeout = false
            let rejectTimeout = setTimeout(() => {   
                clearTimeout(rejectTimeout)
                rejectTimeout = null
                timeout = true            
                reject(CONNECTION_ERROR)
            }, TIMEOUT)
            update(ref, dataToSave).then(()=>{
                if (!timeout){
                    resolve()                            
                }
            }).catch(error=>{
                if (!timeout){
                    reject(error)
                }
            })
        })
    },
    registerUser : (userInfo)=>{
        const user = {
            name: userInfo.name,
            email: userInfo.email || ''
        }  
        return Firebase.setWithTimeOut(firebaseDB.ref(`${dbName}users/${userInfo.id}`), user)
        // return new Promise((resolve, reject)=>{   
        //     const user = {
        //         name: userInfo.name,
        //         email: userInfo.email || ''
        //     }          
        //     const doRef = firebaseDB.ref(`${dbName}users/${userInfo.id}`)
        //     set(doRef, user).then(()=>{
        //         resolve()
        //     }).catch((error) => {
        //         reject(error)
        //     })
        // })
    },
    getUsers: ()=>{
        return Firebase.getWithTimeOut(ref(firebaseDB, `${dbName}users`))
        // return new Promise((resolve, reject)=>{
        //     let timeout = false
        //     const doRef = ref(firebaseDB, `${dbName}users`)  
        //     let rejectTimeout = setTimeout(() => {   
        //         clearTimeout(rejectTimeout)
        //         rejectTimeout = null
        //         timeout = true            
        //         reject(CONNECTION_ERROR)
        //     }, 5000) //5 seconds
        //     get(doRef).then(snapshot=>{
        //         if (!timeout){
        //             if (snapshot.val() == null) {    
        //                 resolve({})        
        //             } else {        
        //                 resolve(snapshot.val())        
        //             }
        //         }
        //     }).catch(error=>{
        //         if (!timeout){
        //             reject(error)
        //         }
        //     })
        // })
    },
    getUserData : (userId)=>{  
        return Firebase.getWithTimeOut(ref(firebaseDB, `${dbName}data/${userId}`) )
        // return new Promise((resolve, reject)=>{
        //     const doRef = ref(firebaseDB, `${dbName}data/${userId}`)  
        //     get(doRef).then(snapshot=>{
        //         if (snapshot.val() == null) {    
        //             resolve({})        
        //         } else {        
        //             resolve(snapshot.val())        
        //         }
        //     })
        // })
    },
    // Add new / update expense
    createExpense: (userId, data)=>{  
        const {year, month, day, created, amount, currency, concept, comment, updated} = data
        const expense = {
            amount,
            currency,
            concept,
            comment: comment || '',
            updated
        } 
        return Firebase.setWithTimeOut(ref(firebaseDB, `${dbName}data/${userId}/${year}/${month}/${day}/${created}`), expense)
        // return new Promise((resolve, reject)=>{
        //     const {year, month, day, created, amount, currency, concept, comment, updated} = data
        //     const expense = {
        //         amount,
        //         currency,
        //         concept,
        //         comment: comment || '',
        //         updated
        //     } 
        //     const doRef = ref(firebaseDB, `${dbName}data/${userId}/${year}/${month}/${day}/${created}`)
        //     set(doRef, expense).then(()=>{
        //         resolve(expense)
        //     }).catch((error) => {
        //         reject(error)
        //     })  
        // })
    },
    deleteExpense: (userId, data)=>{  
        const {year, month, day, created} = data
        return Firebase.updateWithTimeOut( ref(firebaseDB, `${dbName}data/${userId}/${year}/${month}/${day}/${created}`), {'deleted': 'true'})
        // return new Promise((resolve, reject)=>{
        //     const {year, month, day, created} = data
        //     const doRef = ref(firebaseDB, `${dbName}data/${userId}/${year}/${month}/${day}/${created}`)
        //     update(doRef, {'deleted': 'true'}).then(()=>{
        //         resolve('success')
        //     }).catch((error) => {
        //         reject(error)
        //     })   
        // })
    },
    setSupervisor: (userId, {isSupervisor})=>{  
        return Firebase.updateWithTimeOut(ref(firebaseDB, `${dbName}users/${userId}`), {'supervisor': isSupervisor})
        // return new Promise((resolve, reject)=>{
        //     const doRef = ref(firebaseDB, `${dbName}users/${userId}`)
        //     update(doRef, {'supervisor': isSupervisor}).then(()=>{
        //         resolve('success')
        //     }).catch((error) => {
        //         reject(error)
        //     })
        // })
    }
}
export default Firebase