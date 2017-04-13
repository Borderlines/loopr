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
        nextItem: React.PropTypes.func,
        play: React.PropTypes.func,
        pause: React.PropTypes.func,
        volume: React.PropTypes.number,
    }

    render() {
        return (
            <div className="Home">
                <ModalsContainer/>
                {this.props.media &&
                    <Screen
                        url={this.props.media.url}
                        soundcloudConfig={{ clientId: SOUNDCLOUD_API }}
                        playing={this.props.playing}
                        volume={this.props.volume}
                        onEnded={this.props.nextItem}
                        onPlay={this.props.play}
                        onPause={this.props.pause}
                        onError={this.props.nextItem}/>
                }
                <Strip/>
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
    nextItem: () => (dispatch(next())),
    play: (args) => (dispatch(play(args))),
    pause: (args) => (dispatch(pause(args))),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)
export { HomeView as HomeViewNotConnected }
