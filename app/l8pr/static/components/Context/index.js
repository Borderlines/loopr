import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../../selectors'
import './style.scss'
import * as player from '../../actions/player'
import * as browser from '../../actions/browser'
import * as auth from '../../actions/auth'
import * as modal from '../../actions/modal'
import 'react-select/dist/react-select.css'
import { ListItem, ResultsCounter } from '../index'
import classNames from 'classnames'
import 'react-virtualized/styles.css'
import { get } from 'lodash'

class Context extends React.Component {
    render() {
        const {
            className,
            context,
            onPlayClick,
            onAddClick,
            currentTrack,
            follow,
            unfollow,
            playItem,
            isFollowingAuthor,
            highlightFirstItem,
            onOpenClick,
            open,
        } = this.props
        let items
        let highlight
        let contextBackground
        if (highlightFirstItem) {
            highlight = context.items[0]
            items = context.items.slice(1)
            contextBackground = null
        } else {
            items = context.items
            contextBackground = items[0].thumbnail
        }
        const contextObj = context.context
        const classes = classNames(
            'Context',
            className,
            { 'Context--highlightFirstItem': highlightFirstItem },
            { 'Context--opened': open }
        )
        return (
            <div className={classes}>
                <div
                    className="Context__cover"
                    onClick={() => onOpenClick(contextObj)}
                    style={{ backgroundImage: contextBackground && `url(${contextBackground})` }}
                >
                    <div className="Context__title">{contextObj.title}</div>
                    {!highlight &&
                        <div className="Context__actions">
                            <a onClick={() => playItem(items[0])}>
                                <i className="material-icons">play_circle_outline</i>
                            </a>
                        </div>
                    }
                    <div className="Context__details">
                        {contextObj.user && <div>{contextObj.user.username}</div>}
                        <ResultsCounter results={items}/>
                    </div>
                    {highlight &&
                        <ListItem
                            item={highlight}
                            isPlaying={true}
                            onAddClick={onAddClick}
                        />
                    }
                </div>
                <div className="Context__list">
                    {open && items.map((item) => (
                        <ListItem
                            item={item}
                            onAddClick={onAddClick}
                            onPlayClick={() => playItem(item)}/>
                    ))}
                </div>
            </div>
        )
    }
}

Context.propTypes = {
    className: React.PropTypes.string,
    onAddClick: React.PropTypes.func.isRequired,
    onPlayClick: React.PropTypes.func.isRequired,
    currentTrack: React.PropTypes.object,
    follow: React.PropTypes.func.isRequired,
    unfollow: React.PropTypes.func.isRequired,
    onOpenClick: React.PropTypes.func.isRequired,
    open: React.PropTypes.bool.isRequired,
    isFollowingAuthor: React.PropTypes.bool.isRequired,
    highlightFirstItem: React.PropTypes.bool.isRequired,
    context: React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        items: React.PropTypes.array.isRequired,
    }).isRequired,
}

const mapStateToProps = (state) => ({
    // show: state.browser.browserProps.show,
    currentTrack: selectors.currentTrack(state),
    isFollowingAuthor: selectors.currentUser(state) && !!selectors.currentUser(state).profile.follows.find(
        (u) => (u.id === get(state, 'browser.browserProps.show.user.id'))
    ),
})
const mapDispatchToProps = (dispatch) => ({
    playItem: (item) => dispatch(player.jumpToItem(item)),
    onAddClick: (item) => dispatch(modal.showModal('ADD_ITEM', { item })),
    // onPlayClick: (show, item) => {
    //     const items = show.items.slice(show.items.indexOf(item)).map(i => ({
    //         ...i,
    //         context: show,
    //     }))
    //     dispatch(player.playItems(items))
    // },
    follow: (username) => dispatch(auth.follow(username)),
    unfollow: (username) => dispatch(auth.unfollow(username)),
    onOpenClick: (context) => dispatch(browser.openContext(context.id)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Context)
