import { createSelector } from 'reselect'
import { get, zipObject, isNil } from 'lodash'
import { getDuration } from './utils'

export const currentTrack = (state) => state.player.current
export const history = (state) => state.player.history
export const currentShow = (state) => get(state, 'player.current.context')
export const playQueue = (state) => state.player.playQueue
export const getPathname = (state) => state.routing.locationBeforeTransitions.pathname
export const currentUser = (state) => get(state.auth, 'user')
export const currentUserId = createSelector(currentUser, (user) => get(user, 'id'))
export const currentUsername = createSelector(currentUser, (user) => get(user, 'username'))
export const getSearchTerms = (state) => state.search.terms
export const getSearchResults = (state) => state.search.results
export const myShows = (state) => state.auth.loop
export const playlist = createSelector(
    [currentTrack, playQueue],
    (currentTrack, playQueue) => ([currentTrack, ...playQueue].filter(i => (!isNil(i))))
)

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

function groupByContext(items) {
    if (items.length < 1) {
        return []
    }
    const itemsList = []
    let lastContext = null
    items.forEach(item => {
        if (!itemsList.find(i => i.id === item.context.id)) {
            if (lastContext) {
                let lastIndex = itemsList.lastIndexOf(lastContext)
                lastContext.duration = getDuration(itemsList.slice(lastIndex))
            }
            lastContext = {
                ...item.context,
                type: 'context',
                size: 0,
            }
            itemsList.push(lastContext)
        }
        lastContext.size += 1
        itemsList.push(item)
    })
    return itemsList
}

export const getPlaylistGroupedByContext = createSelector(playlist, (p) => groupByContext(p))
