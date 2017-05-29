import fetch from 'isomorphic-fetch'
import { isNil, trim } from 'lodash'
import { checkHttpStatus, parseJSON } from './index'

export default function api(state) {
    const getCommonOptions = (optionsToMerge) => {
        const opts = {
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
        if (state.auth.token) {
            opts.headers.Authorization = `Token ${state.auth.token}`
        }
        return {
            ...opts,
            ...optionsToMerge,
        }
    }
    const _fetch = (url, opt) => fetch(url, opt)
        .then(checkHttpStatus)
        .then(parseJSON)
    return ({
        get: (url) => _fetch(url, getCommonOptions()),
        post: (url, body) => _fetch(url, getCommonOptions({
            method: 'post',
            body: JSON.stringify(body),
        })),
        put: (url, body) => _fetch(url, getCommonOptions({
            method: 'put',
            body: JSON.stringify(body),
        })),
    })
}

function fetchLastItems(state, { username, count=10 }) {
    let url = `api/items/?limit=${count}&ordering=-added`
    if (username) url += `&shows__user__username=${username}`
    return api(state).get(url)
    .then((data) => data.results)
}

export function fetchUserShows(state, { username }) {
    return api(state).get(`api/loops/?username=${username}`)
    .then((items) => items[0].shows_list)
}

export const lastItemsInLoopr = (state) => {
    return fetchLastItems(state, { count: 10 })
}

export const show = (state, { id }) => (
    api(state).get(`api/shows/${id}/`)
)

export const follow = (state, id) => (
    api(state).post(`api/users/${id}/follow/`)
)

export const unfollow = (state, id) => (
    api(state).post(`api/users/${id}/unfollow/`)
)

export const feed = (state) => (
    api(state).get('api/feed/?limit=50')
    .then((data) => data.results)
)

export const lastUserItems = (state, { username }) => {
    return fetchLastItems(state, { username })
}

function getCookie(name) {
    var cookieValue = null
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';')
        for (var i = 0; i < cookies.length; i++) {
            var cookie = trim(cookies[i])
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
                break
            }
        }
    }
    return cookieValue
}

export const saveItem = (state, item) => {
    if (!isNil(item.id)) {
        return Promise.resolve(item)
    }
    item.id = undefined
    return api(state).post('api/items/', item)
}

export const saveShow = (state, show) => {
    const method = isNil(show.id) ? 'post' : 'put'
    const url = isNil(show.id) ? 'api/shows/' : `api/shows/${show.id}/`
    return api(state)[method](url, show)
}

export const search = (state, searchTerms) => {
    const terms = searchTerms.map((v) => v.value).join('+')
    return api(state).get(`api/search/?text=${terms}`)
}

export const metadata = (state, url) => {
    return api(state).get(`api/metadata/?url=${url}`)
}

export const youtube = (state, searchTerms) => {
    const terms = searchTerms.map((v) => v.value).join('+')
    return api(state).get(`api/youtube/?q=${terms}`)
}
