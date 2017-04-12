import React from 'react'
import moment from 'moment'
import './style.scss'

export default function ListItem({ item, onPlayClick }) {
    return (
        <div className="ListItem" onClick={onPlayClick.bind(null, item)}>
            <div>
                <span className="ListItem__title">{item.title}</span>
                <span className="ListItem__details">{moment.duration(item.duration, 's').humanize()}</span>
                <div className="ListItem__desc hidden">{item.description}</div>
            </div>
            <div>
                <img className="ListItem__thumbnail hidden" src={item.thumbnail}/>
            </div>
        </div>
    )
}

ListItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    onPlayClick: React.PropTypes.func.isRequired,
}
