import React from 'react'
import './style.scss'

export default class Progressbar extends React.Component {


    onClick = (e) => {
        this.props.onClick(e.nativeEvent.offsetX / this.refs.progressbar.clientWidth)
    }

    render() {
        const { value, loaded } = this.props
        return (
            <div className="Progressbar row" ref="progressbar" onClick={this.onClick}>
                <div className="Progressbar__loaded" style={{ width: `${loaded * 100}%` }}/>
                <div className="Progressbar__progress" style={{ width: `${value * 100}%` }}/>
            </div>
        )
    }
}

Progressbar.propTypes = {
    value: React.PropTypes.number,
    loaded: React.PropTypes.number,
    onClick: React.PropTypes.func,
}
