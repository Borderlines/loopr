import React from 'react'
import { LoopItem } from '../index'
import './style.scss'

export default class Loop extends React.Component {
    constructor(props) {
        super()
        this.state = {
            offset: 0,
            perPage: 3,
        }
    }
    previous() {
        this.setState({ offset: this.state.offset - (this.state.perPage - 1) })
    }
    next() {
        this.setState({ offset: this.state.offset + (this.state.perPage - 1) })
    }
    render() {
        const items = this.props.items.slice(this.state.offset, this.state.offset + this.state.perPage)
        return (
            <div className="Loop">
                <div className="Loop__nav Loop__nav--prev" onClick={this.previous.bind(this)}>
                    <i className="material-icons pmd-md">navigate_before</i>
                </div>
                <ul>
                    {items.map(i => (
                        <li key={i.id} style={{width: (1/this.state.perPage) * 100 + '%'}}>
                            <LoopItem item={i}/>
                        </li>
                    ))}
                </ul>
                <div className="Loop__nav Loop__nav--next" onClick={this.next.bind(this)}>
                    <i className="material-icons pmd-md">navigate_next</i>
                </div>
            </div>
        )
    }
}

Loop.propTypes = {
    items: React.PropTypes.array.isRequired
}
