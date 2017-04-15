import React from 'react'
import { connect } from 'react-redux'
import * as player from '../../actions/player'
import * as selectors from '../../selectors'
import { get } from 'lodash'
import './style.scss'

function NavPlayer({
    onPreviousContext,
    onPreviousItem,
    onPlay,
    onPause,
    onNextItem,
    onNextContext,
    onMute,
    onUnmute,
    muted,
    playing,
    currentItem,
    currentShow,
}) {
    return (
        <div className="NavPlayer row">
            <div className="col-xs-8">
                <div className="NavPlayer__item">{get(currentItem, 'title')}</div>
                <div className="NavPlayer__show">{get(currentShow, 'title')}</div>
            </div>
            <div className="NavPlayer__controllers col-xs-4 text-right">
                <a onClick={onPreviousContext} title="Previous Show">
                    <i className="material-icons">first_page</i>
                </a>
                <a onClick={onPreviousItem} title="Previous Item">
                    <i className="material-icons">chevron_left</i>
                </a>
                {playing &&
                    <a onClick={onPause} title="Play/Pause">
                        <i className="material-icons">pause</i>
                    </a>
                ||
                    <a onClick={onPlay} title="Play/Pause">
                        <i className="material-icons">play_arrow</i>
                    </a>
                }
                <a onClick={onNextItem} title="Next Item">
                    <i className="material-icons">chevron_right</i>
                </a>
                <a onClick={onNextContext} title="Next Show">
                    <i className="material-icons">last_page</i>
                </a>
                {muted &&
                    <a onClick={onUnmute} title="Mute on/off">
                        <i className="material-icons">volume_mute</i>
                    </a>
                ||
                    <a onClick={onMute} title="Mute on/off">
                        <i className="material-icons">volume_up</i>
                    </a>
                }
            </div>
        </div>
    )
}

NavPlayer.propTypes = {
    onPreviousContext: React.PropTypes.func,
    onPreviousItem: React.PropTypes.func,
    onPlay: React.PropTypes.func,
    onPause: React.PropTypes.func,
    onNextItem: React.PropTypes.func,
    onNextContext: React.PropTypes.func,
    onMute: React.PropTypes.func,
    onUnmute: React.PropTypes.func,
    playing: React.PropTypes.bool,
    muted: React.PropTypes.bool,
    currentItem: React.PropTypes.string,
    currentShow: React.PropTypes.string,
}

const mapStateToProps = (state) => ({
    playing: state.player.playing,
    muted: state.player.muted,
    currentItem: selectors.currentTrack(state),
    currentShow: selectors.currentShow(state),
})

const mapDispatchToProps = (dispatch) => ({
    onPlay: () => (dispatch(player.play())),
    onPause: () => (dispatch(player.pause())),
    onNextItem: () => (dispatch(player.next())),
    onNextContext: () => (dispatch(player.nextContext())),
    onPreviousItem: () => (dispatch(player.previous())),
    onPreviousContext: () => (dispatch(player.previousContext())),
    onMute: () => (dispatch(player.mute())),
    onUnmute: () => (dispatch(player.unmute())),
})
export default connect(mapStateToProps, mapDispatchToProps)(NavPlayer)
