import { useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { ACTIVITIES, ENERGY, MOODS, PROMPTS } from '../../journal/constants'
import { hasContent, wordCount } from '../../journal/entry'
import type { EntryInput } from '../../journal/types'
import { useJournal } from '../../journal/useJournal'
import { CalendarIcon } from '../Icons'
import ScalePicker from './ScalePicker'
import TagInput from './TagInput'

interface EntryFormProps {
  initial: EntryInput
  submitLabel: string
  onSubmit: (input: EntryInput) => void
  onCancel: () => void
  /** Called after every edit, e.g. to autosave a draft. */
  onChange?: (input: EntryInput) => void
  /** Shown next to the date, e.g. "Draft saved". */
  status?: ReactNode
}

const randomPrompt = () => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]

const hasDetails = (input: EntryInput) =>
  input.energy !== null || input.sleep !== null || input.activities.length > 0 || input.gratitude.trim() !== '' || input.tags.length > 0

export default function EntryForm({ initial, submitLabel, onSubmit, onCancel, onChange, status }: EntryFormProps) {
  const { allTags } = useJournal()
  const [form, setForm] = useState(initial)
  const [prompt] = useState(randomPrompt)
  const [detailsOpen] = useState(() => hasDetails(initial))
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  // Grow the writing area with its content instead of scrolling inside it.
  useLayoutEffect(() => {
    const el = bodyRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [form.body])

  const update = (patch: Partial<EntryInput>) => {
    const next = { ...form, ...patch }
    setForm(next)
    onChange?.(next)
  }

  const canSave = hasContent(form)
  const words = wordCount(form.body)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (canSave) onSubmit(form)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      if (canSave) onSubmit(form)
    }
  }

  const toggleActivity = (id: string) =>
    update({
      activities: form.activities.includes(id) ? form.activities.filter((a) => a !== id) : [...form.activities, id],
    })

  return (
    <form className="entry-form" onSubmit={submit} onKeyDown={onKeyDown}>
      <div className="form-top">
        <label className="date-field">
          <CalendarIcon width={16} height={16} />
          <span className="visually-hidden">Entry date</span>
          <input type="date" value={form.date} required onChange={(e) => e.target.value && update({ date: e.target.value })} />
        </label>
        {status}
      </div>

      <input
        className="title-input"
        value={form.title}
        onChange={(e) => update({ title: e.target.value })}
        placeholder="Untitled"
        aria-label="Title"
        autoFocus
      />

      <section className="field">
        <h2 className="field-label">How are you feeling?</h2>
        <ScalePicker label="Mood" options={MOODS} value={form.mood} onChange={(mood) => update({ mood })} />
      </section>

      <section className="field">
        <textarea
          ref={bodyRef}
          className="body-input"
          value={form.body}
          onChange={(e) => update({ body: e.target.value })}
          placeholder={prompt}
          aria-label="Entry"
          rows={6}
        />
        <div className="word-count">
          {words} {words === 1 ? 'word' : 'words'}
        </div>
      </section>

      <details className="details" open={detailsOpen}>
        <summary>
          <span>More about your day</span>
          <span className="details-hint">Energy, sleep, activities, gratitude, tags</span>
        </summary>

        <div className="details-body">
          <section className="field">
            <h3 className="field-label">Energy</h3>
            <ScalePicker
              label="Energy"
              options={ENERGY}
              value={form.energy}
              onChange={(energy) => update({ energy })}
              variant="plain"
            />
          </section>

          <section className="field">
            <label className="field-label" htmlFor="sleep">
              Sleep
            </label>
            <div className="number-field">
              <input
                id="sleep"
                type="number"
                min={0}
                max={24}
                step={0.5}
                inputMode="decimal"
                value={form.sleep ?? ''}
                placeholder="—"
                onChange={(e) => {
                  const value = e.target.value === '' ? null : Math.min(24, Math.max(0, Number(e.target.value)))
                  update({ sleep: value })
                }}
              />
              <span>hours last night</span>
            </div>
          </section>

          <section className="field">
            <h3 className="field-label">What did you do?</h3>
            <div className="chips">
              {ACTIVITIES.map((activity) => {
                const selected = form.activities.includes(activity.id)
                return (
                  <button
                    key={activity.id}
                    type="button"
                    className={`chip${selected ? ' selected' : ''}`}
                    aria-pressed={selected}
                    onClick={() => toggleActivity(activity.id)}
                  >
                    <span aria-hidden="true">{activity.emoji}</span>
                    {activity.label}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="field">
            <label className="field-label" htmlFor="gratitude">
              Grateful for
            </label>
            <textarea
              id="gratitude"
              className="text-area"
              rows={2}
              value={form.gratitude}
              onChange={(e) => update({ gratitude: e.target.value })}
              placeholder="One small thing that went right…"
            />
          </section>

          <section className="field">
            <label className="field-label" htmlFor="tags">
              Tags
            </label>
            <TagInput id="tags" tags={form.tags} suggestions={allTags} onChange={(tags) => update({ tags })} />
          </section>
        </div>
      </details>

      <div className="form-actions">
        <span className="shortcut-hint">
          <kbd>⌘</kbd>
          <kbd>Enter</kbd> to save
        </span>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={!canSave}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
