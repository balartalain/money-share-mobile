/* This hook makes it easy to see which prop changes are causing a component to re-render. 
If a function is particularly expensive to run and you know it renders the same results 
given the same props you can use the React.memo higher order component, as we've done with 
the Counter component in the below example. In this case if you're still seeing re-renders 
that seem unnecessary you can drop in the useWhyDidYouUpdate hook and check your console to 
see which props changed between renders and view their previous/current values */


// https://usehooks.com/

import { useEffect, useRef } from 'react'

export default function useWhyDidYouUpdate(name, props, state) {
    // Get a mutable ref object where we can store props ...
    // ... for comparison next time this hook runs.
    const previousProps = useRef()
    const previousState = useRef()
    const logChanges = (prevObj, obj, objectName)=>{
        if (prevObj.current) {
            // Get all keys from previous and current props
            const allKeys = Object.keys({ ...prevObj.current, ...obj })
            // Use this object to keep track of changed props
            const changesObj = {}
            // Iterate through keys
            allKeys.forEach((key) => {
                // If previous is different from current
                if (prevObj.current[key] !== obj[key]) {
                    // Add to changesObj
                    changesObj[key] = {
                        from: prevObj.current[key],
                        to: obj[key],
                    }
                }
            })
            // If changesObj not empty then output to console
            if (Object.keys(changesObj).length) {
                console.log('[why-did-you-update]', name, objectName, changesObj)
            }
        }

    }
    useEffect(() => {
        if (__DEV__){
            logChanges(previousProps, props, 'props')
            logChanges(previousState, state, 'state')
            // Finally update previousProps with current props for next hook call
            previousProps.current = props
            previousState.current = state
        }
    })
}