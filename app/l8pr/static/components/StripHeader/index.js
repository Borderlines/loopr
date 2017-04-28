import React from 'react'
import './style.scss'

export default function StripHeader({ children, title }) {
    return (
        <div className="StripHeader">
            <div className="StripHeader__title">{title}</div>
            {children}
        </div>
    )
}

StripHeader.propTypes = {
    title: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.string,
    ]),
}
