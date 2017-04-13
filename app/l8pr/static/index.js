import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { HotKeys } from 'react-hotkeys'
import Root from './containers/Root/Root'
import configureStore from './store/configureStore'
import { authLoginUserSuccess } from './actions/auth'
import * as browser from './actions/browser'
import * as player from './actions/player'
import * as selectors from './selectors'

const initialState = {}
const target = document.getElementById('root')

const store = configureStore(initialState, browserHistory)
const history = syncHistoryWithStore(browserHistory, store)

const map = {
    toggleStrip: 'c',
    playPause: 'space',
}
const handlers = {
    toggleStrip: () => store.dispatch(browser.toggleStrip()),
    playPause: () => store.dispatch(player.togglePlay()),
}
const node = (
    <HotKeys handlers={handlers} keyMap={map} focused={true} attach={window}>
        <Root store={store} history={history}/>
    </HotKeys>
)

const token = localStorage.getItem('token')
let currentUser = {}
try {
    currentUser = JSON.parse(localStorage.getItem('user'))
} catch (e) {
    // Failed to parse
}

// login from localstorage
if (token !== null) {
    store.dispatch(authLoginUserSuccess(token, currentUser))
}

// init playqueue from url
store.dispatch(player.initQueueList())


ReactDOM.render(node, target)
