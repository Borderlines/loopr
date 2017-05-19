import React from 'react'
import { connect } from 'react-redux'
import './style.scss'
import { search } from '../../actions/search'

const suggestions = [
    {
        title: '@ben',
        keywords: ['@ben'],
    },
    {
        title: 'the 10 last Media you added',
        keywords: ['#my-last-tracks'],
    },
    {
        title: '#docu',
        keywords: ['docu'],
    },
]

function Suggestions({ onSearch }) {
    const classes = [
        'Suggestions',
    ].join(' ')
    return (
        <div className={classes}>
            {suggestions.map((s, i) => (
                <div key={i} className="Suggestions__item" onClick={() => (onSearch(s.keywords))}>
                    <a><i className="material-icons">face</i><br/>{s.title}</a>
                </div>
            ))}
        </div>
    )
}

Suggestions.propTypes = {
    onSearch: React.PropTypes.func,
}

const mapDispatchToProps = (dispatch) => ({
    onSearch: (searchTerms) => dispatch(
        search(searchTerms.map((t) => ({
            label: t,
            value: t,
        })))
    ),
})

export default connect(null, mapDispatchToProps)(Suggestions)
