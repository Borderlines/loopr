import React from 'react'
import './style.scss'

export default function LoopItem({ item }) {
    return (
        <div className="LoopItem">
            <div>
                <h2>{item.title}</h2>
                <span>{item.description}</span>
            </div>
            <div>
                <img className="img-responsive" src={item.items[0].thumbnail}/>
            </div>
        </div>
    )
}

LoopItem.propTypes = {
    item: React.PropTypes.object.isRequired
}
