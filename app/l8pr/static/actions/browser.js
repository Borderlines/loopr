import * as c from '../constants'

export function openStrip() {
    return {
        type: c.SET_STRIP_STATE,
        payload: true,
    }
}
export function closeStrip() {
    return {
        type: c.SET_STRIP_STATE,
        payload: false,
    }
}
export function toggleStrip(browserType, browserProps) {
    return (dispatch, getState) => {
        function toggle() {
            if (getState().browser.stripOpened) {
                dispatch(closeStrip())
            } else {
                dispatch(openStrip())
            }
        }
        if (!browserType) {
            toggle()
        } else {
            if (browserType === getState().browser.browserType) {
                toggle()
            } else {
                dispatch(browse(browserType, browserProps))
            }
        }
    }
}
export function browse(browserType, browserProps) {
    return {
        type: c.BROWSE,
        browserType,
        browserProps,
    }
}

export function goBack() {
    return { type: 'BROWSER_GO_BACK' }
}
