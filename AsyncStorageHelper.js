import AsyncStorage from '@react-native-async-storage/async-storage'

export default class AsyncStorageHelper{
    static async saveItem(key, value){
        await AsyncStorage.setItem(key, value)
    }
    static async saveObject(key, obj){
        //try {
        const jsonValue = JSON.stringify(obj)
        await AsyncStorage.setItem(key, jsonValue)
        //} catch (e) {

        //}
    }
    static async getItem(key){
        return await AsyncStorage.getItem(key)
    }
    static async getObject(key){
        try {
            const jsonValue = await AsyncStorageHelper.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            return null
        }
    }
    static async removeObject(key) {
        await AsyncStorage.removeItem(key)        
    }
    static async logCurrentStorage() {
        AsyncStorage.getAllKeys().then((keyArray) => {
            AsyncStorage.multiGet(keyArray).then((keyValArray) => {
                let myStorage = {}
                for (let keyVal of keyValArray) {
                    myStorage[keyVal[0]] = keyVal[1]
                }      
                console.log('CURRENT STORAGE: ', myStorage)
            })
        })
    }
}