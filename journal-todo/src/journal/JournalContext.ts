import { createContext } from 'react'
import type { EntryInput, JournalEntry } from './types'

export interface JournalContextValue {
  /** Newest first. */
  entries: JournalEntry[]
  /** Every tag used so far, most frequent first. */
  allTags: string[]
  getEntry: (id: string) => JournalEntry | undefined
  addEntry: (input: EntryInput) => JournalEntry
  updateEntry: (id: string, input: EntryInput) => void
  deleteEntry: (id: string) => void
  lastDeleted: JournalEntry | null
  undoDelete: () => void
  dismissUndo: () => void
}

export const JournalContext = createContext<JournalContextValue | null>(null)
