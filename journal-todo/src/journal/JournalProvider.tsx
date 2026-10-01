import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { JournalContext, type JournalContextValue } from './JournalContext'
import { loadEntries, saveEntries } from './storage'
import type { EntryInput, JournalEntry } from './types'

export function JournalProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>(loadEntries)
  const [lastDeleted, setLastDeleted] = useState<JournalEntry | null>(null)

  useEffect(() => {
    saveEntries(entries)
  }, [entries])

  const addEntry = useCallback((input: EntryInput) => {
    const now = Date.now()
    const entry: JournalEntry = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
    setEntries((prev) => [entry, ...prev])
    return entry
  }, [])

  const updateEntry = useCallback((id: string, input: EntryInput) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...input, updatedAt: Date.now() } : e)))
  }, [])

  const deleteEntry = useCallback(
    (id: string) => {
      const target = entries.find((e) => e.id === id)
      if (!target) return
      setEntries((prev) => prev.filter((e) => e.id !== id))
      setLastDeleted(target)
    },
    [entries],
  )

  const undoDelete = useCallback(() => {
    if (!lastDeleted) return
    const restored = lastDeleted
    setEntries((prev) => (prev.some((e) => e.id === restored.id) ? prev : [restored, ...prev]))
    setLastDeleted(null)
  }, [lastDeleted])

  const dismissUndo = useCallback(() => setLastDeleted(null), [])

  const value = useMemo<JournalContextValue>(() => {
    const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)

    const tagCounts = new Map<string, number>()
    for (const entry of entries) {
      for (const tag of entry.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
    }
    const allTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag)

    return {
      entries: sorted,
      allTags,
      getEntry: (id) => entries.find((e) => e.id === id),
      addEntry,
      updateEntry,
      deleteEntry,
      lastDeleted,
      undoDelete,
      dismissUndo,
    }
  }, [entries, lastDeleted, addEntry, updateEntry, deleteEntry, undoDelete, dismissUndo])

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
}
