import React from 'react'
import './style.scss'

export default class Progressbar extends React.Component {


    onClick = (e) => {
        this.props.onClick(e.nativeEvent.offsetX / this.refs.progressbar.clientWidth)
    }

    render() {
        const { progress, loaded } = this.props
        return (
            <div className="Progressbar" ref="progressbar" onClick={this.onClick}>
                <div className="Progressbar__loaded" style={{ width: `${loaded * 100}%` }}/>
                <div className="Progressbar__progress" style={{ width: `${progress * 100}%` }}/>
            </div>
        )
    }
}

Progressbar.propTypes = {
    progress: React.PropTypes.number,
    loaded: React.PropTypes.number,
    onClick: React.PropTypes.func,
}
