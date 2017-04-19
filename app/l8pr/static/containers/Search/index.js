import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../../selectors'
import './style.scss'
import * as player from '../../actions/player'

class Search extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="Search row">
                SEACRCH
            </div>
        )
    }
}

Search.propTypes = {
    contexts: React.PropTypes.array.isRequired,
    onItemPlayClick: React.PropTypes.func.isRequired,
    currentItem: React.PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    contexts: selectors.getPlaylistGroupedByContext(state),
    currentItem: selectors.currentTrack(state),
})
const mapDispatchToProps = (dispatch) => ({
    onItemPlayClick: (item) => (dispatch(player.playItem(item))),
})
export default connect(mapStateToProps, mapDispatchToProps)(Search)
