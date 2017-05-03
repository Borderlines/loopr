import React from 'react'
import { ListItem } from '../../components'
import moment from 'moment'
import { AutoSizer, List } from 'react-virtualized'
import './style.scss'


export default function ContextsList({ contexts, onItemPlayClick, currentItem, onPlayShowClick, onAddClick }) {
    function getContextHeight({ index }) {
        return contexts[index].items.length * 100
    }
    function _rowRenderer({ index, key, style }) {
        const c = contexts[index]
        return (
            <div key={key} style={style} className="ContextsList__context">
                <div
                    className="ContextsList__cover"
                    style={{ backgroundImage: `url(${c.items[0].thumbnail})` }}
                >
                    <div className="context__title">{c.context.title}</div>
                    <span className="context__details">{c.items.length} items / </span>
                    <span className="context__details">{moment.duration(getDuration(c.items), 's').humanize()}</span>
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
    return (
        <div className="ContextsList">
            <AutoSizer>
                {({ width, height }) => (
                    <List
                        className="ContextsList__list"
                        width={width}
                        height={height}
                        rowCount={contexts.length}
                        rowHeight={getContextHeight}
                        rowRenderer={_rowRenderer}
                    />
                )}
            </AutoSizer>
            <ul>
                {false && contexts.map((c) => (
                    <li className="context" key={c.context.id}>
                        <div className="context__cover">
                            <div className="context__title">
                                {c.context.title}<br/>
                                <span className="context__details">{c.items.length} items / </span>
                                <span className="context__details">{moment.duration(getDuration(c.items), 's').humanize()}</span>
                            </div>
                            <div className="context__illustrations">
                                {c.items.slice(0, 15).map((i, idx)=> (
                                    <img src={i.thumbnail} key={idx} onClick={onItemPlayClick.bind(null, i)}/>
                                ))}
                            </div>
                        </div>
                        <ol>
                            {c.items.map(i => (
                                <li key={i.id}>
                                    <ListItem
                                        item={i}
                                        onPlayClick={onItemPlayClick}
                                        onAddClick={onAddClick}
                                        onPlayShowClick={onPlayShowClick}
                                        isPlaying={currentItem === i}/>
                                </li>
                            ))}
                        </ol>
                    </li>
                ))}
            </ul>
        </div>
    )
}

ContextsList.propTypes = {
    contexts: React.PropTypes.array.isRequired,
    onItemPlayClick: React.PropTypes.func.isRequired,
    onPlayShowClick: React.PropTypes.func,
    onAddClick: React.PropTypes.func,
    currentItem: React.PropTypes.object,
}

function getDuration(items) {
    return items.reduce((r, i) => (r + i.duration), 0)
}