import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { HotKeys } from 'react-hotkeys'
import Root from './components/Root/Root'
import configureStore from './store/configureStore'
import { checkToken } from './actions/auth'
import * as browser from './actions/browser'
import * as player from './actions/player'
import screenfull from 'screenfull'
import * as selectors from './selectors'

const initialState = {}
const target = document.getElementById('root')

const store = configureStore(initialState, browserHistory)
const history = syncHistoryWithStore(browserHistory, store)

const map = {
    previousShow: 'c',
    previousTrack: 'v',
    toggleStrip: 'b',
    nextTrack: 'n',
    nextShow: 'm',
    playPause: 'space',
    toggleMute: 's',
    fullscreen: 'f',
    search: 'ctrl+shift+f',
}
const handlers = {
    previousShow: () => store.dispatch(player.previousContext()),
    previousTrack: () => store.dispatch(player.previous()),
    toggleStrip: () => store.dispatch(browser.toggleStrip()),
    nextTrack: () => store.dispatch(player.next()),
    nextShow: () => store.dispatch(player.nextContext()),
    toggleMute: () => store.dispatch(player.toggleMute()),
    playPause: () => store.dispatch(player.togglePlay()),
    search: () => store.dispatch(browser.browse('SEARCH')),
    fullscreen: () => screenfull.toggle(),
}
const node = (
    <HotKeys handlers={handlers} keyMap={map} focused={true} attach={window}>
        <Root store={store} history={history}/>
    </HotKeys>
)

const token = store.getState().auth.token
// login from localstorage
store.dispatch(checkToken(token))
    .catch((e) => e)
    .then(() => {
        const location = selectors.getLocation(store.getState())
        const username = location.user || selectors.currentUsername(store.getState()) || 'discover'
        store.dispatch(player.initQueueList({
            username,
            item: location.item,
        }))
    })



ReactDOM.render(node, target)
