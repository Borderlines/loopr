import React from 'react'
import { connect } from 'react-redux'
import { Progressbar } from '../index'
import { NavPlayer, PlayQueue2 } from '../index'
import './style.scss'
import classNames from 'classnames'

class Strip extends React.Component {
    static propTypes = {
        hidden: React.PropTypes.bool,
        stripFixed: React.PropTypes.bool,
        progress: React.PropTypes.number,
        loaded: React.PropTypes.number,
        onSeekTo: React.PropTypes.func,
    }

    render() {
        const { progress, loaded, onSeekTo, hidden, stripFixed } = this.props
        const classes = classNames(
            'Strip',
            { 'Strip--fixed': stripFixed },
            { 'Strip--hidden': hidden }
        )
        return (
            <div className={classes}>
                <PlayQueue2/>
                <NavPlayer/>
                <Progressbar progress={progress} loaded={loaded} onClick={onSeekTo}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    stripOpened: state.browser.stripOpened,
    hidden: state.browser.stripHidden,
    stripFixed: state.browser.stripFixed,
})

export default connect(mapStateToProps)(Strip)
