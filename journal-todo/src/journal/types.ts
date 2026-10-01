export type Level = 1 | 2 | 3 | 4 | 5

export interface JournalEntry {
  id: string
  /** Local calendar day, "YYYY-MM-DD". */
  date: string
  title: string
  body: string
  mood: Level | null
  energy: Level | null
  /** Hours slept the night before. */
  sleep: number | null
  activities: string[]
  gratitude: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

export type EntryInput = Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>
