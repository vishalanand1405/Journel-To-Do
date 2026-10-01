import type { ScaleOption } from '../../journal/constants'
import type { Level } from '../../journal/types'

interface ScalePickerProps {
  label: string
  options: ScaleOption[]
  value: Level | null
  onChange: (value: Level | null) => void
  /** "mood" tints each option with its mood colour; "plain" uses the accent. */
  variant?: 'mood' | 'plain'
}

/** A row of 1–5 choices. Clicking the selected option again clears it. */
export default function ScalePicker({ label, options, value, onChange, variant = 'mood' }: ScalePickerProps) {
  return (
    <div className={`scale scale-${variant}`} role="radiogroup" aria-label={label}>
      {options.map((option) => {
        const selected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`scale-option mood-${option.value}${selected ? ' selected' : ''}`}
            onClick={() => onChange(selected ? null : option.value)}
          >
            <span className="scale-emoji" aria-hidden="true">
              {option.emoji}
            </span>
            <span className="scale-label">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
