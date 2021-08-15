import { herokuAPI } from '../herokuAPI'
import { ENV } from '../utils'
const Heroku = {
    registerUser : async (userInfo)=>{     
        let response = await herokuAPI.put(`/${userInfo.id}/register-user?env=${ENV}`, userInfo)
        return response
    },
    getUsers: async ()=>{
        // let state = await NetInfo.fetch();
        // if (!state.isConnected){
        //     throw new Error(CONECTION_ERROR)
        // }, 

        let response = await herokuAPI.get(`/get-users?env=${ENV}`)
        return response
    },
    getUserData : async (userId)=>{  
        let response = await herokuAPI.get(`/${userId}/get-data?env=${ENV}`)
        return response
    },
    createExpense: async(userId, data)=>{  

        let response = await herokuAPI.put(`/${userId}/add-expense?env=${ENV}`, data)
        return response     
    },
    deleteExpense: async(userId, data)=>{  
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
        let response = await herokuAPI.put(`/${userId}/delete-expense?env=${ENV}`, data)
        return response     
    },
    setSupervisor: async(userId, data)=>{  
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
        let response = await herokuAPI.put(`/${userId}/set-supervisor?env=${ENV}`, data)
        return response     
    }
}
export default Heroku