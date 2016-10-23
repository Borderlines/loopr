import * as playerActions from '../actions';

export default function player(state={
    shows: [],
    show: null,
    mute: false,
    item: null,
    playing: false
}, action=null) {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case playerActions.SET_LOOP:
            return Object.assign({}, state, {shows: action.shows});
        case playerActions.PLAY_ITEM:
            return Object.assign({}, state, {show: action.showIndex, item: action.itemIndex, playing: true});
        case playerActions.PAUSE:
            return Object.assign({}, state, {playing: false});
        case playerActions.PLAY:
            return Object.assign({}, state, {playing: true});
        case playerActions.MUTE:
            return Object.assign({}, state, {mute: true});
        case playerActions.UNMUTE:
            return Object.assign({}, state, {mute: false});
        default:
            return state;
    }
}
