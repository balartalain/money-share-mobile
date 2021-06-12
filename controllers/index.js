import {
    groups,
    users,
    user_months_amount,
    data
  } from '../FakeData';
export const getGroups = ()=>{
    return new Promise(resolve => setTimeout(()=>{
        resolve(groups)}
        , 3000
    ));
    return groups;
}
export const getUserData = (userId)=>{
    return new Promise(resolve => setTimeout(()=>{
        resolve(data[userId])}
        , 2000
    )); 
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
        , 2000
    ));

}
