import React from 'react'
import ReactPlayer from 'react-player'
import './style.scss'

export default class Screen extends React.Component {

    seekTo(value) {
        this.refs.reactPlayer.seekTo(value)
    }

    render() {
        return (
            <ReactPlayer
                className="Screen"
                ref="reactPlayer"
                {...this.props}
                width="100%"
                height="100%"/>
        )
    }
}
