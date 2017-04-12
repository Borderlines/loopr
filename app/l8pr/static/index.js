import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { HotKeys } from 'react-hotkeys'
import Root from './containers/Root/Root'
import configureStore from './store/configureStore'
import { authLoginUserSuccess } from './actions/auth'
import * as browser from './actions/browser'


const initialState = {}
const target = document.getElementById('root')

const store = configureStore(initialState, browserHistory)
const history = syncHistoryWithStore(browserHistory, store)

const handlers = {
    toggleStrip: () => store.dispatch(browser.toggleStrip()),
}
const map = {
    toggleStrip: 'c',
}
const node = (
    <HotKeys handlers={handlers} keyMap={map} focused={true} attach={window}>
        <Root store={store} history={history}/>
    </HotKeys>
)

const token = localStorage.getItem('token')
let user = {}
try {
    user = JSON.parse(localStorage.getItem('user'))
} catch (e) {
    // Failed to parse
}

if (token !== null) {
    store.dispatch(authLoginUserSuccess(token, user))
}

ReactDOM.render(node, target)
