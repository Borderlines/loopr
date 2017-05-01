import fetch from 'isomorphic-fetch'
import { push } from 'react-router-redux'
import * as api from '../utils/api'
import { hideModal } from '../actions/modal'
import { orderBy, cloneDeep } from 'lodash'
import { checkHttpStatus, parseJSON } from '../utils'
import {
    AUTH_LOGIN_USER_REQUEST,
    AUTH_LOGIN_USER_FAILURE,
    AUTH_LOGIN_USER_SUCCESS,
    AUTH_LOGOUT_USER,
} from '../constants'

export function authLoginUserSuccess(token, user) {
    return (dispatch, getState) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        dispatch({
            type: AUTH_LOGIN_USER_SUCCESS,
            payload: {
                token,
                user,
            },
        })
        // get user's shows
        api.fetchUserShows(getState(), { username: user.username })
        .then((loop) => {
            dispatch({
                type: 'AUTH_SET_LOOP',
                payload: orderBy(loop, ['updated'], ['desc']),
            })
        })
    }
}

export function saveItem(item) {
    return (dispatch, getState) => (
        api.saveItem(getState(), { ...item })
    )
}

export function saveShow(show) {
    return (dispatch, getState) => (
        Promise.all(show.items.map((item) => dispatch(saveItem(item))))
        .then(items => ({
            ...show,
            items,
        }))
        .then(show => (
            api.saveShow(getState(), show)
            // update show
            .then((show) => dispatch(updateShow(show)))
        ))
    )
}

export function toggleItemToShow(item, show) {
    return (dispatch) => (
        // save item
        dispatch(saveItem(item))
        // save or remove the item in the show
        .then((item) => {
            const newShow = cloneDeep(show)
            if (newShow.items.find(i => i.id === item.id)) {
                newShow.items = newShow.items.filter((i) => (i.id !== item.id))
            } else {
                newShow.items = [item, ...newShow.items]
            }
            return dispatch(saveShow(newShow))
        })
    )
}

export function updateShow(show) {
    return {
        type: 'AUTH_UPDATE_SHOW',
        payload: show,
    }
}

export function authLoginUserFailure(error, message) {
    localStorage.removeItem('token')
    return {
        type: AUTH_LOGIN_USER_FAILURE,
        payload: {
            status: error,
            statusText: message,
        },
    }
}

export function authLoginUserRequest() {
    return { type: AUTH_LOGIN_USER_REQUEST }
}

export function authLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return { type: AUTH_LOGOUT_USER }
}

export function authLogoutAndRedirect() {
    return (dispatch) => {
        dispatch(authLogout())
        dispatch(push('/login'))
        return Promise.resolve() // TODO: we need a promise here because of the tests, find a better way
    }
}

export function authLoginUser(email, password, redirect = '/') {
    return (dispatch) => {
        dispatch(authLoginUserRequest())
        var formData = new FormData()
        formData.append('password', password)
        formData.append('username', email)
        return fetch('auth/login/', {
            method: 'post',
            body: formData,
            headers: { Accept: 'application/json' },
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then((response) => (
                fetch('auth/me/', {
                    method: 'get',
                    headers: { Authorization: `Token ${response.auth_token}` },
                })
                .then(checkHttpStatus)
                .then(parseJSON)
                .then((user) => {
                    dispatch(authLoginUserSuccess(response.auth_token, user))
                    dispatch(hideModal())
                    dispatch(push(redirect))
                })
            ))
            .catch((error) => {
                if (error && typeof error.response !== 'undefined' && error.response.status === 401) {
                    // Invalid authentication credentials
                    return error.response.json().then((data) => {
                        dispatch(authLoginUserFailure(401, data.non_field_errors[0]))
                    })
                } else if (error && typeof error.response !== 'undefined' && error.response.status >= 500) {
                    // Server side error
                    dispatch(authLoginUserFailure(500, 'A server error occurred while sending your data!'))
                } else {
                    // Most likely connection issues
                    dispatch(authLoginUserFailure('Connection Error', 'An error occurred while sending your data!'))
                }

                return Promise.resolve() // TODO: we need a promise here because of the tests, find a better way
            })
    }
}
