import React, {useState, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import AsyncStorageHelper  from '../AsyncStorageHelper'
import Heroku from '../controllers'
import { CONNECTION_ERROR } from '../ErrorContants'
const AppUserContext = React.createContext([null, ()=>{}])

export const AppUserProvider = ({updatedUser, children}) =>{
    const [state, setState] = useState(null)
    const setAppUser = (user)=>{             
        setState(user)
        if (updatedUser){
            updatedUser(user)
        }
    }
    return (
        <AppUserContext.Provider value={[state, setAppUser]} >
            {children}
        </AppUserContext.Provider>
    )
}

AppUserProvider.propTypes = {
    user: PropTypes.object,
    children: PropTypes.object,
    updatedUser: PropTypes.func
}
export const useAppUser = () => {
    const [state, setState] = useContext(AppUserContext)
    useEffect(() => {
        (async()=>{
            // const _appUser = await AsyncStorageHelper.getObject('appUser')            
            const _appUser = {
                id: '10222108852244678',
                name: 'Alain Pérez Balart',
                email: 'balartalain@gmail.com',
                token: 'EAAInQQgBZBoMBAPNJy7ZBHHKXwzlC7KjRc20IddoWWdZAZAqZC9rsbpYrUZC2HpHv6VRsEr5JhIExQrT6VCQj9ZBOpJxKKV9A8Mo3kgQp2hZAduDkQnff1Ine2cfJkD8gxfHyrZCVknsPZAddOZC0OlckXwzqbhoTwZB1UWBKRsJJEoAsCc1bBATQFCPhttVrEZBS3YRKGZCvkAs4ErTZCcIGxSlZCIgDjyuVSfIF0X4CBJcaR3MUAZDZD',
                picture:{
                    data:{
                        url: '../assets/picture.png'
                    }
                },
                expirationDate: new Date()
            }
            if (_appUser){
                setState(_appUser)
            }
        })()
    }, [])
    const setAppUser = (user)=>{
        return new Promise((resolve, reject)=>{
            Heroku.registerUser(user).then(()=>{
                AsyncStorageHelper.saveObject(user)
                setState(user)
                resolve()
            }).catch(()=>{
                reject(CONNECTION_ERROR)
            })
        })
    }
    return { appUser:state, setAppUser }
}