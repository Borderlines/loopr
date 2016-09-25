import * as playerActions from '../actions/player';

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
        case playerActions.PLAY_SHOW:
            return Object.assign({}, state, {show: action.showIndex, playing: true});
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
        case playerActions.NEXT_ITEM:
            // if current show is over
            if (state.shows[state.show].items.length > (state.item + 1)) {
                newState.item += 1;
            } else {
                newState.item = 0;
                newState.show = (state.show + 1) % state.shows.length;
            }
            return newState;
        case playerActions.PREVIOUS_ITEM:
            if (state.item <= 0) {
                if (state.show <= 0) {
                    let lastShow = state.shows.length - 1;
                    newState.show = lastShow;
                } else {
                    newState.show -= 1;
                }
                let lastItem = state.shows[newState.show].items.length - 1;
                newState.item = lastItem;
            } else {
                newState.item -= 1;
            }
            return newState;
        default:
            return state;
    }
}
