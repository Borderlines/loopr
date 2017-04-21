import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../../selectors'
import './style.scss'
import * as search from '../../actions/search'
import * as player from '../../actions/player'
import { StripHeader } from '../index'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import { ListItem } from '../../components'

class Search extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { searchTerms, search, searchResults, onPlayClick } = this.props
        return (
            <div className="Search">
                <StripHeader>
                    <Select.Creatable
                        promptTextCreator={(label) => `Search ${label}`}
                        multi={true}
                        autofocus={true}
                        onChange={search}
                        value={searchTerms}
                    />
                </StripHeader>
                <ul className="Search__list">
                    {searchResults.map((r) => (
                        <li>
                            <ListItem item={r} onPlayClick={onPlayClick}/>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

Search.propTypes = {
    searchTerms: React.PropTypes.array,
    searchResults: React.PropTypes.array,
    search: React.PropTypes.func,
    onPlayClick: React.PropTypes.func,
}

const mapStateToProps = (state) => ({
    searchTerms: selectors.getSearchTerms(state),
    searchResults: selectors.getSearchResults(state),
})
const mapDispatchToProps = (dispatch) => ({
    search: (searchTerms) => dispatch(search.search(searchTerms)),
    onPlayClick: (item) => dispatch(player.playItem({
        ...item,
        context: {
            title: 'Search',
            id: 'search',
        },
    })),
})
export default connect(mapStateToProps, mapDispatchToProps)(Search)
