import Constants from 'expo-constants'

const currency=[{value: 'USD'}, {value: 'CUP'}]
const equalsIntegers = (a, b)=>{
    return parseInt(a) === parseInt(b)
}  
const color = {
    //primaryGreen: '#3EB489',
    primaryGreen: '#009988'
}

const formatNumber = amount => {
    return Number(amount)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')
}
const toBoolean = (value)=>{
    return value===true || value === 'true' || value === 'Y'
}
const ENV = Constants.manifest.extra?.env
const OFFLINE = Constants.manifest.extra?.offline ? true: false
export {
    color,
    currency,
    equalsIntegers,
    formatNumber,
    ENV,
    OFFLINE,
    toBoolean
}