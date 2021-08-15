import { useState, useEffect, useCallback } from 'react'
import * as Updates from 'expo-updates'

export default function updateAppAsync(){
    const [status, setStatus] = useState(null)

    const update = useCallback(async() =>{
        try {
            if (!__DEV__){
                setStatus('Searching updates...')
                const update = await Updates.checkForUpdateAsync()
                if (update.isAvailable) {
                    setStatus('Downloading...')                        
                    await Updates.fetchUpdateAsync()
                    setStatus('Update completed. The app\'ll be restart now')
                    await Updates.reloadAsync()
                }
                else {
                    setStatus(null)
                }
            }
        } catch (e) {
            setStatus(null)
        } 
    }, [])
    useEffect(() => { 
        update()                      
    }, [])
    
    return status
}