import React from 'react'
import ReactPlayer from 'react-player'
import './style.scss'

export default class Screen extends React.Component {

    render() {
        return (
            <ReactPlayer
                className="Screen"
                {...this.props}
                width="100%"
                height="100%"/>
        )
    }
}
