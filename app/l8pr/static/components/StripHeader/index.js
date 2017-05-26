import React from 'react'
import './style.scss'
import { goBack } from '../../actions/browser'
import { connect } from 'react-redux'

function StripHeader({ children, title, back, handleBack }) {
    return (
        <div onClick={handleBack} className="StripHeader">
            {back &&
                    <i className="material-icons">arrow_back</i>
            }
            <div className="StripHeader__title">{title}</div>
            {children}
            {back && <div>back</div>}
        </div>
    )
}

StripHeader.propTypes = {
    title: React.PropTypes.string,
    back: React.PropTypes.bool,
    handleBack: React.PropTypes.func,
    children: React.PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.string,
    ]),
}

const mapDispatchToProps = (dispatch) => ({
    handleBack: () => (dispatch(goBack())),
})

export default connect(null, mapDispatchToProps)(StripHeader)
