import React from 'react'
import { connect } from 'react-redux'
import * as browser from '../../actions/browser'
import * as player from '../../actions/player'
import * as modal from '../../actions/modal'
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
    stripOpened,
    showQueuelist,
    handleSearch,
    handleLogin,
    browserType,
    toggleFixedStrip,
    stripFixed,
}) {
    return (
        <div className="NavPlayer">
            <div className="NavPlayer__banner">
                <div className="NavPlayer__item">{get(currentItem, 'title')}</div>
                <div className="NavPlayer__show">{get(currentShow, 'title')}</div>
            </div>
            <div className="NavPlayer__controllers">
            <div>
                {muted &&
                    <a onClick={onUnmute} title="Mute on/off">
                        <i className="material-icons">volume_off</i>
                    </a>
                ||
                    <a onClick={onMute} title="Mute on/off">
                        <i className="material-icons">volume_up</i>
                    </a>
                }
                <a title="Visual">
                    <i className="material-icons">photo_size_select_actual</i>
                </a>
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
                <a onClick={toggleFixedStrip} title="Always Keep Strip">
                    <i className={'material-icons ' + (stripFixed ? 'active' : '')}>
                        call_to_action
                    </i>
                </a>
                <a title="Queue List" onClick={showQueuelist}>
                    <i className={'material-icons ' + (stripOpened && browserType === 'PLAYQUEUE' ? 'active' : '')}>
                        playlist_play
                    </i>
                </a>
                <a title="Search" onClick={handleSearch}>
                    <i className={'material-icons ' + (stripOpened && browserType === 'SEARCH' ? 'active' : '')}>
                        search
                    </i>
                </a>
                <a title="Login" onClick={handleLogin}>
                    <i className="material-icons" title="Login">
                        account_circle
                    </i>
                </a>
                </div>
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
    currentItem: React.PropTypes.object,
    currentShow: React.PropTypes.object,
    stripOpened: React.PropTypes.bool,
    showQueuelist: React.PropTypes.func,
    handleSearch: React.PropTypes.func.isRequired,
    handleLogin: React.PropTypes.func.isRequired,
    browserType: React.PropTypes.string,
    toggleFixedStrip: React.PropTypes.bool,
    stripFixed: React.PropTypes.func,
}

const mapStateToProps = (state) => ({
    playing: state.player.playing,
    muted: state.player.muted,
    currentItem: selectors.currentTrack(state),
    currentShow: selectors.currentShow(state),
    stripOpened: state.browser.stripOpened,
    browserType: state.browser.browserType,
    stripFixed: state.browser.stripFixed,
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
    showQueuelist: () => (dispatch(browser.toggleStrip('PLAYQUEUE'))),
    handleSearch: () => (dispatch(browser.toggleStrip('SEARCH'))),
    toggleFixedStrip: () => (dispatch(browser.toggleFixedStrip())),
    handleLogin: () => (dispatch(modal.showModal('LOGIN'))),
})

export default connect(mapStateToProps, mapDispatchToProps)(NavPlayer)
