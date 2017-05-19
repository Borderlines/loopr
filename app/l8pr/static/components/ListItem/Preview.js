import React from 'react'

function Preview({ image }) {
    return (
        <div className="ListItem__preview" style={{ backgroundImage: `url(${image})` }}>
            <i className="material-icons">playlist_play</i>
            <i className="material-icons">play_arrow</i>
        </div>
    )
}

Preview.propTypes = { image: React.PropTypes.string.isRequired }

export default Preview
