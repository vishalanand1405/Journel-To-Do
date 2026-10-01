import { todayISO } from '../lib/dates'
import { emptyEntry } from './entry'
import type { EntryInput, JournalEntry } from './types'

const ENTRIES_KEY = 'notebook.journal.entries'
const DRAFT_KEY = 'notebook.journal.draft'

function read(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage is full or unavailable (e.g. private mode); keep working in memory.
  }
}

function remove(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Ignore unavailable storage.
  }
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

export function loadEntries(): JournalEntry[] {
  const data = read(ENTRIES_KEY)
  if (!Array.isArray(data)) return []
  // Fill in defaults so entries saved by older versions still render.
  return data.filter(isObject).map((item) => ({
    ...emptyEntry(todayISO()),
    id: crypto.randomUUID(),
    createdAt: 0,
    updatedAt: 0,
    ...(item as Partial<JournalEntry>),
  }))
}

export function saveEntries(entries: JournalEntry[]) {
  write(ENTRIES_KEY, entries)
}

export function loadDraft(): EntryInput | null {
  const data = read(DRAFT_KEY)
  return isObject(data) ? { ...emptyEntry(todayISO()), ...(data as Partial<EntryInput>) } : null
}

export function saveDraft(draft: EntryInput) {
  write(DRAFT_KEY, draft)
}

export function clearDraft() {
  remove(DRAFT_KEY)
}
