import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../../selectors'
import './style.scss'
import * as search from '../../actions/search'
import * as player from '../../actions/player'
import * as modal from '../../actions/modal'
import { StripHeader, Suggestions } from '../index'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import { ListItem } from '../../components'
import { AutoSizer, List } from 'react-virtualized'
import 'react-virtualized/styles.css'

class Search extends React.Component {
    constructor(props) {
        super(props)
    }
    _rowRenderer({ index, key, style }) {
        const { onPlayClick, onPlayShowClick, currentTrack, currentShow, onAddClick } = this.props
        const item = this.props.searchResults[index]
        return (
            <ListItem
                key={key}
                item={item}
                onPlayClick={onPlayClick}
                onPlayShowClick={onPlayShowClick}
                onAddClick={onAddClick}
                currentTrack={currentTrack}
                isPlaying={currentTrack.id === item.id || currentShow.id === item.id}
                style={style}
            />
        )
    }

    cellRenderer({ cellData }) {
        return (<img src={cellData}/>)
    }

    render() {
        const { searchTerms, search, searchResults, isLoading } = this.props
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
                <div className="Search__list">
                    {isLoading &&
                        <div>Loading ...</div>
                    ||
                        searchResults.length === 0 &&
                            <Suggestions/>
                        ||
                            <AutoSizer>
                                {({ width, height }) => (
                                    <List
                                        width={width}
                                        height={height}
                                        rowCount={searchResults.length}
                                        rowHeight={100}
                                        rowRenderer={this._rowRenderer.bind(this)}
                                    />
                                )}
                            </AutoSizer>
                    }
                </div>
            </div>
        )
    }
}

Search.propTypes = {
    searchTerms: React.PropTypes.array,
    searchResults: React.PropTypes.array,
    search: React.PropTypes.func,
    onPlayClick: React.PropTypes.func,
    onPlayShowClick: React.PropTypes.func,
    onAddClick: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    currentShow: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
}

const mapStateToProps = (state) => ({
    searchTerms: selectors.getSearchTerms(state),
    searchResults: selectors.getSearchResults(state),
    isLoading: state.search.loading,
    currentShow: selectors.currentShow(state),
    currentTrack: selectors.currentTrack(state),
})
const mapDispatchToProps = (dispatch) => ({
    search: (searchTerms) => dispatch(search.search(searchTerms)),
    onAddClick: (item) => dispatch(modal.showModal('ADD_ITEM', { item })),
    onPlayShowClick: (show) => dispatch(player.playItems(
        show.items.map((item) => ({
            ...item,
            context: show,
        }))
    )),
    onPlayClick: (item) => dispatch(player.playItem({
        ...item,
        context: {
            title: 'Search',
            id: 'search',
        },
    })),
})
export default connect(mapStateToProps, mapDispatchToProps)(Search)
