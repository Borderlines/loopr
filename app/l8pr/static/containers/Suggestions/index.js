import React from 'react'
import { connect } from 'react-redux'
import './style.scss'
import { search } from '../../actions/search'

const suggestions = [
    {
        title: 'ben',
        keywords: ['@ben'],
        type: 'your collection',
        style: "Suggestions__item Suggestions--user",
        icon: '',
    },
    {
        title: 'your inbox',
        keywords: ['#my-last-tracks'],
        type: '10 latest Media',
        style: "Suggestions__item Suggestions--inbox",
        icon: 'move_to_inbox',
    },
    {
        title: 'your favorites',
        keywords: ['@vied12','@hejorama','@Lukas'],
        type: 'users you follow',
        style: "Suggestions__item Suggestions--favUsers",
        icon: 'bookmark_border',
    },
    {
        title: 'all your Hip Hop',
        keywords: ['@ben hip hop'],
        type: 'Thema Selecta',
        style: "Suggestions__item Suggestions--selectaHiphop",
        icon: 'mic',
    },
    {
        title: 'documentaries',
        keywords: ['#docu'],
        type: 'Thema Selecta',
        style: "Suggestions__item Suggestions--selectaDocu",
        icon: 'pets',
    },
]

function Suggestions({ onSearch }) {
    const classes = [
        'Suggestions',
    ].join(' ')
    return (
        <div className={classes}>
            {suggestions.map((s, i) => (
                <div key={i} className={s.style} onClick={() => (onSearch(s.keywords))}>
                <div>
                    <div><i className="material-icons">{s.icon}</i></div>
                    <div className="suggestion__title"><a>{s.title}</a></div>
                    <div>{s.type}</div>
                    </div>
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
