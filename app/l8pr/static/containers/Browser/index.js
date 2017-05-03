import React from 'react'
import { connect } from 'react-redux'
import { PlayQueue, Search } from '../index'
import classNames from 'classnames'
import './style.scss'


function Browser({ browserType, open }) {
    const types = {
        'SEARCH': Search,
        'PLAYQUEUE': PlayQueue,
    }
    const classes = classNames(
        'Browser',
        { 'Browser--open': open },
    )
    const BrowserElement = types[browserType]
    return <BrowserElement className={classes}/>
}

Browser.propTypes = {
    browserType: React.PropTypes.string.isRequired,
    open: React.PropTypes.bool,
}

const mapStateToProps = (state) => ({ browserType: state.browser.browserType })

export default connect(mapStateToProps)(Browser)
