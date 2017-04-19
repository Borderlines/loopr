import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../../selectors'
import './style.scss'
import * as player from '../../actions/player'
import { StripHeader } from '../index'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

class Search extends React.Component {
    constructor(props) {
        super(props)
    }
    handleOnChange(val) {
        this.props.search(val)
    }
    render() {
        const { searchTerms } = this.props
        return (
            <div className="Search">
                <StripHeader>
                    <Select.Creatable
                        promptTextCreator={(label) => `Search ${label}`}
                        multi={true}
                        onChange={this.handleOnChange.bind(this)}
                        value={searchTerms}
                    />
                </StripHeader>
            </div>
        )
    }
}

Search.propTypes = {
    contexts: React.PropTypes.array.isRequired,
    onItemPlayClick: React.PropTypes.func.isRequired,
    currentItem: React.PropTypes.object.isRequired,
    searchTerms: React.PropTypes.array,
}

const mapStateToProps = (state) => ({
    contexts: selectors.getPlaylistGroupedByContext(state),
    currentItem: selectors.currentTrack(state),
})
const mapDispatchToProps = (dispatch) => ({ onItemPlayClick: (item) => (dispatch(player.playItem(item))) })
export default connect(mapStateToProps, mapDispatchToProps)(Search)
