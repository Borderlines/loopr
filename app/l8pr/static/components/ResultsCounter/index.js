import React from 'react'
import classNames from 'classnames'
import './style.scss'
import { getDuration } from '../../utils'

function ResultsCounter({ results, className }) {
    const counters = {
        users: results.filter((r) => (r.username)).length,
        shows: results.filter((r) => (r.items)).length,
        tracks: results.filter((r) => (r.url)).length,
    }
    return (
        <div className={classNames('ResultsCounter', className)}>
            {counters.users > 0 &&
                <div className="ResultsCounter__counter">
                    {counters.users}&nbsp;user
                    {counters.users > 1 && 's'}
                </div>
            }
            {counters.shows > 0 &&
                <div className="ResultsCounter__counter">
                    {counters.shows}&nbsp;show
                    {counters.shows > 1 && 's'}
                </div>
            }
            {counters.tracks > 0 &&
                <div className="ResultsCounter__counter">
                    {counters.tracks}&nbsp;track
                    {counters.tracks > 1 && 's'}
                </div>
            }
            {getDuration(results)}
        </div>
    )
}

ResultsCounter.propTypes = {
    results: React.PropTypes.array,
    className: React.PropTypes.string,
}

export default ResultsCounter
