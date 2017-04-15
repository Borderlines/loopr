import fetch from 'isomorphic-fetch'
import { SERVER_URL } from '../utils/config'
import { checkHttpStatus, parseJSON } from './index'

function fetchLastItems({ username, count=10 }) {
    let url = `${SERVER_URL}/api/items/?limit=${count}&ordering=-added`
    if (username) url += `&users__username=${username}`
    return fetch(url, {
        // credentials: 'include',
        headers: {
            Accept: 'application/json',
            // Authorization: `Token ${token}`
        },
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then((data) => data.results)
}

function fetchUserShows({ username }) {
    return fetch(`${SERVER_URL}/api/loops/?username=${username}`, {
        // credentials: 'include',
        headers: {
            Accept: 'application/json',
            // Authorization: `Token ${token}`
        },
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then((items) => items[0].shows_list)
}

export const lastItemsInLoopr = () => (
    fetchLastItems({ count: 10 })
    // set a context
    .then((items) => (
        items.map((i) => (
            {
                ...i,
                context: {
                    title: 'Last items in loopr',
                    id: 'last_items_in_loopr',
                },
            }
        ))
    ))
)

export const shows = ({ username }) => (
    fetchUserShows({ username })
    .then((shows) => (
        shows.map((show) => (
            // set context
            show.items.map((i) => ({
                ...i,
                context: {
                    ...show,
                    items: null,
                },
            }))
        ))
    ))
    // flatten items
    .then((showsItems) => ([].concat.apply([], showsItems)))
)

export const lastUserItems = ({ username }) => {
    return fetchLastItems({ username })
    // set context
    .then((items) => (
        items.map((i) => ({
            ...i,
            context: {
                title: 'Last Items',
                id: `${username}_last_item`,
            },
        }))
    ))
}
