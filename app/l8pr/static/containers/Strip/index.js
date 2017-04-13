import React from 'react'
import { connect } from 'react-redux'
import { PlayQueue } from '../index'
import { StripHeader,  Controller } from '../index'
import './style.scss'

class Strip extends React.Component {
    static propTypes = {
        stripOpened: React.PropTypes.bool,
    }

    render() {
        const { stripOpened } = this.props
        return (
            <div className="Strip">
                <StripHeader/>
                { stripOpened &&
                    <PlayQueue/>
                }
                <Controller/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    stripOpened: state.browser.stripOpened,
})

export default connect(mapStateToProps)(Strip)
