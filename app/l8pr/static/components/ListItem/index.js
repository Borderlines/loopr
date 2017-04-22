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
    const classNames = [
        'ListItem',
        props.isPlaying ? 'ListItem--isPlaying': null,
    ].join(' ')
    return (<SpecificItem className={classNames} {...props}/>)
}

function Show({ item, className='', onPlayClick, isPlaying, style, onPlayShowClick }) {
    return (
        <div className={className + ' ListItem--Show'} style={style} onClick={() => (onPlayShowClick(item))}>
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

function Track({ item, className='', onPlayClick, isPlaying, style }) {
    return (
        <div className={className + ' ListItem--Track'} onClick={() => (onPlayClick(item))} style={style}>
            <div className="ListItem__body">
                <span className="ListItem__source">
                <i className={`fa fa-${sourceIcones[item.provider_name.toLowerCase()]}`} aria-hidden="true"/>
                </span>
                <span className="ListItem__title">{item.title}</span>
                <div className="ListItem__details">{getDuration(item)}</div>
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
Track.propTypes = ListItem.propTypes
Show.propTypes = ListItem.propTypes

function getDuration(items) {
    let duration
    if (Array.isArray(items)) {
        duration = items.reduce((r, i) => (r + i.duration), 0)
    } else {
        duration = items.duration
    }
    return moment.duration(duration, 's').humanize()
}
