import React from 'react'
import { ListItem } from '../../components'
import { AutoSizer, List } from 'react-virtualized'
import './style.scss'


export default class ContextsList extends React.Component {
    _rowRenderer({ index, key, style }) {
        const { contexts, onItemPlayClick, onPlayShowClick, onAddClick } = this.props
        const item = contexts[index]
        if (item.type === 'context') {
            return (
                <div key={key} style={style} className="ContextsList__context">
                    <div className="ContextsList__cover">
                        <div className="context__title">{item.title}</div>
                        <div className="context__details">
                            <span>{item.size} items</span>
                            <span>{item.duration}</span>
                        </div>
                        <div className="context__actions">
                            <span className="context__share"><i className="material-icons">share</i></span>
                            <span className="context__more"><i className="material-icons">more_horiz</i></span>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div key={key} style={style} className="ContextsList__item">
                    <ListItem
                        item={item}
                        onPlayClick={onItemPlayClick}
                        onAddClick={onAddClick}
                        onPlayShowClick={onPlayShowClick}
                        isPlaying={false}/>
                </div>
            )
        }
    }
    componentDidUpdate() {
        this.refs.AutoSizer.refs.List.recomputeRowHeights()
    }
    render() {
        const { contexts } = this.props
        return (
            <div className="ContextsList">
                <AutoSizer ref="AutoSizer">
                    {({ width, height }) => (
                        <List
                            ref="List"
                            className="ContextsList__list"
                            width={width}
                            height={height}
                            rowCount={contexts.length}
                            rowHeight={50}
                            rowRenderer={this._rowRenderer.bind(this)}
                        />
                    )}
                </AutoSizer>
            </div>
        )
    }
}

ContextsList.propTypes = {
    contexts: React.PropTypes.array.isRequired,
    onItemPlayClick: React.PropTypes.func.isRequired,
    onPlayShowClick: React.PropTypes.func,
    onAddClick: React.PropTypes.func,
}
