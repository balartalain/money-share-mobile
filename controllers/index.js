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
export const getUserData = async (userId)=>{    
    let response = await herokuAPI.get(`/${userId}/get-data/`)
    debugger;
    return response;
}

export const createExpense = async(userId, data)=>{  
   let response = await herokuAPI.put(`/${userId}/add-expense/`, data)
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