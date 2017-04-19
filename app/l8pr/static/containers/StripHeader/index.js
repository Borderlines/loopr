import React from 'react'
import { connect } from 'react-redux'
import { browse } from '../../actions/browser'
import { showModal } from '../../actions/modal'
import './style.scss'

function StripHeaderComponent({ onLogin, onSearch, browserType }) {
    return (
        <div className="StripHeader row">
            <div className="col-xs-10">
                {browserType === 'SEARCH' && 'Search'}
                {browserType === 'PLAYQUEUE' && 'Play queue'}
            </div>
            <div className="col-xs-2 text-right">
                <i className="material-icons" onClick={onSearch}>search</i>
                <i className="material-icons" onClick={onLogin}>account_circle</i>
            </div>
        </div>
    )
}

StripHeaderComponent.propTypes = {
    onSearch: React.PropTypes.func.isRequired,
    browserType: React.PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({ browserType: state.browser.browserType })

const mapDispatchToProps = (dispatch) => ({
    onSearch: () => (dispatch(browse('SEARCH'))),
    onLogin: () => (dispatch(showModal({ modalType: 'LOGIN' }))),
})

export default connect(mapStateToProps, mapDispatchToProps)(StripHeaderComponent)
