import React from 'react'
import './style.scss'

export default function StripHeader({ children }) {
    return (
        <div className="StripHeader">
            {children}
        </div>
    )
}

StripHeader.propTypes = {
    children: React.PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.string,
    ]),
}
