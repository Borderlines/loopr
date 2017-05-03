import { BROWSE, SET_STRIP_STATE } from '../constants'
const initialState = {
    stripOpened: true,
    browserType: 'PLAYQUEUE',
    browserProps: undefined,
}

export default function (state = initialState, action = null) {
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
                previousState: state,
            }
        case 'BROWSER_GO_BACK':
            return state.previousState || initialState
        default:
            return state
    }
}
