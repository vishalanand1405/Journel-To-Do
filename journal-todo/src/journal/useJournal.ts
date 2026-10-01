import { useContext } from 'react'
import { JournalContext } from './JournalContext'

export function useJournal() {
  const value = useContext(JournalContext)
  if (!value) throw new Error('useJournal must be used inside <JournalProvider>')
  return value
}
