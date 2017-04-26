import React from 'react'
import { connect } from 'react-redux'
import { browse } from '../../actions/browser'
import { showModal } from '../../actions/modal'
import './style.scss'

function StripHeaderComponent({ onLogin, onSearch, browserType, children }) {
    return (
        <div className="StripHeader row">
            <div className="col-xs-9">
                {children}
            </div>
            <div className="col-xs-3 text-right">
                { browserType === 'SEARCH' &&
                    <i className="material-icons" onClick={onSearch}>close</i>
                }
                { browserType !== 'SEARCH' &&
                    <i className="material-icons" onClick={onSearch}>search</i>
                }
                <i className="material-icons" onClick={onLogin}>account_circle</i>
            </div>
        </div>
    )
}

StripHeaderComponent.propTypes = {
    onSearch: React.PropTypes.func.isRequired,
    onLogin: React.PropTypes.func.isRequired,
    browserType: React.PropTypes.string.isRequired,
    children: React.PropTypes.element,
}

const mapStateToProps = (state) => ({ browserType: state.browser.browserType })

const mapDispatchToProps = (dispatch) => ({
    onSearch: () => (dispatch(browse('SEARCH'))),
    onLogin: () => (dispatch(showModal('LOGIN'))),
})

export default connect(mapStateToProps, mapDispatchToProps)(StripHeaderComponent)
