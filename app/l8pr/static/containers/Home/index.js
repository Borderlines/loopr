import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Screen } from '../../components'
import { Strip } from '../index'
import { fetchLoop } from '../../actions/browser'
import { setPlaylist, play, next } from '../../actions/player'
import * as selectors from '../../selectors'
import './style.scss'

class HomeView extends React.Component {

    componentWillMount() {
        this.props.fetchLoop(this.props.location)
        .then((loop) => this.props.setPlaylist(loop))
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
                        onEnded={this.props.nextItem}
                        onError={this.props.nextItem}/>
                }
                <Strip/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        media: selectors.getCurrentTrack(state),
        location: selectors.getLocation(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    nextItem: () => (dispatch(next())),
    fetchLoop: () => (dispatch(fetchLoop())),
    setPlaylist: (loop) => (dispatch(setPlaylist(loop))),
    play: (args) => (dispatch(play(args))),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)
export { HomeView as HomeViewNotConnected }
