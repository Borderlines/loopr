import * as c from '../constants'
import { get, reject } from 'lodash'


const rejectNull = (source) => reject(source, (i) => i === null)

export default function (state = {
    current: null,
    playQueue: [],
    history: [],
    collections: {
        natural: [],
        suggestions: [],
    },
    muted: false,
    playing: false,
}, action = null) {
    switch (action.type) {
        case c.SET_CURRENT:
            return {
                ...state,
                current: action.payload,
                history: [state.current, ...state.history],
                // remove what was before the item
                playQueue: state.playQueue.slice(state.playQueue.indexOf(action.payload) + 1),
            }
        case c.NEXT:
            var playQueue = [...state.playQueue]
            var next = playQueue.shift()
            return {
                ...state,
                current: next,
                playQueue,
                history: rejectNull([state.current, ...state.history]),
            }
        case c.PREVIOUS:
            var history = [...state.history]
            var previous = history.shift()
            return {
                ...state,
                current: previous,
                playQueue: rejectNull([state.current, ...state.playQueue]),
                history,
            }
        case c.NEXT_CONTEXT:
            var nextIndex = state.playQueue.findIndex(
                (i) => (get(i, 'context.id') !== get(state.current, 'context.id'))
            )
            return {
                ...state,
                current: state.playQueue[nextIndex],
                playQueue: state.playQueue.slice(nextIndex + 1),
                history: rejectNull([...state.playQueue.slice(0, nextIndex).reverse(), state.current, ...state.history]),
            }
        case c.PREVIOUS_CONTEXT:
            var previousIndex = state.history.findIndex(
                (i) => (get(i, 'context.id') !== get(state.current, 'context.id'))
            )
            return {
                ...state,
                current: state.history[previousIndex],
                history: state.history.slice(previousIndex + 1),
                playQueue: rejectNull([...state.history.slice(0, previousIndex).reverse(), state.current, ...state.playQueue]),
            }
        case c.SET_PLAYLIST:
            return {
                ...state,
                playQueue: action.payload,
            }
        case c.APPEND_TO_PLAYLIST:
            return {
                ...state,
                playQueue: [...state.playQueue, ...action.payload],
            }
        case c.INSERT_TO_PLAYLIST:
            return {
                ...state,
                playQueue: [...action.payload, ...state.playQueue],
            }
        case c.PLAY:
            return {
                ...state,
                playing: true,
            }
        case c.PAUSE:
            return {
                ...state,
                playing: false,
            }
        case c.MUTE:
            return {
                ...state,
                muted: true,
            }
        case c.UNMUTE:
            return {
                ...state,
                muted: false,
            }
        default:
            return state
    }
}
