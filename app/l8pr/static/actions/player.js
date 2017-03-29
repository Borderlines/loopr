import fetch from 'isomorphic-fetch';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import * as c from '../constants';
import * as selectors from '../selectors'
import { get } from 'lodash'
import { push } from 'react-router-redux'

export function setPlaylist(playlist) {
    return {
        type: c.SET_PLAYLIST,
        payload: playlist,
    }
}

export function play(showAndItem) {
    return (dispatch, getState) => {
        dispatch({
            type: c.PLAY,
            payload: showAndItem,
        })
        const show = selectors.currentShow(getState())
        const item = selectors.currentTrack(getState())
        dispatch(push(`/show/${show}/item/${item}`))
    }
}

export function next() {
    return (dispatch, getState) => {
        let nextItem = undefined
        let nextShow = undefined
        const currentShow = selectors.getCurrentShow(getState())
        const itemPositionInShow = selectors.getCurrentTrackPositionInShow(getState())
        if (itemPositionInShow < currentShow.items.length - 1) {
            nextItem = currentShow.items[itemPositionInShow + 1]
        } else {
            const showPosition = selectors.getCurrentShowPositionInShow(getState())
            const playlist = selectors.playlist(getState())
            nextShow = playlist[(showPosition + 1) % playlist.length]
            nextItem = nextShow.items[0]
        }
        return dispatch(play({
            item: get(nextItem, 'id'),
            show: get(nextShow, 'id'),
        }))
    }
}

export function previous() {
    return { type: c.PREVIOUS }
}
