import { useState, type KeyboardEvent } from 'react'
import { XIcon } from '../Icons'

interface TagInputProps {
  id?: string
  tags: string[]
  suggestions: string[]
  onChange: (tags: string[]) => void
}

const normalize = (raw: string) => raw.trim().replace(/^#+/, '').replace(/\s+/g, '-').toLowerCase()

export default function TagInput({ id, tags, suggestions, onChange }: TagInputProps) {
  const [draft, setDraft] = useState('')

  const add = (raw: string) => {
    const tag = normalize(raw)
    setDraft('')
    if (tag && !tags.includes(tag)) onChange([...tags, tag])
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add(draft)
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      onChange(tags.slice(0, -1))
    }
  }

  const available = suggestions.filter((s) => !tags.includes(s)).slice(0, 6)

  return (
    <div className="tag-field">
      <div className="tag-input">
        {tags.map((tag) => (
          <span key={tag} className="tag">
            #{tag}
            <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} aria-label={`Remove ${tag}`}>
              <XIcon width={12} height={12} />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => draft && add(draft)}
          placeholder={tags.length ? '' : 'Add a tag and press Enter'}
        />
      </div>
      {available.length > 0 && (
        <div className="tag-suggestions">
          {available.map((tag) => (
            <button key={tag} type="button" className="chip small" onClick={() => add(tag)}>
              + {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
