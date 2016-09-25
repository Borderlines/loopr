import { combineReducers } from 'redux';
import player from './player';
import {router} from 'redux-ui-router';

const rootReducer = combineReducers({
    player,
    router
});

export default rootReducer;
