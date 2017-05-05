import React from 'react'
import { connect } from 'react-redux'
import { Screen } from '../../components'
import { Strip, ModalsContainer } from '../index'
import { play, pause, next } from '../../actions/player'
import { SOUNDCLOUD_API } from '../../utils/config'
import * as selectors from '../../selectors'
import _IdleMonitor from 'react-simple-idle-monitor'
import './style.scss'

const IdleMonitor = connect()(_IdleMonitor)

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
        this.state = {
            progress: 0,
            loaded: 0,
        }
    }

    onSeekTo = (value) => {
        this.refs.player.seekTo(value)
    }

    render() {
        const {
            media,
            playing,
            volume,
            onEnd,
            onPlay,
            onPause,
        } = this.props
        return (
            <IdleMonitor
                reduxActionPrefix="IdleMonitor"
                timeout={5000}>
                <div className="Home">
                    <ModalsContainer/>
                    {this.props.media &&
                        <Screen
                            url={media.url}
                            SCIllu={media.provider_name === 'SoundCloud' && media.thumbnail}
                            soundcloudConfig={{ clientId: SOUNDCLOUD_API }}
                            ref="player"
                            playing={playing}
                            volume={volume}
                            onEnded={onEnd}
                            onError={onEnd}
                            onPlay={onPlay}
                            onPause={onPause}
                            onProgress={(p)=>(this.setState({
                                progress: p.played,
                                loaded: p.loaded,
                            }))}
                            onReady={()=>(this.setState({
                                progress: 0,
                                loaded: 0,
                            }))}/>
                    }
                    <Strip
                        progress={this.state.progress}
                        loaded={this.state.loaded}
                        onSeekTo={this.onSeekTo}/>
                </div>
            </IdleMonitor>
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
