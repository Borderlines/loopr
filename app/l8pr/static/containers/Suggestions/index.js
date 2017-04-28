import React from 'react'
import { connect } from 'react-redux'
import './style.scss'
import { search } from '../../actions/search'

const suggestions = [
    {
        title: '#ben',
        keywords: ['ben'],
        background: 'https://ca.slack-edge.com/T0NQSEWNA-U0NQKUMV2-gf3867293040-512',
    },
    {
        title: '#docu',
        keywords: ['docu'],
        background: 'http://i.huffpost.com/gen/2019992/images/o-JOURNALIST-facebook.jpg',
    },
]

function Suggestions({ onSearch }) {
    const classes = [
        'Suggestions',
    ].join(' ')
    return (
        <div className={classes}>
            {suggestions.map((s, i) => (
                <div
                    key={i}
                    onClick={() => (onSearch(s.keywords))}
                    className="Suggestions__item"
                    style={{ backgroundImage: `url(${s.background})` }}
                >
                    <div>{s.title}</div>
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
