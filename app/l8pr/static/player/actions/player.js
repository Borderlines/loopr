export const SET_LOOP = 'SET_LOOP';
export const PLAY_SHOW = 'PLAY_SHOW';
export const PLAY_ITEM = 'PLAY_ITEM';
export const PAUSE = 'PAUSE';
export const PLAY = 'PLAY';
export const MUTE = 'MUTE';
export const UNMUTE = 'UNMUTE';
export const NEXT_ITEM = 'NEXT_ITEM';
export const PREVIOUS_ITEM = 'PREVIOUS_ITEM';

export function setLoop(shows) {return {type: SET_LOOP, shows};}
export function playShow(showIndex) {return {type: PLAY_SHOW, showIndex};}
export function playItem(showIndex, itemIndex) {return {type: PLAY_ITEM, showIndex, itemIndex};}
export function pause() {return {type: PAUSE};}
export function play() {return {type: PLAY};}
export function mute() {return {type: MUTE};}
export function unmute() {return {type: UNMUTE};}
export function nextItem() {return {type: NEXT_ITEM};}
export function previousItem() {return {type: PREVIOUS_ITEM};}

// export function incrementIfOdd() {
//     return (dispatch, getState) => {
//         const { counter } = getState();
//
//         if (counter % 2 === 0) {
//             return;
//         }
//
//         dispatch(increment());
//     };
// }
