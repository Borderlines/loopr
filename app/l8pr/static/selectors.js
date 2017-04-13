import { createSelector } from 'reselect'
import { get, zipObject } from 'lodash'

export const currentTrack = (state) => state.player.current
export const currentShow = (state) => get(state, 'player.current.context')
export const playlist = (state) => state.player.playlist
export const getPathname = (state) => state.routing.locationBeforeTransitions.pathname
export const currentUser = (state) => get(state.auth, 'user')
export const currentUserId = createSelector(currentUser, (user) => get(user, 'id'))

export const getLocation = createSelector(
    [getPathname],
    (pathname) => {
        function getValueForKey(key) {
            const regex = `/${key}/([a-z0-9]+)`
            const re = RegExp(regex, 'gi')
            const m = re.exec(pathname)
            return get(m, '[1]')
        }
        const keys = ['user', 'item', 'show']
        const values = keys.map((key) => getValueForKey(key))
        return zipObject(keys, values)
    }
)
