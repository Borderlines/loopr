import * as api from '../utils/api'
import * as c from '../constants'

export function search(searchTerms) {
    return (dispatch) => {
        dispatch(setTerms(searchTerms))
        if (searchTerms && searchTerms.length) {
            api.search(searchTerms)
            .then((searchResults) => {
                dispatch(setList(searchResults))
            })
        } else {
            dispatch(clearList())

        }
    }
}

function setList(items) {
    return {
        type: c.SET_SEARCH_RESULT,
        payload: items,
    }
}

function clearList(items) {
    return {
        type: c.CLEAR_SEARCH_LIST,
        payload: items,
    }
}

function setTerms(terms) {
    return {
        type: c.SET_SEARCH_TERMS,
        payload: terms,
    }
}
