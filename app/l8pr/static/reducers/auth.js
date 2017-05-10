import { createReducer } from '../utils'
import {
    AUTH_LOGIN_USER_REQUEST,
    AUTH_LOGIN_USER_SUCCESS,
    AUTH_LOGIN_USER_FAILURE,
    AUTH_LOGOUT_USER,
} from '../constants'


const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isAuthenticating: false,
    statusText: null,
    loop: null,
}

export default createReducer(initialState, {
    ['AUTH_SET_LOOP']: (state, payload) => {
        return {
            ...state,
            loop: payload,
        }
    },
    ['AUTH_UPDATE_SHOW']: (state, payload) => {
        const loop = [...state.loop]
        const existingShowIndex = state.loop.findIndex((s) => s.id === payload.id)
        if (existingShowIndex > -1) {
            loop[existingShowIndex] = payload
        } else {
            loop.unshift(payload)
        }
        return {
            ...state,
            loop,
        }
    },
    [AUTH_LOGIN_USER_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isAuthenticating: true,
            statusText: null,
        })
    },
    [AUTH_LOGIN_USER_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isAuthenticating: false,
            isAuthenticated: true,
            token: payload.token,
            user: payload.user,
            statusText: 'You have been successfully logged in.',
        })
    },
    [AUTH_LOGIN_USER_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            isAuthenticating: false,
            isAuthenticated: false,
            user: null,
            token: null,
            statusText: `Authentication Error: ${payload.status} - ${payload.statusText}`,
        })
    },
    [AUTH_LOGOUT_USER]: (state, payload) => {
        return Object.assign({}, state, {
            isAuthenticated: false,
            user: null,
            token: null,
            statusText: 'You have been successfully logged out.',
        })
    },
})
