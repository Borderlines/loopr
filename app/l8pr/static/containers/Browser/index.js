import React from 'react'
import { connect } from 'react-redux'
import { PlayQueue, Search } from '../index'


function Browser({ browserType }) {
    const types = {
        'SEARCH': <Search/>,
        'PLAYQUEUE': <PlayQueue/>,
    }
    return types[browserType]
}

const mapStateToProps = (state) => ({
    browserType: state.browser.browserType,
})

export default connect(mapStateToProps)(Browser)
