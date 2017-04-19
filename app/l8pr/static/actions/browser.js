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
export function toggleStrip() {
    return (dispatch, getState) => {
        if (getState().browser.stripOpened) {
            dispatch(closeStrip())
        } else {
            dispatch(openStrip())
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
