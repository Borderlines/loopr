import React from 'react'
import { connect } from 'react-redux'
import { PlayQueue, Search } from '../index'
import './style.scss'

function Browser({ browserType, open }) {
    const types = {
        'SEARCH': <Search/>,
        'PLAYQUEUE': <PlayQueue/>,
    }
    const classes = [
        'Browser',
        open ? 'Browser--open': null,
        'row',
    ].join(' ')
    return <div className={classes}>{types[browserType]}</div>
}

Browser.propTypes = {
    browserType: React.PropTypes.string.isRequired,
    open: React.PropTypes.bool,
}

const mapStateToProps = (state) => ({
    browserType: state.browser.browserType,
})

export default connect(mapStateToProps)(Browser)
