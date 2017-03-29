import { RECEIVE_LOOP, SET_STRIP_STATE } from '../constants'

export default function (state = {
    loop: [],
    stripOpened: false,
}, action = null) {
    switch (action.type) {
        case SET_STRIP_STATE:
            return {
                ...state,
                stripOpened: action.payload === true,
            }
        case RECEIVE_LOOP:
            return {
                ...state,
                loop: action.payload,
            }
        default:
            return state
    }
}
