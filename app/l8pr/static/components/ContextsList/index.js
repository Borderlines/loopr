import React from 'react'
import { ListItem } from '../../components'
import moment from 'moment'
import './style.scss'

export default function ContextsList({ contexts, onItemPlayClick, currentItem }) {
    return (
        <div className="ContextsList">
            <ul>
                {contexts.map((c) => (
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
    currentItem: React.PropTypes.object,
}

function getDuration(items) {
    return items.reduce((r, i) => (r + i.duration), 0)
}
