import { createSelector } from 'reselect';

export const itemIndexSelector = state => state.item;
export const showsSelector = state => state.shows;
export const showIndexSelector = state => state.show;
export const showSelector = createSelector(
    showsSelector,
    showIndexSelector,
    (shows, showIndex) => shows[showIndex]
);
export const itemSelector = createSelector(
    itemIndexSelector,
    showSelector,
    (itemIndex, show) => show && show.items[itemIndex]
);
