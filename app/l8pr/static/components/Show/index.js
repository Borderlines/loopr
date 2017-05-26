import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../../selectors'
import './style.scss'
import * as player from '../../actions/player'
import * as modal from '../../actions/modal'
import 'react-select/dist/react-select.css'
import { ListItem, StripHeader, ResultsCounter } from '../index'
import classNames from 'classnames'
import 'react-virtualized/styles.css'


class Show extends React.Component {
    render() {
        const { className, show, onPlayClick, onAddClick, currentTrack } = this.props
        return (
            <div className={classNames('Show', className)}>
                <StripHeader title="back" className="StripHeader" back={true}/>
                <div className="cover">
                    <div className="ListItem__preview--show">
                        <a onClick={(e) => {e.stopPropagation(); onPlayShowClick(item)}}>
                            <i className="material-icons">playlist_play</i>
                        </a>
                        <a><i className="material-icons">play_arrow</i></a>
                    </div>
                    <div className="ListItem--Show ListItem__body">
                        <div className="ListItem__title">{show.title}</div>
                        <div className="ListItem__details">
                            <div>Vied12</div>
                            <ResultsCounter results={show.items}/>
                            <div><i className="material-icons">bookmark_outline</i></div>
                            <div><i className="material-icons">share</i></div>
                        </div>
                    </div>
                </div>

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
