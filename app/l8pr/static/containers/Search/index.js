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
import { AutoSizer, Column, Table, List } from 'react-virtualized'
import 'react-virtualized/styles.css'

class Search extends React.Component {
    constructor(props) {
        super(props)
    }
    _rowRenderer({ index, key, style }) {
        const item = this.props.searchResults[index]
        return (
            <ListItem key={key} item={item} onPlayClick={this.props.onPlayClick} style={style}/>
        )
    }

    cellRenderer({ cellData }) {
        console.log(cellData)
        return (<img src={cellData}/>)
    }

    render() {
        const { searchTerms, search, searchResults, onPlayClick, isLoading } = this.props
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
                    {isLoading && <div>Loading ...</div>
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
    isLoading: React.PropTypes.bool,
}

const mapStateToProps = (state) => ({
    searchTerms: selectors.getSearchTerms(state),
    searchResults: selectors.getSearchResults(state),
    isLoading: state.search.loading,
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
