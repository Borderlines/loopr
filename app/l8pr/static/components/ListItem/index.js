import React from 'react'
import moment from 'moment'
import './style.scss'

export default function ListItem({ item, onPlayClick, isPlaying }) {
    return (
        <div className="ListItem" onClick={onPlayClick.bind(null, item)}>
            <div>
                {isPlaying && <i className="material-icons">pause</i>}
                <span className="ListItem__title">{item.title}</span>
                <span className="ListItem__details">&nbsp;{moment.duration(item.duration, 's').humanize()}</span>
            </div>
        </div>
    )
}

ListItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    onPlayClick: React.PropTypes.func.isRequired,
}
