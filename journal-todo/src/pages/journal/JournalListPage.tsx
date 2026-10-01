import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PlusIcon, SearchIcon } from '../../components/Icons'
import EntryCard from '../../components/journal/EntryCard'
import MoodTrend from '../../components/journal/MoodTrend'
import { activityOf, MOODS, moodOf } from '../../journal/constants'
import { hasContent } from '../../journal/entry'
import { averageMood, computeStreak, moodByDay } from '../../journal/insights'
import { clearDraft, loadDraft } from '../../journal/storage'
import type { JournalEntry, Level } from '../../journal/types'
import { useJournal } from '../../journal/useJournal'
import { addDays, formatMonth, greetingFor, todayISO } from '../../lib/dates'

function searchableText(entry: JournalEntry): string {
  const activities = entry.activities.map((id) => activityOf(id)?.label ?? id)
  return [entry.title, entry.body, entry.gratitude, ...entry.tags, ...activities].join(' ').toLowerCase()
}

function groupByMonth(entries: JournalEntry[]) {
  const groups: { key: string; label: string; entries: JournalEntry[] }[] = []
  for (const entry of entries) {
    const key = entry.date.slice(0, 7)
    const last = groups.at(-1)
    if (last?.key === key) last.entries.push(entry)
    else groups.push({ key, label: formatMonth(entry.date), entries: [entry] })
  }
  return groups
}

export default function JournalListPage() {
  const { entries } = useJournal()
  const navigate = useNavigate()
  const [today] = useState(todayISO)
  const [hour] = useState(() => new Date().getHours())
  const [draft, setDraft] = useState(() => {
    const saved = loadDraft()
    return saved && hasContent(saved) ? saved : null
  })
  const [query, setQuery] = useState('')
  const [moodFilter, setMoodFilter] = useState<Level | null>(null)

  // Press "n" anywhere on the page to start a new entry.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'n' || e.metaKey || e.ctrlKey || e.altKey) return
      if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) return
      e.preventDefault()
      navigate('/journal/new')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  const stats = useMemo(() => {
    const avg = averageMood(entries, addDays(today, -29))
    return {
      streak: computeStreak(entries, today),
      avgMood: avg === null ? null : moodOf(Math.round(avg) as Level),
      wroteToday: entries.some((e) => e.date === today),
    }
  }, [entries, today])

  const trend = useMemo(() => moodByDay(entries, today, 14), [entries, today])

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = entries.filter(
      (e) => (moodFilter === null || e.mood === moodFilter) && (!q || searchableText(e).includes(q)),
    )
    return groupByMonth(filtered)
  }, [entries, query, moodFilter])

  const discardDraft = () => {
    clearDraft()
    setDraft(null)
  }

  const isFiltering = query.trim() !== '' || moodFilter !== null

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{greetingFor(hour)}</p>
          <h1 className="page-title">Journal</h1>
          <p className="page-subtitle">
            {stats.wroteToday ? "You've written today — nice work." : 'How is your day going? Take a minute to check in.'}
          </p>
        </div>
        <Link to="/journal/new" className="btn btn-primary" title="New entry (N)">
          <PlusIcon width={16} height={16} />
          New entry
        </Link>
      </header>

      {draft && (
        <div className="banner">
          <span>
            You have an unfinished entry{draft.title.trim() && <> — <strong>{draft.title.trim()}</strong></>}.
          </span>
          <div className="banner-actions">
            <button type="button" className="btn btn-ghost small" onClick={discardDraft}>
              Discard
            </button>
            <Link to="/journal/new" className="btn btn-secondary small">
              Continue writing
            </Link>
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-emoji" aria-hidden="true">
            📝
          </div>
          <h2>Your journal is empty</h2>
          <p>Write a few lines, log how you feel, and watch patterns appear over time.</p>
          <Link to="/journal/new" className="btn btn-primary">
            <PlusIcon width={16} height={16} />
            Write your first entry
          </Link>
        </div>
      ) : (
        <>
          <section className="insights" aria-label="Insights">
            <div className="stat">
              <span className="stat-value">{entries.length}</span>
              <span className="stat-label">{entries.length === 1 ? 'Entry' : 'Entries'}</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {stats.streak}
                {stats.streak > 0 && <span aria-hidden="true"> 🔥</span>}
              </span>
              <span className="stat-label">Day streak</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {stats.avgMood ? (
                  <>
                    <span aria-hidden="true">{stats.avgMood.emoji}</span> {stats.avgMood.label}
                  </>
                ) : (
                  '—'
                )}
              </span>
              <span className="stat-label">Avg mood · 30 days</span>
            </div>
            <div className="stat stat-wide">
              <span className="stat-label">Mood · last 14 days</span>
              <MoodTrend days={trend} />
            </div>
          </section>

          <div className="toolbar">
            <label className="search">
              <SearchIcon width={16} height={16} />
              <span className="visually-hidden">Search entries</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search entries, tags, activities…"
              />
            </label>
            <div className="mood-filter" role="group" aria-label="Filter by mood">
              <button
                type="button"
                className={`chip${moodFilter === null ? ' selected' : ''}`}
                aria-pressed={moodFilter === null}
                onClick={() => setMoodFilter(null)}
              >
                All
              </button>
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  className={`chip chip-icon${moodFilter === m.value ? ' selected' : ''}`}
                  aria-pressed={moodFilter === m.value}
                  aria-label={m.label}
                  title={m.label}
                  onClick={() => setMoodFilter(moodFilter === m.value ? null : m.value)}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>

          {groups.length === 0 ? (
            <div className="empty-state compact">
              <p>No entries match{isFiltering ? ' your filters' : ''}.</p>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setQuery('')
                  setMoodFilter(null)
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            groups.map((group) => (
              <section key={group.key} className="month-group">
                <h2 className="month-label">
                  {group.label}
                  <span>{group.entries.length}</span>
                </h2>
                <div className="entry-list">
                  {group.entries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </section>
            ))
          )}
        </>
      )}
    </div>
  )
}
