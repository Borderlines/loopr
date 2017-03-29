import React from 'react'
import { connect } from 'react-redux'
import NavPlayer from '../../components/NavPlayer'
import { next } from '../../actions/player'

function ControllerComponent(props) {
    return (
        <NavPlayer {...props} />
    )
}
const mapDispatchToProps = (dispatch) => ({
    onNextItem: () => (dispatch(next())),
})
export default connect(null, mapDispatchToProps)(ControllerComponent)
