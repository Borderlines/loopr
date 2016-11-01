import * as actions from '../actions';

const initialState = {
    user: null,
}

export default function login(state=initialState, action=null) {
    switch (action.type) {
        case actions.LOGGED_IN:
            return Object.assign({}, state, {user: action.user});
        case actions.LOGGED_OUT:
            return initialState;
        default:
            return state;
    }
}
