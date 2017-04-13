import fetch from 'isomorphic-fetch'

import { SERVER_URL } from '../utils/config'
import { checkHttpStatus, parseJSON } from '../utils'

export function fetchLastItems({ username }) {
    return fetch(`${SERVER_URL}/api/items/?users=${username}&limit=10`, {
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

export function fetchUserShows({ username }) {
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
