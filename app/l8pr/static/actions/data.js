import * as api from '../utils/api'

export const addShows = (shows) => ({
    type: 'ADD_SHOWS',
    payload:shows,
})

export const feed = () => {
    const show = {
        id: 'feed',
        title: 'feed',
    }
    return (dispatch, getState) => (
        api.feed(getState())
        .then((items) => {
            return items.map((i) => (
                {
                    ...i,
                    context: show,
                }
            ))
        })
    )
}

export const lastItemsInLoopr = () => {
    return (dispatch, getState) => (
        api.lastItemsInLoopr(getState())
        // set a context
        .then((items) => {
            const show = {
                title: 'Last items in loopr',
                id: 'last_items_in_loopr',
            }
            dispatch(addShows([{
                ...show,
                items: items,
            }]))
            return items.map((i) => (
                {
                    ...i,
                    context: show,
                }
            ))
        })
    )
}

export const shows = ({ username }) => (
    (dispatch, getState) => (
        api.fetchUserShows(getState(), { username })
        .then((shows) => {
            dispatch(addShows(shows))
            return shows
        })
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
        .then((showsItems) => ([].concat.apply([], showsItems)))
    )
)

export const lastUserItems = ({ username }) => {
    const show = {
        title: 'Last Items',
        id: 'last_item',
    }
    return (dispatch, getState) => (
        api.lastUserItems(getState(), { username })
        .then((items) => {
            dispatch(addShows([{
                ...show,
                items: items,
            }]))
            // set context
            return items.map((i) => ({
                ...i,
                context: show,
            }))
        })
    )
}
