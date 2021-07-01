import axios from 'axios';
import {
    groups,
    users,
    user_months_amount,
    data
  } from '../FakeData';
import { herokuAPI } from '../herokuAPI';
import NetInfo from '@react-native-community/netinfo';

const REMOTE_HOST_URL = 'https://moneyshare00.herokuapp.com/api';
const CONECTION_ERROR = 'Error de conexión';
export const getGroups = ()=>{
    return new Promise(resolve => setTimeout(()=>{
        resolve(groups)}
        , 3000
    ));
    return groups;
}
export const getUsers = async ()=>{
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
    let response = await herokuAPI.get('/get-users/')
    return response;
}

export const registerUser = async (userInfo)=>{
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
    let response = await herokuAPI.put(`/${userInfo.id}/register-user/`, userInfo)
    return response;
}
export const getUserData = async (userId)=>{    
    const fakeData = {
        "2021":{
                "6":{
                    "30":{
                        "156434666":{
                            "amount": "215",
                            "currency": "USD",
                            "concept": "Venta de dolares",
                            "comment": "Comentario",
                            "updated": "156434666",
                            'deleted': 'true'
                        },
                        "21212232313":{
                            "amount": -90,
                            "currency": "USD",
                            "concept": "Venta de cup",
                            "comment": "otro Comentario",
                            "updated": "156434666",
                            'deleted': 'true'
                        }
                    }
                },
                "2":{
                    "3":{
                        "156434666":{
                            "amount": "215",
                            "currency": "USD",
                            "concept": "Venta de dolares",
                            "comment": "Comentario",
                            "updated": "156434666"
                        },
                        "21212232313":{
                            "amount": 100,
                            "currency": "USD",
                            "concept": "Venta de cup",
                            "comment": "otro Comentario",
                            "updated": "156434666"
                        },
                        "21212232383":{
                            "amount": 100,
                            "currency": "USD",
                            "concept": "Venta de cup",
                            "comment": "otro Comentario",
                            "updated": "156434666"
                        },
                        "21212237316":{
                            "amount": 100,
                            "currency": "USD",
                            "concept": "Venta de cup",
                            "comment": "otro Comentario",
                            "updated": "156434666"
                        }
                        
                    }
                }
            }
        }
    //return Promise.resolve({data: fakeData});
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
    let response = await herokuAPI.get(`/${userId}/get-data/`)
    return response;
}

export const createExpense = async(userId, data)=>{  
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
   let response = await herokuAPI.put(`/${userId}/add-expense/`, data)
    return response;     
}
export const deleteExpense = async(userId, data)=>{  
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
    let response = await herokuAPI.put(`/${userId}/delete-expense/`, data)
    return response;     
 }

 export const setSupervisor = async(userId, data)=>{  
    // let state = await NetInfo.fetch();
    // if (!state.isConnected){
    //     throw new Error(CONECTION_ERROR)
    // }
    let response = await herokuAPI.put(`/${userId}/set-supervisor/`, data)
    return response;     
 }