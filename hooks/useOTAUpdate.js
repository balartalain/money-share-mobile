import { useState, useEffect, useCallback } from 'react'
import * as Updates from 'expo-updates'

const awaitAsync = async(delay)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve, delay)
    })
}

export default function updateAppAsync(){
    const [status, setStatus] = useState(null)
    const [message, setMessage] = useState('')
    
    const update1 = useCallback(async() =>{
        try {
            setStatus('pending')                    
            setMessage('Searching updates...')
            await awaitAsync(2000)
            // const update = await Updates.checkForUpdateAsync()
            const update = {isAvailable: true}
            if (update.isAvailable) {
                setMessage('Downloading...')                        
                //await Updates.fetchUpdateAsync()
                await awaitAsync(3000)
                setMessage('Update completed. The app\'ll be restart now')
                //await Updates.reloadAsync()
                await awaitAsync(1000)
                setStatus('completed')
            }
            else {
                setMessage('')
                setStatus('completed')
            }
            
        } catch (e) {
            setMessage('')
            setStatus('completed')
        } 
    }, [])
    const update = useCallback(async() =>{
        try {
            if (!__DEV__){
                setStatus('pending')
                setMessage('Searching updates...')
                const update = await Updates.checkForUpdateAsync()
                if (update.isAvailable) {
                    setMessage('Downloading...')                        
                    await Updates.fetchUpdateAsync()
                    setMessage('Update completed. The app\'ll be restart now')
                    await Updates.reloadAsync()
                }
                else {
                    setMessage('')
                    setStatus('completed')
                }
            }else {
                setMessage('')
                setStatus('completed')
            }
        } catch (e) {
            setMessage('')
            setStatus('completed')
        } 
    }, [])
    useEffect(() => { 
        update()                      
    }, [])
    
    return [status, message]
}