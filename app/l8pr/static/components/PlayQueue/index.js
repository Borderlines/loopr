import React from 'react'
import { ListItem } from '../index'
import { get } from 'lodash'
import moment from 'moment'

import './style.scss'

export default class PlayQueue extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { items, onItemPlayClick } = this.props
        const contexts = groupByContext(items)
        return (
            <div className="PlayQueue row">
                <ul>
                    {contexts.map((c) => (
                        <li key={c.context.id}>
                            <div className="context__title">{c.context.title}</div>
                            <div className="context__duration">{moment.duration(getDuration(c.items), 's').humanize()}</div>
                            <ol>
                                {c.items.map(i => (
                                    <li key={i.id}>
                                        <ListItem item={i} onPlayClick={onItemPlayClick}/>
                                    </li>
                                ))}
                            </ol>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

PlayQueue.propTypes = {
    items: React.PropTypes.array.isRequired,
    onItemPlayClick: React.PropTypes.func.isRequired,
}

function groupByContext(items) {
    const contexts = [{
        context: items[0].context,
        items: [],
    }]
    items.forEach((i) => {
        const lastContext = contexts[contexts.length - 1]
        if (i.context.id !== get(lastContext, 'context.id')) {
            contexts.push({
                context: null,
                items: [],
            })
        }
        if (contexts[contexts.length - 1].context === null) contexts[contexts.length - 1].context = i.context
        contexts[contexts.length - 1].items.push(i)
    })
    return contexts
}

function getDuration(items) {
    return items.reduce((r, i) => (r + i.duration), 0)
}
