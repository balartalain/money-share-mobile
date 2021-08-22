import React, {createContext, useReducer} from 'react'
import PropTypes from 'prop-types'
import Reducer from './Reducers'
import DateUtils from './DateUtils'

const initialState = {
    currentUser: null,
    loggedUser: null,
    currentYear: DateUtils.CURRENT_YEAR,
    currentMonth: DateUtils.CURRENT_MONTH,
    years: [],
    data: null, 
    users :null,
    itemsToDelete: [],
    renderApp: false
}

const Store = ({children}) => {    
    const [state, dispatch] = useReducer(Reducer, initialState)
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
}

Store.propTypes = {
    children: PropTypes.any
}

export const Context = createContext(initialState)
export default Store