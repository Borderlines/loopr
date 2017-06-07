import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../../selectors'
import { Show, Context } from '../index'
import * as player from '../../actions/player'
import * as modal from '../../actions/modal'
import classNames from 'classnames'
import './style.scss'

class PlayQueue2 extends React.Component {
    render() {
        const { contexts, className, openedContext } = this.props
        const currentContext = contexts && contexts[0]

        return (
            <div className={classNames('PlayQueue2', className)}>
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
    // onItemPlayClick: React.PropTypes.func.isRequired,
    // handleAddClick: React.PropTypes.func.isRequired,
    // currentItem: React.PropTypes.object,
    // currentShow: React.PropTypes.object,
    className: React.PropTypes.string,
}

const mapStateToProps = (state) => ({
    contexts: selectors.getPlaylistGroupedByContext(state),
    currentItem: selectors.currentTrack(state),
    currentShow: selectors.currentShow(state),
    openedContext: state.browser.openedContext,
})
const mapDispatchToProps = (dispatch) => ({
    onItemPlayClick: (item) => (dispatch(player.jumpToItem(item))),
    handleAddClick: (item) => dispatch(modal.showModal('ADD_ITEM', { item })),
})
export default connect(mapStateToProps, mapDispatchToProps)(PlayQueue2)
