import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../../selectors'
import './style.scss'
import * as search from '../../actions/search'
import * as player from '../../actions/player'
import * as modal from '../../actions/modal'
import 'react-select/dist/react-select.css'
import { ListItem, StripHeader } from '../../components'
import classNames from 'classnames'
import 'react-virtualized/styles.css'
import { getDuration } from '../../utils'

class Show extends React.Component {
    render() {
        const { className, show } = this.props
        const title = `Show: ${show.title} ${show.items.length} items / ${getDuration(show.items)}`
        return (
            <div className={classNames('Show', className)}>
                <StripHeader title={title} back={true}/>
                <div className="Show__body">
                    {show.items.map((item) => (
                        <ListItem
                            item={item}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

Show.propTypes = {
    className: React.PropTypes.string,
    show: React.PropTypes.shape({ items: React.PropTypes.array }),
}

const mapStateToProps = (state) => ({
    show: state.browser.browserProps.show,
})
const mapDispatchToProps = (dispatch) => ({
})
export default connect(mapStateToProps, mapDispatchToProps)(Show)
