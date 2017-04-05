import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';

import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import * as c from '../constants';
import { authLoginUserFailure } from './auth';

export function openStrip(){
    return {
        type: c.SET_STRIP_STATE,
        payload: true,
    }
}
export function closeStrip(){
    return {
        type: c.SET_STRIP_STATE,
        payload: false,
    }
}
export function toggleStrip() {
    return (dispatch, getState) => {
        if (getState().browser.stripOpened) {
            dispatch(closeStrip())
        } else {
            dispatch(openStrip())
        }
    }
}
function receiveLoop(loop) {
    return {
        type: c.RECEIVE_LOOP,
        payload: loop,
    }
}

export function fetchShows(userId=2) {
    return (dispatch) => (
        fetch(`${SERVER_URL}/api/loops/${userId}/`, {
            // credentials: 'include',
            headers: {
                Accept: 'application/json',
                // Authorization: `Token ${token}`
            }
        })
        .then(checkHttpStatus)
        .then(parseJSON)
        .then((response) => {
            const loop = response.shows_list
            dispatch(receiveLoop(loop))
            return loop
        })
    )
}
