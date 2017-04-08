import React from 'react'
import { connect } from 'react-redux'
import { Loop } from '../../components'
import { StripHeader,  Controller } from '../index'
import './style.scss'

class Strip extends React.Component {
    static propTypes = {
        stripOpened: React.PropTypes.bool,
        loopItems: React.PropTypes.array,
    }

    render() {
        const { stripOpened, loopItems } = this.props
        return (
            <div className="Strip">
                <StripHeader/>
                { stripOpened &&
                    <Loop items={loopItems}/>
                }
                <Controller/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    stripOpened: state.browser.stripOpened,
    loopItems: state.browser.loop,
})
export default connect(mapStateToProps)(Strip)
