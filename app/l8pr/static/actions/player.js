import { fetchLastItems, fetchUserShows } from './data'
import * as c from '../constants'
import * as selectors from '../selectors'
import { push } from 'react-router-redux'

export function setPlaylist(playlist) {
    return {
        type: c.SET_PLAYLIST,
        payload: playlist,
    }
}

export function fillQueueList() {

}

export function initQueueList({ user, queue, item }) {
    return (dispatch, getState) => {
        const username = user && user || selectors.currentUser(getState()).username
        if (!initQueueList) {return}
        return Promise.all([
            // LAST ITEMS
            fetchLastItems({ username: username })
            // set context
            .then((items) => (items.map((i) => ({
                ...i,
                context: { title: 'Last Items' },
            })))),
            // SHOWS
            fetchUserShows({ username: username })
            .then((shows) => (
                shows.map((show) => (
                    // set context
                    show.items.map((i) => ({
                        ...i,
                        context: {
                            ...show,
                            items: null,
                        },
                    }))
                ))
            ))
            // flatten items
            .then((showsItems) => ([].concat.apply([], showsItems))),
        ])
        // flatten
        .then((results) => ([].concat.apply([], results)))
        // add to playlist
        .then((items) => (dispatch(setPlaylist(items))))
        // set the current item
        .then(() => dispatch(next()))
        // start the player
        .then(() => dispatch(play()))
    }
}

export function playItem(item) {
    return {
        type: c.SET_CURRENT,
        payload: item,
    }
}

export function play() {
    return (dispatch, getState) => {
        dispatch({ type: c.PLAY })
        const show = selectors.currentShow(getState())
        const item = selectors.currentTrack(getState())
        let url = ''
        if (show) {
            url += `/show/${show.id}`
        } if (item) {
            url += `/item/${item.id}`
        }
        dispatch(push(url))
        // if (selectors.getPlaylistGroupedByContext(getState()).length < 3) {
        //     dispatch(fillQueueList())
        // }
    }
}

export function togglePlay() {
    return (dispatch, getState) => {
        if (getState().player.playing) {
            dispatch(pause())
        } else {
            dispatch(play())
        }
    }
}

export function previousContext() {
    return { type: c.PREVIOUS_CONTEXT }
}

export function nextContext() {
    return { type: c.NEXT_CONTEXT }
}

export function next() {
    return { type: c.NEXT }
}

export function previous() {
    return { type: c.PREVIOUS }
}

export function mute() {
    return { type: c.MUTE }
}

export function unmute() {
    return { type: c.UNMUTE }
}

export function pause() {
    return { type: c.PAUSE }
}
