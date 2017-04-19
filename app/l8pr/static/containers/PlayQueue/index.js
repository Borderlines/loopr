import React from 'react'
import { ContextsList } from '../../components'
import { StripHeader } from '../index'
import { connect } from 'react-redux'
import * as selectors from '../../selectors'
import './style.scss'
import * as player from '../../actions/player'

class PlayQueue extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { contexts, onItemPlayClick, currentItem } = this.props
        return (
            <div className="PlayQueue">
                <StripHeader>Queue List</StripHeader>
                <ContextsList
                    contexts={contexts}
                    onItemPlayClick={onItemPlayClick}
                    currentItem={currentItem}/>
            </div>
        )
    }
}

PlayQueue.propTypes = {
    contexts: React.PropTypes.array.isRequired,
    onItemPlayClick: React.PropTypes.func.isRequired,
    currentItem: React.PropTypes.object,
}

const mapStateToProps = (state) => ({
    contexts: selectors.getPlaylistGroupedByContext(state),
    currentItem: selectors.currentTrack(state),
})
const mapDispatchToProps = (dispatch) => ({ onItemPlayClick: (item) => (dispatch(player.playItem(item))) })
export default connect(mapStateToProps, mapDispatchToProps)(PlayQueue)
