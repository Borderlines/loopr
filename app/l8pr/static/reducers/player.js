import * as c from '../constants'
import { get } from 'lodash'

export default function (state = {
    playlist: [],
    currentTrack: undefined,
    currentShow: undefined,
    muted: false,
    playing: false
}, action = null) {
    switch (action.type) {
        case c.SET_PLAYLIST:
            return {
                ...state,
                playlist: action.payload,
            }
        case c.PLAY:
            var showId = get(action, 'payload.show') || state.currentShow || state.playlist[0].id
            var itemId = get(action, 'payload.item') || state.currentTrack || state.playlist[0].items[0].id
            return {
                ...state,
                playing: true,
                currentShow: parseInt(showId),
                currentTrack: parseInt(itemId),
            }
        case c.PAUSE:
            return { ...state, playing: false }
        case c.MUTE:
            return { ...state, muted: true }
        case c.UNMUTE:
            return { ...state, muted: false }
        default:
            return state
    }
}
