import React from 'react'
import { connect } from 'react-redux'
import { PlayQueue } from '../../components'
import { StripHeader,  Controller } from '../index'
import * as selectors from '../../selectors'
import * as player from '../../actions/player'
import './style.scss'

class Strip extends React.Component {
    static propTypes = {
        stripOpened: React.PropTypes.bool,
        playlist: React.PropTypes.array,
        onItemPlayClick: React.PropTypes.func,
    }

    render() {
        const { stripOpened, playlist, onItemPlayClick } = this.props
        return (
            <div className="Strip">
                <StripHeader/>
                { stripOpened &&
                    <PlayQueue contexts={playlist} onItemPlayClick={onItemPlayClick}/>
                }
                <Controller/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    stripOpened: state.browser.stripOpened,
    playlist: selectors.getPlaylistGroupedByContext(state),
})
const mapDispatchToProps = (dispatch) => ({
    onItemPlayClick: (item) => (dispatch(player.playItem(item))),
})
export default connect(mapStateToProps, mapDispatchToProps)(Strip)
