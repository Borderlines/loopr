import React from 'react'
import './style.scss'

export default function NavPlayer({
    onPreviousContext,
    onPreviousItem,
    onPlay,
    onPause,
    onNextItem,
    onNextContext,
    onMute,
    onUnmute,
    muted,
    playing,
}) {
    return (
        <div className="NavPlayer row">
            <div className="col-xs-7">
                <a onClick={onPreviousContext} title="Previous Show">
                    <i className="material-icons">first_page</i>
                </a>
                <a onClick={onPreviousItem} title="Previous Item">
                    <i className="material-icons">chevron_left</i>
                </a>
                {playing &&
                    <a onClick={onPause} title="Play/Pause">
                        <i className="material-icons">pause</i>
                    </a>
                ||
                    <a onClick={onPlay} title="Play/Pause">
                        <i className="material-icons">play_arrow</i>
                    </a>
                }
                <a onClick={onNextItem} title="Next Item">
                    <i className="material-icons">chevron_right</i>
                </a>
                <a onClick={onNextContext} title="Next Show">
                    <i className="material-icons">last_page</i>
                </a>
                {muted &&
                    <a onClick={onUnmute} title="Mute on/off">
                        <i className="material-icons">volume_mute</i>
                    </a>
                ||
                    <a onClick={onMute} title="Mute on/off">
                        <i className="material-icons">volume_up</i>
                    </a>
                }
            </div>
        </div>
    )
}

NavPlayer.propTypes = {
    onPreviousContext: React.PropTypes.func,
    onPreviousItem: React.PropTypes.func,
    onPlay: React.PropTypes.func,
    onPause: React.PropTypes.func,
    onNextItem: React.PropTypes.func,
    onNextContext: React.PropTypes.func,
    onMute: React.PropTypes.func,
    onUnmute: React.PropTypes.func,
    playing: React.PropTypes.bool,
    muted: React.PropTypes.bool,
}
