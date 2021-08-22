import DateUtils from '../DateUtils'


const Reducer = (state, action) => {
    switch (action.type) {
    case 'SET_RENDER_APP':
        return {
            ...state,
            renderApp: action.renderApp
        }
    case 'SET_LOGGED_USER':
        return {
            ...state,
            loggedUser: action.loggedUser,
            currentUser: action.loggedUser
        }
    case 'SET_CURRENT_USER':
        return {
            ...state,
            currentUser: action.user,
            currentYear: DateUtils.CURRENT_YEAR,
            currentMonth: DateUtils.CURRENT_MONTH,
            years: [],
            data: null, 
            users :null,
            itemsToDelete: []
        }
    case 'SET_CURRENT_YEAR':{ 
        const newState = {
            ...state,
            currentYear: action.year,
            currentMonth: DateUtils.CURRENT_MONTH            
        } 
        if (newState.itemsToDelete.length > 0){
            newState.itemsToDelete = []
        }
        return newState
    }
    case 'SET_CURRENT_MONTH':{
        const newState = {
            ...state,
            currentMonth: action.month
        }
        if (newState.itemsToDelete.length > 0){
            newState.itemsToDelete = []
        }
        return newState
    }          
    case 'LOAD_DATA':
        return {
            ...state,
            data: action.data,
            years: action.years,
            currentYear: DateUtils.CURRENT_YEAR,
            currentMonth: DateUtils.CURRENT_MONTH
        }
    case 'LOAD_USERS':
        return {
            ...state,
            users: action.users
        }
    case 'ADD_ITEM_TO_DELETE':
        return {
            ...state,
            itemsToDelete: [...state.itemsToDelete, action.item]
        }
    case 'REMOVE_ITEM_TO_DELETE':
        return {
            ...state,
            itemsToDelete: [...state.itemsToDelete, action.item]
        }
    case 'CLEAR_ITEMS_TO_DELETE':
        return {
            ...state,
            itemsToDelete: []
        }    
        
    case 'LOGGOUT':
        return {
            ...state,
            currentUser: null,
            loggedUser: true
        }    
    default:
        return state
    }
}

export default Reducer