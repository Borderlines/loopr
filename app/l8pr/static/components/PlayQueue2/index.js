import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../../selectors'
import { Context } from '../index'
import * as player from '../../actions/player'
import * as modal from '../../actions/modal'
import classNames from 'classnames'
import './style.scss'

class PlayQueue2 extends React.Component {
    render() {
        const { contexts, className, openedContext, bannerMode } = this.props
        const currentContext = contexts && contexts[0]
        const classes = classNames(
            'PlayQueue2',
            { 'PlayQueue2--banner': bannerMode },
            className)
        return (
            <div className={classes}>
                <div className="PlayQueue2__current-context">
                    {currentContext &&
                        <Context
                            context={currentContext}
                            highlightFirstItem={true}
                            open={true}
                        />
                    }
                </div>
                <div className="PlayQueue2__next-context">
                    {contexts.slice(1).map((context) => (
                        <Context
                            key={context.context.id}
                            open={openedContext === context.context.id}
                            context={context}/>
                    ))}
                </div>
            </div>
        )
    }
}

PlayQueue2.propTypes = {
    contexts: React.PropTypes.array.isRequired,
    className: React.PropTypes.string,
    openedContext: React.PropTypes.string,
    bannerMode: React.PropTypes.bool,
}

const mapStateToProps = (state) => ({
    contexts: selectors.getPlaylistGroupedByContext(state),
    openedContext: state.browser.openedContext,
})
const mapDispatchToProps = (dispatch) => ({
    onItemPlayClick: (item) => (dispatch(player.jumpToItem(item))),
    handleAddClick: (item) => dispatch(modal.showModal('ADD_ITEM', { item })),
})
export default connect(mapStateToProps, mapDispatchToProps)(PlayQueue2)
