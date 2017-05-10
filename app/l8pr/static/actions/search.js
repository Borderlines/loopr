import * as api from '../utils/api'
import * as c from '../constants'
import * as selectors from  '../selectors'

var lastSearch = undefined

export function search(searchTerms) {
    const timestamp = Date.now()
    lastSearch = timestamp
    return (dispatch, getState) => {
        dispatch({ type: 'SEARCH_STARTING' })
        dispatch(setTerms([...searchTerms]))
        if (searchTerms.length) {
            const preSearch = []
            const urls = []
            const users = []
            const keywords = []
            searchTerms.forEach((s) => {
                // find urls
                if (s.value.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi)) {
                    urls.push(s)
                } else if (s.value === '#my-last-tracks') {
                    preSearch.push(api.lastUserItems(getState(), { username: selectors.currentUsername(getState()) }))
                } else if (s.value.startsWith('@')) {
                    users.push(s.value.slice(1))
                } else {
                    keywords.push(s)
                }
            })
            const urlsMeta = Promise.all(urls.map((u) => (api.metadata(getState(), u.value))))
            const usersShowsResults = Promise.all(users.map(username => (api.fetchUserShows(getState(), { username }))))
                .then((usersShows) => ([].concat.apply([], usersShows)))
            const termsResults = keywords.length && api.search(getState(), keywords)
            const youtubeResult = keywords.length && api.youtube(getState(), keywords)
            Promise.all([
                ...preSearch,
                urlsMeta,
                usersShowsResults,
                termsResults,
                youtubeResult,
            ].map(p => (Promise.resolve(p))))
            .then((results) => {
                if (timestamp === lastSearch) {
                    dispatch(setList(
                        results
                            .reduce((a, b) => (a.concat(b)), [])
                            .filter(i => (i))
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
