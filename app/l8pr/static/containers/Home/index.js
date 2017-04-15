import React from 'react'
import { connect } from 'react-redux'
import { Screen } from '../../components'
import { Strip, ModalsContainer } from '../index'
import { play, pause, next } from '../../actions/player'
import { SOUNDCLOUD_API } from '../../utils/config'
import * as selectors from '../../selectors'
import './style.scss'

class HomeView extends React.Component {

    static propTypes = {
        media: React.PropTypes.object,
        playing: React.PropTypes.bool,
        onEnd: React.PropTypes.func,
        onPlay: React.PropTypes.func,
        onPause: React.PropTypes.func,
        volume: React.PropTypes.number,
    }

    constructor(props) {
        super(props)
        this.state = { progress: 0 }
    }

    onSeekTo = (value) => {
        this.refs.player.seekTo(value)
    }

    render() {
        return (
            <div className="Home">
                <ModalsContainer/>
                {this.props.media &&
                    <Screen
                        url={this.props.media.url}
                        soundcloudConfig={{ clientId: SOUNDCLOUD_API }}
                        ref="player"
                        playing={this.props.playing}
                        volume={this.props.volume}
                        onEnded={this.props.onEnd}
                        onPlay={this.props.onPlay}
                        onPause={this.props.onPause}
                        onProgress={(p)=>(this.setState({ progress: p.played }))}
                        onReady={()=>(this.setState({ progress: 0 }))}
                        onError={this.props.onEnd}/>
                }
                <Strip progress={this.state.progress} onSeekTo={this.onSeekTo}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    media: selectors.currentTrack(state),
    playing: state.player.playing,
    volume: state.player.muted ? 0 : 1,
})

const mapDispatchToProps = (dispatch) => ({
    onEnd: () => (dispatch(next())),
    onPlay: (args) => (dispatch(play(args))),
    onPause: (args) => (dispatch(pause(args))),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)
export { HomeView as HomeViewNotConnected }
