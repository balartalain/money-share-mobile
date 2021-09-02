/* It's generally a good practice to indicate to users the status of any async request. 
An example would be fetching data from an API and displaying a loading indicator before rendering the results. 
Another example would be a form where you want to disable the submit button when the submission is pending 
and then display either a success or error message when it completes. */

// https://usehooks.com/
import { useState, useCallback } from 'react'

function dispatch(fn, args) {
    fn = (typeof fn == 'function') ? fn : window[fn]  // Allow fn to be a function object or the name of a global function
    return fn.apply(this, args || [])  // args is optional, use an empty array by default
}

export default function useAsync(){
    const [status, setStatus] = useState('idle')
    const [value, setValue] = useState(null)
    const [error, setError] = useState(null)
    // The execute function wraps asyncFunction and
    // handles setting state for pending, value, and error.
    // useCallback ensures the below useEffect is not called
    // on every render, but only if asyncFunction changes.
    const execute = useCallback((asyncFunction, params, onSuccessCallback=null) => {
        setStatus('pending')
        setValue(null)
        setError(null)
        return dispatch(asyncFunction, params)
            .then((response) => {
                if (onSuccessCallback){
                    onSuccessCallback(response)
                }
                setValue(response)
                setStatus('success')
            })
            .catch((error) => {                   
                setError(error)
                setStatus('error')
            })
    }, [execute])
    // Call execute if we want to fire it right away.
    // Otherwise execute can be called later, such as
    // in an onClick handler.
    // useEffect(() => {
    //     if (immediate) {
    //         execute(paramsArray)
    //     }
    // }, [execute, immediate])
    return [ execute, status, value, error ]
}

// Usage
// function App() {
//     const { execute, status, value, error } = useAsync(myFunction, false)
//     return (
//         <div>
//             {status === 'idle' && <div>Start your journey by clicking a button</div>}
//             {status === 'success' && <div>{value}</div>}
//             {status === 'error' && <div>{error}</div>}
//             <button onClick={execute} disabled={status === 'pending'}>
//                 {status !== 'pending' ? 'Click me' : 'Loading...'}
//             </button>
//         </div>
//     )
// }