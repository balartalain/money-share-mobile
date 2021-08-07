import * as Updates from 'expo-updates'

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

const getEnvironment = () =>{
    if (Updates.releaseChannel.startsWith('prod')) {
    // matches prod-v1, prod-v2, prod-v3
        return { envName: 'PRODUCTION' } // prod env settings
    } else if (Updates.releaseChannel.startsWith('staging')) {
    // matches staging-v1, staging-v2
        return { envName: 'STAGING'} // stage env settings
    } else {
    // assume any other release channel is development
        return { envName: 'DEVELOPMENT'} // dev env settings
    }
}
const isProductionEnv = ()=>{
    return getEnvironment().envName === 'PRODUCTION'
}
export {
    color,
    currency,
    equalsIntegers,
    formatNumber,
    getEnvironment,
    isProductionEnv
}