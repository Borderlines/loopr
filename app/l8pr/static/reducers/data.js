import { createReducer } from '../utils'

const initialState = { shows: {} }

export default createReducer(initialState, {
    'ADD_SHOWS': (state, payload) => {
        const shows = { ...state.shows }
        payload.forEach((s) => {
            shows[s.id] = s
        })
        return {
            ...state,
            shows,
        }
    },
})
