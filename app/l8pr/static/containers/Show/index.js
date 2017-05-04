import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../../selectors'
import './style.scss'
import * as player from '../../actions/player'
import * as modal from '../../actions/modal'
import 'react-select/dist/react-select.css'
import { ListItem, StripHeader } from '../../components'
import classNames from 'classnames'
import 'react-virtualized/styles.css'
import { getDuration } from '../../utils'

class Show extends React.Component {
    render() {
        const { className, show, onPlayClick, onAddClick, currentTrack } = this.props
        const title = `Show: ${show.title} ${show.items.length} items / ${getDuration(show.items)}`
        return (
            <div className={classNames('Show', className)}>
                <StripHeader title={title} back={true}/>
                <div className="Show__body">
                    {show.items.map((item) => (
                        <ListItem
                            item={item}
                            key={item.id}
                            onPlayClick={(item) => onPlayClick(show, item)}
                            onAddClick={onAddClick}
                            isPlaying={currentTrack.id === item.id}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

Show.propTypes = {
    className: React.PropTypes.string,
    onAddClick: React.PropTypes.func.isRequired,
    onPlayClick: React.PropTypes.func.isRequired,
    currentTrack: React.PropTypes.object,
    show: React.PropTypes.shape({ items: React.PropTypes.array.isRequired }).isRequired,
}

const mapStateToProps = (state) => ({
    show: state.browser.browserProps.show,
    currentTrack: selectors.currentTrack(state),
})
const mapDispatchToProps = (dispatch) => ({
    onAddClick: (item) => dispatch(modal.showModal('ADD_ITEM', { item })),
    onPlayClick: (show, item) => {
        const items = show.items.slice(show.items.indexOf(item)).map(i => ({
            ...i,
            context: show,
        }))
        dispatch(player.playItems(items))
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(Show)
