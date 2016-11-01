import * as actions from '../actions';

export default function strip(state={
    loop: null,
    upperStrip: [],
    shows: [],
    view: 'loop',
    stripParams: {},
    searchBar: false,
    open: false,
}, action=null) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case actions.OPEN_SEARCH_BAR:
            return Object.assign({}, state, {searchBar: true});
        case actions.CLOSE_SEARCH_BAR:
            return Object.assign({}, state, {searchBar: false});
        case actions.STRIP_SET_LOOP:
            return Object.assign({}, state, {shows: action.shows});
        case actions.OPEN_STRIP:
            newState.open = true;
            if (action.view) {
                newState.view = action.view;
            }
            if (action.stripParams) {
                newState.stripParams = action.stripParams;
            }
            return newState;
        case actions.CLOSE_STRIP:
        return Object.assign({}, state, {open: false});
        case actions.SET_UPPER_STRIP:
        return Object.assign({}, state, {upperStrip: action.messages});
        default:
            return state;
    }
}
