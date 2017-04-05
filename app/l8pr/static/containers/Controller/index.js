import React from 'react'
import { connect } from 'react-redux'
import NavPlayer from '../../components/NavPlayer'
import { next, play, pause } from '../../actions/player'

function ControllerComponent(props) {
    return (
        <NavPlayer {...props} />
    )
}

const mapStateToProps = (state) => ({
    playing: state.player.playing,
})

const mapDispatchToProps = (dispatch) => ({
    onNextItem: () => (dispatch(next())),
    onPlay: () => (dispatch(play())),
    onPause: () => (dispatch(pause())),
})
export default connect(mapStateToProps, mapDispatchToProps)(ControllerComponent)
