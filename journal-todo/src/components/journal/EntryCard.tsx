import { Link } from 'react-router-dom'
import { activityOf, moodOf } from '../../journal/constants'
import type { JournalEntry } from '../../journal/types'
import { dayOfMonth, weekdayShort } from '../../lib/dates'

const EXCERPT_LENGTH = 180

export default function EntryCard({ entry }: { entry: JournalEntry }) {
  const mood = entry.mood ? moodOf(entry.mood) : null
  const excerpt = entry.body.trim().slice(0, EXCERPT_LENGTH)
  const activities = entry.activities.map(activityOf).filter((a) => a !== undefined)

  return (
    <Link to={`/journal/${entry.id}`} className={`entry-card${entry.mood ? ` mood-${entry.mood}` : ''}`}>
      <div className="card-date">
        <span className="card-day">{dayOfMonth(entry.date)}</span>
        <span className="card-weekday">{weekdayShort(entry.date)}</span>
      </div>
      <div className="card-main">
        <div className="card-title-row">
          <h3 className="card-title">{entry.title || 'Untitled'}</h3>
          {mood && (
            <span className="card-mood" title={mood.label}>
              <span aria-hidden="true">{mood.emoji}</span>
              <span className="visually-hidden">Mood: {mood.label}</span>
            </span>
          )}
        </div>
        {excerpt && (
          <p className="card-excerpt">
            {excerpt}
            {entry.body.trim().length > EXCERPT_LENGTH && '…'}
          </p>
        )}
        {(activities.length > 0 || entry.tags.length > 0) && (
          <div className="card-meta">
            {activities.map((a) => (
              <span key={a.id} title={a.label} aria-label={a.label}>
                {a.emoji}
              </span>
            ))}
            {entry.tags.map((tag) => (
              <span key={tag} className="card-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
