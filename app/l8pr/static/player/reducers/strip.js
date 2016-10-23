import * as actions from '../actions';

export default function strip(state={
    open: false,
}, action=null) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case actions.OPEN_STRIP:
            return Object.assign({}, state, {open: true});
        case actions.CLOSE_STRIP:
        return Object.assign({}, state, {open: false});
        case actions.SET_UPPER_STRIP:
        return Object.assign({}, state, {upperStrip: action.messages});
        default:
            return state;
    }
}
