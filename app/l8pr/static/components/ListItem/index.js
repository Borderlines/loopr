import React from 'react'
import moment from 'moment'
import './style.scss'

const sourceIcones = {
    youtube: 'youtube-play',
    soundcloud: 'soundcloud',
    vimeo: 'vimeo',
}

export default function ListItem({ item, onPlayClick, isPlaying }) {
    return (
        <div className="ListItem" onClick={onPlayClick.bind(null, item)}>
            {isPlaying && <i className="material-icons">pause</i>}
            <span className="ListItem__title">{item.title}</span>
            <span className="ListItem__details">&nbsp;{moment.duration(item.duration, 's').humanize()}</span>
            <span className="ListItem__source">
                <i className={`fa fa-${sourceIcones[item.provider_name.toLowerCase()]}`} aria-hidden="true"/>
            </span>
        </div>
    )
}

ListItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    onPlayClick: React.PropTypes.func.isRequired,
    isPlaying: React.PropTypes.bool,
}
