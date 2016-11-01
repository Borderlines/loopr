import { combineReducers } from 'redux';
import player from './player';
import strip from './strip';
import auth from './auth';
import {router} from 'redux-ui-router';

const rootReducer = combineReducers({
    strip,
    player,
    auth,
    router
});

export default rootReducer;
