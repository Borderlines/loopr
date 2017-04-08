import React from 'react'
import { connect } from 'react-redux'
import NavPlayer from '../../components/NavPlayer'
import * as player from '../../actions/player'

function ControllerComponent(props) {
    return (
        <NavPlayer {...props} />
    )
}

const mapStateToProps = (state) => ({
    playing: state.player.playing,
    muted: state.player.muted,
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
export default connect(mapStateToProps, mapDispatchToProps)(ControllerComponent)
