import React from 'react';
import { connect } from 'react-redux';
import { Loop } from '../../components'
import { StripHeader,  Controller} from '../index'
import './style.scss'

class Strip extends React.Component {
    static propTypes = {
    };

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
    loopItems: state.browser.loop
})
export default connect(mapStateToProps)(Strip)
