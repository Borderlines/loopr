import React from 'react'
import './style.scss'

export default class QuickAddShow extends React.Component {

    constructor(props) {
        super(props)
        this.state = { value: '' }
    }

    handleChange(event) {
        this.setState({ value: event.target.value })
    }

    handleSubmit(event) {
        event.preventDefault()
        this.props.onSubmit(this.state.value)
        this.setState({ value: '' })
    }

    render() {
        const { className } = this.props
        const { value } = this.state
        const classes = [
            'QuickAddShow',
            className,
        ].join(' ')
        return (
            <div className={classes}>
                <i className="material-icons" onClick={(e) => this.handleSubmit(e)}>add_circle</i>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <input
                        type="text"
                        autoFocus={true}
                        className="line-input"
                        placeholder="Create a new Show"
                        value={value}
                        onChange={(e) => this.handleChange(e)}/>
                </form>
            </div>
        )
    }
}

QuickAddShow.propTypes = {
    className: React.PropTypes.string,
    onSubmit: React.PropTypes.func.isRequired,
}
