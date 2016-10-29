import {stateGo} from 'redux-ui-router';
import {showSelector, itemSelector} from '../selectors';

export const SET_LOOP = 'SET_LOOP';
export const SET_SHOWS = 'SET_SHOWS';
export const INSERT_SHOW = 'INSERT_SHOW';
export const PLAY_ITEM = 'PLAY_ITEM';
export const PAUSE = 'PAUSE';
export const PLAY = 'PLAY';
export const MUTE = 'MUTE';
export const UNMUTE = 'UNMUTE';
export const NEXT_ITEM = 'NEXT_ITEM';
export const PREVIOUS_ITEM = 'PREVIOUS_ITEM';
export const OPEN_STRIP = 'OPEN_STRIP';
export const CLOSE_STRIP = 'CLOSE_STRIP';
export const SET_UPPER_STRIP = 'SET_UPPER_STRIP';
export const STRIP_SET_LOOP = 'STRIP_SET_LOOP';
export const LOAD_AND_START_LOOP = 'LOAD_AND_START_LOOP';


function updateUrl(show, item) {
    return (dispatch, getState, { $location }) => {
        const loop = getState().player.loop
        const username = loop.username
        const current = getState().router.currentParams
        if (current.username === username && current.show === show.toString() && current.item === item.toString()) {
            console.log('no change')
            return;
        }
        let stateToGo = Object.assign({}, getState().router.currentParams, {show, item, username });
        let notify = false
        let stateName = 'root.app'
        dispatch(stateGo(stateName, stateToGo, { notify }));
    }
}

export const loadAndStartLoop = () => ((dispatch, getState, {Player}) => {
    dispatch({type: LOAD_AND_START_LOOP})
    let username = 'discover';
    Player.loadLoop(username).then((loop) => {
        dispatch(setLoop(loop))
        dispatch(playItem(0, 0))
    })
})

export function setLoop(loop) {
    return (dispatch, getState) => {
    //     let stateToGo = Object.assign({}, getState().router.currentParams, {show, item});
    //     dispatch(stateGo('root.app', stateToGo, {notify: false}));
        dispatch({ type: SET_LOOP, loop })
        dispatch(setShows(loop.shows_list));
    }
}

export const setShows = (shows)=> ({ type: SET_SHOWS, shows })

export function playShow(showObj) {
    return (dispatch, getState) => {
        dispatch({type: INSERT_SHOW, showObj});
        var showIndex = getState().player.shows.indexOf(showObj);
        dispatch(playItem(showIndex, 0));
    }
    return ;
}

export function setUpperStrip({itemIndex, showIndex}) {
    return (dispatch, getState) => {
        let item = getState().player.shows[showIndex].items[itemIndex];
        let show = getState().player.shows[showIndex];
        var messages = [];
        if (item) {
            messages.push(item.title);
        }
        if (show) {
            messages.push(['Show', '<b>'+show.title+'</b>', 'by', show.username].join(' '));
        }
        dispatch({type: SET_UPPER_STRIP, messages});
    }
}
export function playItem(showIndex, itemIndex) {
    return (dispatch) => {
        // update url
        dispatch(updateUrl(showIndex, itemIndex));
        // update state
        dispatch({type: PLAY_ITEM, showIndex: showIndex, itemIndex: itemIndex});
        // update banner
        dispatch(setUpperStrip({showIndex, itemIndex}));
    }
}

export function pause() {return {type: PAUSE};}

export function play() {return {type: PLAY};}

export const togglePlay = () => ((dispatch, getState) => {
    getState().player.playing ? dispatch(pause()) : dispatch(play())
})

export function mute() {return {type: MUTE};}

export function unmute() {return {type: UNMUTE};}

export const toggleMute = () => ((dispatch, getState) => {
    getState().player.mute ? dispatch(unmute()) : dispatch(mute())
})

export function nextItem() {
    return (dispatch, getState) => {
        const state = getState().player;
        var nextShow = state.show;
        var nextItem = state.item + 1;
        // if it's at the end of the show
        if (state.shows[nextShow].items.length <= nextItem) {
            nextItem = 0;
            nextShow = (nextShow + 1) % state.shows.length;
        }
        dispatch({type: NEXT_ITEM});
        return dispatch(playItem(nextShow, nextItem));
    }
}

export function previousItem() {
    return (dispatch, getState) => {
        const state = getState().player;
        var nextShow = state.show;
        var nextItem = state.item;
        if (state.item <= 0) {
            if (state.show <= 0) {
                let lastShow = state.shows.length - 1;
                nextShow = lastShow;
            } else {
                nextShow -= 1;
            }
            let lastItem = state.shows[nextShow].items.length - 1;
            nextItem = lastItem;
        } else {
            nextItem -= 1;
        }
        dispatch({type: PREVIOUS_ITEM});
        dispatch(playItem(nextShow, nextItem));
    }
}

// strip
// export const openStrip = () => ({type: OPEN_STRIP})
export const openStrip = (view, stripParams) => ({
    type: OPEN_STRIP,
    view,
    stripParams
})
export const closeStrip = () => ({
    type: CLOSE_STRIP
})
export const toogleStrip = () => ((dispatch, getState) => {
    getState().strip.open ? dispatch(closeStrip()) : dispatch(openStrip())
})
export const setStripLoop = (shows) => ({type: STRIP_SET_LOOP, shows})
