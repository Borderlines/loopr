import React from 'react'
import './style.scss'
import { getDuration } from '../../utils'

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
    } else if (item.username) {
        return User
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

function Show({ key, item, className='', onPlayClick, isPlaying, style, onPlayShowClick, onShowClick, showImages=true }) {
    return (
        <div
            key={key}
            className={className + ' ListItem--Show'}
            style={style}
            onClick={() => (onShowClick && onShowClick(item))}>
            <div className="ListItem__illuBox">
                {showImages &&
                    <div className="ListItem__highlight">{item.items.slice(0, 3).map((i, idx) => (
                        <img src={i.thumbnail} key={idx} onClick={() => onPlayClick(i)}/>
                    ))}</div>
                }
                <div className="ListItem__illu"><i className="material-icons">play_arrow</i></div>
            </div>
            <div className="ListItem__body">
                <div className="ListItem__title">{item.title}</div>
                <div className="ListItem__details">
                    <span>{item.user.username}</span>
                    <span>{item.items.length} tracks</span>
                    <span>{getDuration(item.items)}</span>
                </div>
                <div className="ListItem__actions">
                    <a onClick={() => (onPlayShowClick(item))}>
                        <i className="material-icons">playlist_play</i>
                    </a>
                </div>
            </div>
        </div>
    )
}

function Track({ key, item, className='', onPlayClick, isPlaying, style, onAddClick }) {
    return (
        <div key={key} className={className + ' ListItem--Track'} onClick={() => (onPlayClick(item))} style={style}>
            <div className="ListItem__illuBox">
                <div className="ListItem__illu" style={{ backgroundImage: `url(${item.thumbnail})` }}/>
                    <i className="material-icons">play_arrow</i>
                </div>
            <div className="ListItem__body">
                <div className="ListItem__title">{item.title}</div>
                <div className="ListItem__details">{getDuration(item)}</div>
                <div className="ListItem__actions">
                    <span className="ListItem__source">
                        <i className={`fa fa-${sourceIcones[item.provider_name.toLowerCase()]}`} aria-hidden="true"/>
                    </span>
                    <span>
                        <i className="material-icons">info_outline</i>
                    </span>
                    <span className="ListItem__add" onClick={(e) => {e.stopPropagation(); onAddClick(item)}}>
                        <i className="material-icons">add</i>
                    </span>
                    <span><i className="material-icons">share</i></span>
                </div>
            </div>
        </div>
    )
}

function User({ key, item, className='', onPlayClick, isPlaying, style, onAddClick }) {
    return (
        <div key={key} className={className + ' ListItem--User'} style={style}>
            <div className="ListItem__body">
                <span className="ListItem__title">{item.username}</span>
            </div>
        </div>
    )
}

ListItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    onPlayClick: React.PropTypes.func,
    onAddClick: React.PropTypes.func,
    isPlaying: React.PropTypes.bool,
    isSelected: React.PropTypes.bool,
    style: React.PropTypes.object,
}
Track.propTypes = ListItem.propTypes
Show.propTypes = ListItem.propTypes
