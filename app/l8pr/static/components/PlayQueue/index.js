import React from 'react'
import { ContextsList, StripHeader } from '../index'
import { connect } from 'react-redux'
import * as selectors from '../../selectors'
import './style.scss'
import * as player from '../../actions/player'
import * as modal from '../../actions/modal'
import classNames from 'classnames'

class PlayQueue extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { contexts, onItemPlayClick, currentItem, className, handleAddClick } = this.props
        return (
            <div className={classNames('PlayQueue', className)}>
                <StripHeader title="playing now"/>
                <ContextsList
                    contexts={contexts}
                    onAddClick={handleAddClick}
                    onItemPlayClick={onItemPlayClick}
                    currentItem={currentItem}/>
            </div>
        )
    }
}

PlayQueue.propTypes = {
    contexts: React.PropTypes.array.isRequired,
    onItemPlayClick: React.PropTypes.func.isRequired,
    handleAddClick: React.PropTypes.func.isRequired,
    currentItem: React.PropTypes.object,
    className: React.PropTypes.string,
}

const mapStateToProps = (state) => ({
    contexts: selectors.getPlaylistGroupedByContext(state),
    currentItem: selectors.currentTrack(state),
})
const mapDispatchToProps = (dispatch) => ({
    onItemPlayClick: (item) => (dispatch(player.jumpToItem(item))),
    handleAddClick: (item) => dispatch(modal.showModal('ADD_ITEM', { item })),
})
export default connect(mapStateToProps, mapDispatchToProps)(PlayQueue)
