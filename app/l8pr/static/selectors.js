import { createSelector } from 'reselect'
import { get } from 'lodash'

export const currentTrack = (state) => state.player.currentTrack
export const currentShow = (state) => state.player.currentShow
export const playlist = (state) => state.player.playlist
export const getPathname = (state) => state.routing.locationBeforeTransitions.pathname
export const getCurrentShow = createSelector(
    [currentShow, playlist],
    (currentShowId, playlist) => {
        return playlist.find((s) => s.id === currentShowId)
    }
)

export const getCurrentTrack = createSelector(
  [getCurrentShow, currentTrack],
  (currentShow, currentTrackId) => {
      if (currentShow) {
          return currentShow.items.find((i) => i.id === currentTrackId)
      }
  }
)

export const getCurrentShowPositionInShow = createSelector(
  [currentShow, playlist],
  (currentShowId, playlist) => {
      return playlist.findIndex((s) => s.id === currentShowId)
  }
)

export const getCurrentTrackPositionInShow = createSelector(
  [getCurrentShow, currentTrack],
  (currentShow, currentTrackId) => {
      if (currentShow) {
          return currentShow.items.findIndex((i) => i.id === currentTrackId)
      }
  }
)

export const getLocation = createSelector(
    [getPathname],
    (pathname) => {
        const locationRegex = /show\/([0-9]+)\/item\/([0-9]+)/g
        const m = locationRegex.exec(pathname)
        return {
            show: get(m, '[1]'),
            item: get(m, '[2]'),
        }
    }
)
