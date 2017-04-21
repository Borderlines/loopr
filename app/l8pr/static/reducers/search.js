import * as c from '../constants'

const initialState = {
    terms: [],
    results: [],
}

const search = (state = initialState, action) => {
    switch (action.type) {
        case c.SET_SEARCH_TERMS:
            return {
                ...state,
                terms: action.payload,
            }
        case c.SET_SEARCH_RESULT:
            return {
                ...state,
                results: action.payload,
            }
        case c.CLEAR_SEARCH_LIST:
            return {
                ...state,
                results: [],
            }
        default:
            return state
    }
}

export default search
