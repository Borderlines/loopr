import React from 'react'
import './style.scss'

export default function NavPlayer({
    onPreviousShow,
    onPreviousItem,
    onPlay,
    onNextItem,
    onNextShow,
    onMute,
}) {
    return (
        <div className="NavPlayer row">
            <div className="col-xs-7">
                <a onClick={onPreviousShow} title="Previous Show">
                    <i className="material-icons">first_page</i>
                </a>
                <a onClick={onPreviousItem} title="Previous Item">
                    <i className="material-icons">chevron_left</i>
                </a>
                <a onClick={onPlay} title="Play/Pause">
                    <i className="material-icons">play_arrow</i>
                </a>
                <a onClick={onNextItem} title="Next Item">
                    <i className="material-icons">chevron_right</i>
                </a>
                <a onClick={onNextShow} title="Next Show">
                    <i className="material-icons">last_page</i>
                </a>
                <a onClick={onMute} title="Mute on/off">
                    <i className="material-icons">volume_up</i>
                </a>
            </div>
        </div>
    )
}
