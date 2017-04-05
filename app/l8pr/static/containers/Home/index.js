import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Screen } from '../../components'
import { Strip } from '../index'
import { fetchLastItems } from '../../actions/data'
import { setPlaylist, play, pause, next } from '../../actions/player'
import * as selectors from '../../selectors'
import './style.scss'

class HomeView extends React.Component {

    componentWillMount() {
        this.props.fetchLastItems({ user: 1 })
        .then((items) => this.props.setPlaylist(items))
        .then(() => this.props.play(this.props.location))
    }

    static propTypes = {
        media: React.PropTypes.object
    }

    render() {
        return (
            <div className="Home">
                {this.props.media &&
                    <Screen
                        url={this.props.media.url}
                        playing={this.props.playing}
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
        media: selectors.getCurrentTrack(state),
        location: selectors.getLocation(state),
        playing: state.player.playing,
})

const mapDispatchToProps = (dispatch) => ({
    nextItem: () => (dispatch(next())),
    fetchLastItems: (d) => (dispatch(fetchLastItems(d))),
    setPlaylist: (loop) => (dispatch(setPlaylist(loop))),
    play: (args) => (dispatch(play(args))),
    pause: (args) => (dispatch(pause(args))),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)
export { HomeView as HomeViewNotConnected }
