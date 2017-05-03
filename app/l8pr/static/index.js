import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { HotKeys } from 'react-hotkeys'
import Root from './containers/Root/Root'
import configureStore from './store/configureStore'
import { checkToken } from './actions/auth'
import * as browser from './actions/browser'
import * as player from './actions/player'
import screenfull from 'screenfull'

const initialState = {}
const target = document.getElementById('root')

const store = configureStore(initialState, browserHistory)
const history = syncHistoryWithStore(browserHistory, store)

const map = {
    toggleStrip: 'c',
    playPause: 'space',
    toggleMute: 'm',
    fullscreen: 'f',
    search: 'ctrl+shift+f',
}
const handlers = {
    toggleStrip: () => store.dispatch(browser.toggleStrip()),
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

const token = localStorage.getItem('token')
// login from localstorage
store.dispatch(checkToken(token))
.then(() => (
    // init playqueue from url
    store.dispatch(player.initQueueList())
), () => store.dispatch(player.initQueueList()))



ReactDOM.render(node, target)
