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
        props.isSelected ? 'ListItem--isSelected': null,
    ].join(' ')
    return (<SpecificItem className={classNames} {...props}/>)
}

function Show({ item, className='', onPlayClick, isPlaying, style, onPlayShowClick, showImages=true }) {
    return (
        <div className={className + ' ListItem--Show'} style={style} onClick={() => (onPlayShowClick(item))}>
            <div className="ListItem__body">
                <div className="ListItem__title">{item.title} by {item.user.username}</div>
                <span className="ListItem__details">{item.items.length} tracks / </span>
                <span className="ListItem__details">{getDuration(item.items)}</span>
            </div>
            {showImages &&
                <div className="ListItem__highlight">{item.items.slice(0, 3).map((i, idx) => (
                    <img src={i.thumbnail} key={idx} onClick={() => onPlayClick(i)}/>
                ))}</div>
            }
        </div>
    )
}

function Track({ item, className='', onPlayClick, isPlaying, style, onAddClick }) {
    return (
        <div className={className + ' ListItem--Track'} onClick={() => (onPlayClick(item))} style={style}>
            <div className="ListItem__illustration" style={{ backgroundImage: `url(${item.thumbnail})` }}/>
            <div className="ListItem__body">
                <span className="ListItem__title">{item.title}</span>
                <span className="ListItem__details">{getDuration(item)}</span>
                <span className="ListItem__source">
                <i className={`fa fa-${sourceIcones[item.provider_name.toLowerCase()]}`} aria-hidden="true"/>
                </span>
                <span><i className="material-icons">info_outline</i></span>
                <span className="ListItem__add" onClick={(e) => {e.stopPropagation(); onAddClick(item)}}>
                    <i className="material-icons">add</i>
                </span>
                <span><i className="material-icons">share</i></span>
            </div>
        </div>
    )
}

ListItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    onPlayClick: React.PropTypes.func.isRequired,
    onAddClick: React.PropTypes.func,
    isPlaying: React.PropTypes.bool,
    isSelected: React.PropTypes.bool,
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
