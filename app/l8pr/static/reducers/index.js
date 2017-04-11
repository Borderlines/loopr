import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import authReducer from './auth'
import dataReducer from './data'
import playerReducer from './player'
import browserReducer from './browser'
import modalReducer from './modal'

export default combineReducers({
    auth: authReducer,
    data: dataReducer,
    routing: routerReducer,
    player: playerReducer,
    browser: browserReducer,
    modal: modalReducer,
})
