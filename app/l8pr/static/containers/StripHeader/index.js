import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../../selectors'
import { toggleStrip } from '../../actions/browser'
import { showModal } from '../../actions/modal'
import { get } from 'lodash'
import './style.scss'

function StripHeaderComponent({ stripOpened, toggleStrip, onLogin }) {
    return (
        <div className="StripHeader row">
            <div className="col-xs-10">
            </div>
            <div className="col-xs-2 text-right">
                <i className="material-icons" title="Toggle Navigation" onClick={toggleStrip}>
                    {!stripOpened && 'keyboard_arrow_up'}
                    {stripOpened && 'keyboard_arrow_down'}
                </i>
                <i className="material-icons" onClick={onLogin}>account_circle</i>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    stripOpened: state.browser.stripOpened,
})

const mapDispatchToProps = (dispatch) => ({
    toggleStrip: () => (dispatch(toggleStrip())),
    onLogin: () => (dispatch(showModal({ modalType: 'LOGIN' }))),
})
export default connect(mapStateToProps, mapDispatchToProps)(StripHeaderComponent)
