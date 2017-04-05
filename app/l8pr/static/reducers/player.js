import * as c from '../constants'
import { get } from 'lodash'

export default function (state = {
    playlist: [],
    currentTrack: 0,
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
            return {
                ...state,
                playing: true,
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
