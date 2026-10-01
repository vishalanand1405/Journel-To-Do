import type { EntryInput, JournalEntry } from './types'

export function emptyEntry(date: string): EntryInput {
  return {
    date,
    title: '',
    body: '',
    mood: null,
    energy: null,
    sleep: null,
    activities: [],
    gratitude: '',
    tags: [],
  }
}

export function toInput(entry: JournalEntry): EntryInput {
  return {
    date: entry.date,
    title: entry.title,
    body: entry.body,
    mood: entry.mood,
    energy: entry.energy,
    sleep: entry.sleep,
    activities: entry.activities,
    gratitude: entry.gratitude,
    tags: entry.tags,
  }
}

/** True when the user has written or picked anything worth keeping. */
export function hasContent(input: EntryInput): boolean {
  return Boolean(
    input.title.trim() ||
      input.body.trim() ||
      input.gratitude.trim() ||
      input.mood !== null ||
      input.energy !== null ||
      input.sleep !== null ||
      input.activities.length ||
      input.tags.length,
  )
}

export function wordCount(text: string): number {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}
