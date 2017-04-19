import { BROWSE, SET_STRIP_STATE } from '../constants'

export default function (state = {
    stripOpened: false,
    browserType: 'PLAYQUEUE',
    browserProps: undefined,
}, action = null) {
    switch (action.type) {
        case SET_STRIP_STATE:
            return {
                ...state,
                stripOpened: action.payload === true,
            }
        case BROWSE:
            return {
                ...state,
                browserType: action.browserType,
                browserProps: action.browserProps,
            }
        default:
            return state
    }
}
