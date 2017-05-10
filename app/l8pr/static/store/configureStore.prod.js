import thunk from 'redux-thunk'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import persistState from 'redux-localstorage'

import rootReducer from '../reducers'

export default function configureStore(initialState, history) {
    // Add so dispatched route actions to the history
    const reduxRouterMiddleware = routerMiddleware(history)

    const middleware = applyMiddleware(thunk, reduxRouterMiddleware)

    const createStoreWithMiddleware = compose(
        middleware,
        persistState([
            'auth',
        ]),
    )

    return createStoreWithMiddleware(createStore)(rootReducer, initialState)
}
