import * as api from '../utils/api'
import * as c from '../constants'

var lastSearch = undefined

export function search(searchTerms) {
    const timestamp = Date.now()
    lastSearch = timestamp
    return (dispatch, getState) => {
        dispatch({ type: 'SEARCH_STARTING' })
        dispatch(setTerms([...searchTerms]))
        if (searchTerms.length) {
            // find urls
            const urls = searchTerms.filter(s => (
                s.value.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi)
            ))
            // remove them from ES search request
            urls.forEach(u => searchTerms.splice(searchTerms.indexOf(u), 1))
            const urlsMeta = Promise.all(urls.map((u) => (api.metadata(getState(), u.value))))
            const termsResults = searchTerms.length && api.search(getState(), searchTerms)
            Promise.all([urlsMeta, termsResults].map(p => (Promise.resolve(p))))
            .then(([urlsMeta, termsResults]) => {
                if (timestamp === lastSearch) {
                    dispatch(setList(
                        [...urlsMeta, ...termsResults].filter(i => (i))
                    ))
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
