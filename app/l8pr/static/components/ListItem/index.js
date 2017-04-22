import React from 'react'
import moment from 'moment'
import './style.scss'

const sourceIcones = {
    youtube: 'youtube-play',
    soundcloud: 'soundcloud',
    vimeo: 'vimeo',
}


function getItemType(item) {
    if (item.url) {
        return Track
    } else if (item.items) {
        return Show
    }
}

export default function ListItem(props) {
    const SpecificItem = getItemType(props.item)
    return (<SpecificItem {...props}/>)
}

function Show({ item, onPlayClick, isPlaying, style }) {
    return (
        <div className="ListItem ListItem--Show" style={style}>
            <div className="ListItem__body">
                <div className="ListItem__title">{item.title} by {item.user.username}</div>
                <span className="ListItem__details">{item.items.length} tracks / </span>
                <span className="ListItem__details">{getDuration(item.items)}</span>
            </div>
            <div className="ListItem__highlight">{item.items.slice(0, 3).map((i, idx) => (
                <img src={i.thumbnail} key={idx} onClick={onPlayClick.bind(null, i)}/>
            ))}</div>
        </div>
    )
}

function Track({ item, onPlayClick, isPlaying, style }) {
    return (
        <div className="ListItem ListItem--Track" onClick={onPlayClick.bind(null, item)} style={style}>
            {isPlaying && <i className="material-icons">pause</i>}
            <div className="ListItem__body">
                <div className="ListItem__title">{item.title}</div>
                <span className="ListItem__details">&nbsp;{getDuration(item)}</span>
                {item.provider_name &&
                    <span className="ListItem__source">
                        <i className={`fa fa-${sourceIcones[item.provider_name.toLowerCase()]}`} aria-hidden="true"/>
                    </span>
                }
            </div>
            <div className="ListItem__illustration" style={{ backgroundImage: `url(${item.thumbnail})` }}/>
        </div>
    )
}

ListItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    onPlayClick: React.PropTypes.func.isRequired,
    isPlaying: React.PropTypes.bool,
    style: React.PropTypes.object,
}

function getDuration(items) {
    let duration
    if (Array.isArray(items)) {
        duration = items.reduce((r, i) => (r + i.duration), 0)
    } else {
        duration = items.duration
    }
    return moment.duration(duration, 's').humanize()
}
