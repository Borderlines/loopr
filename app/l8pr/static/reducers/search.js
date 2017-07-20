import * as c from '../constants'

const initialState = {
    terms: [],
    results: [],
    loading: false,
}

const search = (state = initialState, action) => {
    switch (action.type) {
        case 'SEARCH_STARTING':
            return {
                ...state,
                loading: true,
            }
        case c.SET_SEARCH_TERMS:
            return {
                ...state,
                terms: action.payload,
            }
        case c.SET_SEARCH_RESULT:
            return {
                ...state,
                loading: false,
                results: action.payload,
            }
        case c.CLEAR_SEARCH_LIST:
            return search(state, {
                type: c.SET_SEARCH_RESULT,
                payload: [],
            })
        default:
            return state
    }
}

export default search
