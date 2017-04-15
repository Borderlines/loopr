import React from 'react'
import { connect } from 'react-redux'
import { Progressbar } from '../../components'
import { StripHeader,  NavPlayer, PlayQueue } from '../index'
import './style.scss'

class Strip extends React.Component {
    static propTypes = {
        stripOpened: React.PropTypes.bool,
        progress: React.PropTypes.number,
        loaded: React.PropTypes.number,
        onSeekTo: React.PropTypes.func,
    }

    render() {
        const { stripOpened, progress, loaded, onSeekTo } = this.props
        return (
            <div className="Strip">
                <StripHeader/>
                { stripOpened &&
                    <PlayQueue/>
                }
                <Progressbar progress={progress} loaded={loaded} onClick={onSeekTo}/>
                <NavPlayer/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    stripOpened: state.browser.stripOpened,
})

export default connect(mapStateToProps)(Strip)
