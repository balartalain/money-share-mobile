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
const toBoolean = (value)=>{
    return value === 'true' || value === 'Y'
}
/**
 * 
 * import * as Updates from 'expo-updates';

try {
  const update = await Updates.checkForUpdateAsync();
  if (update.isAvailable) {
    await Updates.fetchUpdateAsync();
    // ... notify user of update ...
    await Updates.reloadAsync();
  }
} catch (e) {
  // handle or log error
}

 */

const checkForUpdate = async ()=>{
    const update = await Updates.checkForUpdateAsync()
    return update.isAvailable
}
const updateAppAsync = async(callbacks)=>{
    try {
        callbacks.onFinishCheckForUpdate = callbacks.onFinishCheckForUpdate || (()=>{})
        callbacks.onFinishDownloadUpdate = callbacks.onFinishDownloadUpdate || (()=>{})
        callbacks.onInitCheckForUpdate = callbacks.onInitCheckForUpdate || (()=>{})        
        callbacks.onInitCheckForUpdate()
        const update = await Updates.checkForUpdateAsync()
        callbacks.onFinishCheckForUpdate(update.isAvailable)
        if (update.isAvailable) {            
            await Updates.fetchUpdateAsync()
            callbacks.onFinishDownloadUpdate()
            // ... notify user of update ...
            await Updates.reloadAsync()
        }
        else return 0
    } catch (e) {
        throw new Error(e)
    } 
}
export {
    color,
    currency,
    equalsIntegers,
    formatNumber,
    getEnvironment,
    isProductionEnv,
    toBoolean,
    updateAppAsync
}