import React from 'react'
import { connect } from 'react-redux'
import { Progressbar } from '../index'
import { NavPlayer, PlayQueue2, Search } from '../index'
import * as browser from '../../actions/browser'
import './style.scss'
import classNames from 'classnames'

class Strip extends React.Component {
    static propTypes = {
        hidden: React.PropTypes.bool,
        stripFixed: React.PropTypes.bool,
        progress: React.PropTypes.number,
        loaded: React.PropTypes.number,
        onSeekTo: React.PropTypes.func,
        openStrip: React.PropTypes.func,
        closeStrip: React.PropTypes.func,
        search: React.PropTypes.bool,
        bannerMode: React.PropTypes.bool,
    }

    render() {
        const {
            progress,
            loaded,
            onSeekTo,
            hidden,
            stripFixed,
            openStrip,
            closeStrip,
            search,
            bannerMode,
        } = this.props
        const classes = classNames(
            'Strip',
            { 'Strip--fixed': stripFixed },
            { 'Strip--hidden': hidden }
        )
        return (
            <div className={classes} onMouseEnter={openStrip} onMouseLeave={closeStrip}>
                {search && !bannerMode && <Search/>}
                <PlayQueue2 bannerMode={bannerMode || search}/>
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
    search: state.browser.browserType === 'SEARCH',
    bannerMode: !state.browser.stripOpened,
})

const mapDispatchToProps = (dispatch) => ({
    openStrip: () => false && dispatch(browser.openStrip()),
    closeStrip: () => false && dispatch(browser.closeStrip()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Strip)
