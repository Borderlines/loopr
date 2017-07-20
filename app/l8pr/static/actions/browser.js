import * as c from '../constants'
import * as api from '../utils/api'
import * as data from '../actions/data'

export function openContext(contextId) {
    return {
        type: 'BROWSER_OPEN_CONTEXT',
        payload: contextId,
    }
}

export function openStrip() {
    return {
        type: c.SET_STRIP_STATE,
        payload: {
            stripOpened: true,
            stripHidden: false,
        },
    }
}
export function closeStrip() {
    return {
        type: c.SET_STRIP_STATE,
        payload: { stripOpened: false },
    }
}

export function toggleFixedStrip() {
    return (dispatch, getState) => {
        dispatch({
            type: c.SET_STRIP_STATE,
            payload: { stripFixed: !getState().browser.stripFixed },
        })
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

export function browseShow(showIdOrObject) {
    return (dispatch, getState) => {
        if (typeof showIdOrObject === 'object') {
            return dispatch(browse('SHOW', { show: showIdOrObject }))
        }
        if (getState().data.shows[showIdOrObject]) {
            return dispatch(browse('SHOW', { show: getState().data.shows[showIdOrObject] }))
        } else {
            return api.show(getState(), { id: showIdOrObject })
            .then(show => {
                dispatch(data.addShows([show]))
                dispatch(browse('SHOW', { show }))
            })
        }
    }

}

export function goBack() {
    return { type: 'BROWSER_GO_BACK' }
}
