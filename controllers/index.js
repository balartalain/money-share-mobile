import axios from 'axios';
import {
    groups,
    users,
    user_months_amount,
    data
  } from '../FakeData';
import { herokuAPI } from '../herokuAPI';

const REMOTE_HOST_URL = 'https://moneyshare00.herokuapp.com/api';

export const getGroups = ()=>{
    return new Promise(resolve => setTimeout(()=>{
        resolve(groups)}
        , 3000
    ));
    return groups;
}
export const getUsers = async ()=>{
    let response = await herokuAPI.get('/get-users/')
    return response;
}

export const registerUser = async (userInfo)=>{
    return Promise.resolve('success');
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
                            "updated": "156434666"
                        },
                        "21212232313":{
                            "amount": -90,
                            "currency": "USD",
                            "concept": "Venta de cup",
                            "comment": "otro Comentario",
                            "updated": "156434666"
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
    return Promise.resolve({data: fakeData});
    let response = await herokuAPI.get(`/${userId}/get-data/`)
    return response;
}

export const createExpense = async(userId, data)=>{  
   let response = await herokuAPI.put(`/${userId}/add-expense/`, data)
    return response;     
}
export const deleteExpense = async(userId, data)=>{  
    let response = await herokuAPI.put(`/${userId}/delete-expense/`, data)
    return response;     
 }

 export const setSupervisor = async(userId, data)=>{  
    let response = await herokuAPI.put(`/${userId}/set-supervisor/`, data)
    return response;     
 }
export const getUserYears = (userId)=>{
    //console.log(Object.keys(user_months_amount[userId]))
    return new Promise(resolve => setTimeout(()=>{
        resolve(Object.keys(user_months_amount[userId]))}
        , 2000
    ));
}
export const getMonthData = (userId, year, month)=>{
    return new Promise(resolve => setTimeout(()=>{
            const yearData = data[userId][year] || {};        
            resolve(yearData[month] || {})
        }
        , 500
    ));

}