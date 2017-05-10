import React from 'react'
import { connect } from 'react-redux'
import * as selectors from '../../selectors'
import './style.scss'
import * as search from '../../actions/search'
import * as player from '../../actions/player'
import * as modal from '../../actions/modal'
import * as browser from '../../actions/browser'
import { Suggestions } from '../index'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import { ListItem, StripHeader, ResultsCounter } from '../../components'
import { AutoSizer, List } from 'react-virtualized'
import classNames from 'classnames'
import 'react-virtualized/styles.css'

class Search extends React.Component {
    constructor(props) {
        super(props)
    }
    _rowRenderer({ index, key, style }) {
        const {
            onPlayClick,
            onPlayShowClick,
            currentTrack,
            currentShow,
            onAddClick,
            onShowClick,
        } = this.props
        const item = this.props.searchResults[index]
        return (
            <ListItem
                key={key}
                item={item}
                onPlayClick={onPlayClick}
                onShowClick={onShowClick}
                onPlayShowClick={onPlayShowClick}
                onAddClick={onAddClick}
                isPlaying={currentTrack.url === item.url || currentShow.id === item.id}
                style={style}
            />
        )
    }

    cellRenderer({ cellData }) {
        return (<img src={cellData}/>)
    }

    render() {
        const { searchTerms, search, searchResults, isLoading, className } = this.props
        return (
            <div className={classNames('Search', className)}>
                <StripHeader title="Search">
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
                        || [
                            <ResultsCounter results={searchResults}/>,
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
                            </AutoSizer>,
                        ]
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
    onShowClick: React.PropTypes.func.isRequired,
    onPlayShowClick: React.PropTypes.func.isRequired,
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
    onShowClick: (show) => dispatch(browser.browse('SHOW', { show })),
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
