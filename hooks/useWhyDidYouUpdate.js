/* This hook makes it easy to see which prop changes are causing a component to re-render. 
If a function is particularly expensive to run and you know it renders the same results 
given the same props you can use the React.memo higher order component, as we've done with 
the Counter component in the below example. In this case if you're still seeing re-renders 
that seem unnecessary you can drop in the useWhyDidYouUpdate hook and check your console to 
see which props changed between renders and view their previous/current values */


// https://usehooks.com/

import { useEffect, useRef } from 'react'

export default function useWhyDidYouUpdate(name, props) {
    // Get a mutable ref object where we can store props ...
    // ... for comparison next time this hook runs.
    const previousProps = useRef()
    useEffect(() => {
        if (previousProps.current) {
        // Get all keys from previous and current props
            const allKeys = Object.keys({ ...previousProps.current, ...props })
            // Use this object to keep track of changed props
            const changesObj = {}
            // Iterate through keys
            allKeys.forEach((key) => {
                // If previous is different from current
                if (previousProps.current[key] !== props[key]) {
                    // Add to changesObj
                    changesObj[key] = {
                        from: previousProps.current[key],
                        to: props[key],
                    }
                }
            })
            // If changesObj not empty then output to console
            if (Object.keys(changesObj).length) {
                console.log('[why-did-you-update]', name, changesObj)
            }
        }
        // Finally update previousProps with current props for next hook call
        previousProps.current = props
    })
}