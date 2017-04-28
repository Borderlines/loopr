import { BROWSE, SET_STRIP_STATE } from '../constants'

export default function (state = {
    stripOpened: true,
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
                stripOpened: true,
                browserType: action.browserType,
                browserProps: action.browserProps,
            }
        default:
            return state
    }
}
