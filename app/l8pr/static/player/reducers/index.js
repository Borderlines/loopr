import { combineReducers } from 'redux';
import player from './player';
import strip from './strip';
import {router} from 'redux-ui-router';

const rootReducer = combineReducers({
    strip,
    player,
    router
});

export default rootReducer;
