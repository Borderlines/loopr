import * as api from '../utils/api'
import * as c from '../constants'

var lastSearch = undefined

export function search(searchTerms) {
    const timestamp = Date.now()
    lastSearch = timestamp
    return (dispatch) => {
        dispatch({ type: 'SEARCH_STARTING' })
        dispatch(setTerms(searchTerms))
        if (searchTerms && searchTerms.length) {
            api.search(searchTerms)
            .then((searchResults) => {
                if (timestamp === lastSearch) {
                    dispatch(setList(searchResults))
                }
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
