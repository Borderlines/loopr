import { BROWSE, SET_STRIP_STATE } from '../constants'
const initialState = {
    stripOpened: true,
    stripHidden: false,
    stripFixed: true,
    browserType: 'PLAYQUEUE',
    browserProps: undefined,
    openedContext: undefined,
}

export default function (state = initialState, action = null) {
    switch (action.type) {
        case 'IdleMonitor_active':
            return {
                ...state,
                stripHidden: false,
            }
        case 'IdleMonitor_idle':
            return {
                ...state,
                stripHidden: true,
            }
        case 'BROWSER_OPEN_CONTEXT':
            return {
                ...state,
                openedContext: action.payload,
            }
        case SET_STRIP_STATE:
            return {
                ...state,
                ...action.payload,
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
