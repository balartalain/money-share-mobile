import {
    groups,
} from '../FakeData'
import { herokuAPI } from '../herokuAPI'
export const getGroups = ()=>{
    return new Promise(resolve => setTimeout(()=>{
        resolve(groups)}
    , 3000
    ))
    return groups
}
export const getUsers = async ()=>{
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
    let response = await herokuAPI.get('/get-users/')
    return response
}

export const registerUser = async (userInfo)=>{
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
    let response = await herokuAPI.put(`/${userInfo.id}/register-user/`, userInfo)
    return response
}
export const getUserData = async (userId)=>{    
    let response = await herokuAPI.get(`/${userId}/get-data/`)
    return response
}

export const createExpense = async(userId, data)=>{  
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
    let response = await herokuAPI.put(`/${userId}/add-expense/`, data)
    return response     
}
export const deleteExpense = async(userId, data)=>{  
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
    let response = await herokuAPI.put(`/${userId}/delete-expense/`, data)
    return response     
}

export const setSupervisor = async(userId, data)=>{  
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
    let response = await herokuAPI.put(`/${userId}/set-supervisor/`, data)
    return response     
}
const Heroku = {
    registerUser : async (userInfo)=>{
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
        return Promise.resolve(1)
        let response = await herokuAPI.put(`/${userInfo.id}/register-user/`, userInfo)
        return response
    },
    getUserData : async (userId)=>{  
        const data = {
            2021:{
                7:{
                    '06':{
                        '123456789':{
                            'amount': 2021,
                            'concept': 'concept',
                            'comment': 'comment',
                            'currency': 'CUP'
                        }
                    }
                }
            },2022:{
                5:{
                    '02':{
                        '123456789':{
                            'amount': 2022,
                            'concept': 'concept',
                            'comment': 'comment',
                            'currency': 'CUP'
                        }
                    }
                }
            },2020:{
                5:{
                    '02':{
                        '123456789':{
                            'amount': 2020,
                            'concept': 'concept',
                            'comment': 'comment',
                            'currency': 'CUP'
                        }
                    }
                }
            },
  

        } 
        return Promise.resolve({data:data})
        let response = await herokuAPI.get(`/${userId}/get-data/`)
        return response
    },
    createExpense: async(userId, data)=>{  
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
        let response = await herokuAPI.put(`/${userId}/add-expense/`, data)
        return response     
    },
    deleteExpense: async(userId, data)=>{  
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
        let response = await herokuAPI.put(`/${userId}/delete-expense/`, data)
        return response     
    },
    setSupervisor: async(userId, data)=>{  
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
        let response = await herokuAPI.put(`/${userId}/set-supervisor/`, data)
        return response     
    }
}
export default Heroku