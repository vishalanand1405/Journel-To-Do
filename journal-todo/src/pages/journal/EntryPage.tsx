import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon } from '../../components/Icons'
import { activityOf, energyOf, moodOf } from '../../journal/constants'
import { wordCount } from '../../journal/entry'
import { useJournal } from '../../journal/useJournal'
import { formatLongDate, relativeDayLabel, todayISO } from '../../lib/dates'
import EntryNotFound from './EntryNotFound'

export default function EntryPage() {
  const { id = '' } = useParams()
  const { entries, deleteEntry } = useJournal()
  const navigate = useNavigate()
  const [today] = useState(todayISO)

  const index = entries.findIndex((e) => e.id === id)
  const entry = entries[index]
  if (!entry) return <EntryNotFound />

  // `entries` is newest first.
  const newer = entries[index - 1]
  const older = entries[index + 1]
  const mood = entry.mood ? moodOf(entry.mood) : null
  const energy = entry.energy ? energyOf(entry.energy) : null
  const activities = entry.activities.map(activityOf).filter((a) => a !== undefined)
  const relative = relativeDayLabel(entry.date, today)
  const words = wordCount(entry.body)

  const remove = () => {
    navigate('/journal')
    deleteEntry(entry.id)
  }

  return (
    <div className="page">
      <div className="page-toolbar">
        <Link to="/journal" className="back-link">
          <ArrowLeftIcon width={16} height={16} />
          Journal
        </Link>
        <div className="toolbar-actions">
          <Link to={`/journal/${entry.id}/edit`} className="btn btn-ghost small">
            <PencilIcon width={15} height={15} />
            Edit
          </Link>
          <button type="button" className="btn btn-ghost btn-danger small" onClick={remove}>
            <TrashIcon width={15} height={15} />
            Delete
          </button>
        </div>
      </div>

      <article className="entry-view">
        <header className="entry-head">
          <p className="eyebrow">
            {relative && <>{relative} · </>}
            {formatLongDate(entry.date)}
          </p>
          <h1 className="entry-title">{entry.title || 'Untitled'}</h1>
          {mood && (
            <span className={`mood-badge mood-${mood.value}`}>
              <span aria-hidden="true">{mood.emoji}</span> Feeling {mood.label.toLowerCase()}
            </span>
          )}
        </header>

        {entry.body.trim() ? (
          <div className="entry-body">{entry.body}</div>
        ) : (
          <p className="entry-body muted">No words today — and that's okay.</p>
        )}

        {(energy || entry.sleep !== null || activities.length > 0) && (
          <dl className="facts">
            {energy && (
              <div className="fact">
                <dt>Energy</dt>
                <dd>
                  <span className="meter" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} className={n <= energy.value ? 'on' : ''} />
                    ))}
                  </span>
                  {energy.label}
                </dd>
              </div>
            )}
            {entry.sleep !== null && (
              <div className="fact">
                <dt>Sleep</dt>
                <dd>
                  {entry.sleep} {entry.sleep === 1 ? 'hour' : 'hours'}
                </dd>
              </div>
            )}
            {activities.length > 0 && (
              <div className="fact fact-wide">
                <dt>Activities</dt>
                <dd className="chips">
                  {activities.map((a) => (
                    <span key={a.id} className="chip static">
                      <span aria-hidden="true">{a.emoji}</span>
                      {a.label}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        )}

        {entry.gratitude.trim() && (
          <blockquote className="gratitude">
            <span className="gratitude-label">Grateful for</span>
            {entry.gratitude}
          </blockquote>
        )}

        <footer className="entry-foot">
          {entry.tags.length > 0 && (
            <div className="tags">
              {entry.tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <span className="entry-words">
            {words} {words === 1 ? 'word' : 'words'}
          </span>
        </footer>
      </article>

      {(newer || older) && (
        <nav className="pager" aria-label="More entries">
          {older ? (
            <Link to={`/journal/${older.id}`} className="pager-link">
              <ChevronLeftIcon width={16} height={16} />
              <span>
                <small>Older</small>
                {older.title || 'Untitled'}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link to={`/journal/${newer.id}`} className="pager-link next">
              <span>
                <small>Newer</small>
                {newer.title || 'Untitled'}
              </span>
              <ChevronRightIcon width={16} height={16} />
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
