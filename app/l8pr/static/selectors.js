import { createSelector } from 'reselect'
import { get, zipObject } from 'lodash'

export const currentTrack = (state) => state.player.current
export const history = (state) => state.player.history
export const currentShow = (state) => get(state, 'player.current.context')
export const playQueue = (state) => state.player.playQueue
export const getPathname = (state) => state.routing.locationBeforeTransitions.pathname
export const currentUser = (state) => get(state.auth, 'user')
export const currentUserId = createSelector(currentUser, (user) => get(user, 'id'))
export const getSearchTerms = (state) => state.search.terms
export const getSearchResults = (state) => state.search.results
export const myShows = (state) => state.auth.loop
export const playlist = createSelector(
    [currentTrack, playQueue],
    (currentTrack, playQueue) => ([currentTrack, ...playQueue].filter(i => i !== null))
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
    const contexts = [{
        context: items[0].context,
        items: [],
    }]
    const getLastContext = () => contexts[contexts.length - 1]
    items.forEach((i) => {
        if (i.context && i.context.id !== get(getLastContext(), 'context.id')) {
            contexts.push({
                context: null,
                items: [],
            })
        }
        if (getLastContext().context === null) getLastContext().context = i.context
        getLastContext().items.push(i)
    })
    return contexts
}

export const getPlaylistGroupedByContext = createSelector(playlist, (p) => groupByContext(p))
export const getResultsGroupedByContext = createSelector(getSearchResults, (p) => groupByContext(p))
