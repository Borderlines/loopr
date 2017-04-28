import React from 'react'
import ReactPlayer from 'react-player'
import './style.scss'

export default class Screen extends React.Component {

    seekTo(value) {
        this.refs.reactPlayer.seekTo(value)
    }

    render() {
        const { SCIllu, ...props } = this.props
        return (
            <div>
                <ReactPlayer
                    className="Screen"
                    ref="reactPlayer"
                    {...props}
                    width="100%"
                    height="100%"/>
                {SCIllu &&
                    <div className="Screen__SCIllu" style={{ backgroundImage: `url(${SCIllu})` }}/>
                }
            </div>
        )
    }
}
