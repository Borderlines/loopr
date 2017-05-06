import React from 'react'
import { ListItem } from '../../components'
import { getDuration } from '../../utils'
import { AutoSizer, List } from 'react-virtualized'
import './style.scss'


export default class ContextsList extends React.Component {
    getContextHeight({ index }) {
        const { contexts } = this.props
        return contexts[index].items.length * 50
    }
    _rowRenderer({ index, key, style }) {
        const { contexts, onItemPlayClick, onPlayShowClick, onAddClick } = this.props
        const c = contexts[index]
        return (
            <div key={key} style={style} className="ContextsList__context">
                <div
                    className="ContextsList__cover"
                    style={{ backgroundImage: `url(${c.items[0].thumbnail})` }}
                >
                    <div className="context__title">{c.context.title}</div>
                    <span className="context__details">{c.items.length} items / </span>
                    <span className="context__details">{getDuration(c.items)}</span>
                </div>
                <div className="ContextsList__items">
                    {c.items.map((item, itemIndex) => (
                        <ListItem
                            item={item}
                            onPlayClick={onItemPlayClick}
                            onAddClick={onAddClick}
                            onPlayShowClick={onPlayShowClick}
                            isPlaying={index === 0 && itemIndex === 0}/>
                    ))}
                </div>
            </div>
        )
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
                            rowHeight={this.getContextHeight.bind(this)}
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
