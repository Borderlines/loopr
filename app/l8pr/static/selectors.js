import { createSelector } from 'reselect'
import { get } from 'lodash'

export const currentTrack = (state) => state.player.current
export const currentShow = (state) => get(state, 'player.current.context')
export const playlist = (state) => state.player.playlist
export const getPathname = (state) => state.routing.locationBeforeTransitions.pathname

export const getLocation = createSelector(
    [getPathname],
    (pathname) => {
        const locationRegex = /show\/([0-9]+)\/item\/([0-9]+)/g
        const m = locationRegex.exec(pathname)
        return {
            show: get(m, '[1]'),
            item: get(m, '[2]'),
        }
    }
)
