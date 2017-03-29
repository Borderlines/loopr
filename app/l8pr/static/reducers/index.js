import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authReducer from './auth';
import dataReducer from './data';
import playerReducer from './player';
import browserReducer from './browser';

export default combineReducers({
    auth: authReducer,
    data: dataReducer,
    routing: routerReducer,
    player: playerReducer,
    browser: browserReducer,
});
