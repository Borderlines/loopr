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
    } else if (item.loops) {
        return User
    }
}

export default function ListItem(props) {
    const SpecificItem = getItemType(props.item)
    return <SpecificItem {...props}/>
}

function User({ item, onPlayClick, isPlaying }) {
    return (
        <div className="ListItem ListItem--User">
            <span className="ListItem__title">{item.username}</span>
        </div>
    )
}
function Show({ item, onPlayClick, isPlaying }) {
    return (
        <div className="ListItem ListItem--Show">
            <div className="ListItem__title">{item.title} by {item.user.username}</div>
            <div className="ListItem__highlight">{item.items.slice(0, 3).map((i) => (
                <img src={i.thumbnail}/>
            ))}</div>
        </div>
    )
}
function Track({ item, onPlayClick, isPlaying }) {
    return (
        <div className="ListItem ListItem--Track" onClick={onPlayClick.bind(null, item)}>
            {isPlaying && <i className="material-icons">pause</i>}
            <span className="ListItem__title">{item.title}</span>
            <span className="ListItem__details">&nbsp;{moment.duration(item.duration, 's').humanize()}</span>
            {item.provider_name &&
                <span className="ListItem__source">
                    <i className={`fa fa-${sourceIcones[item.provider_name.toLowerCase()]}`} aria-hidden="true"/>
                </span>
            }
        </div>
    )
}

ListItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    onPlayClick: React.PropTypes.func.isRequired,
    isPlaying: React.PropTypes.bool,
}
