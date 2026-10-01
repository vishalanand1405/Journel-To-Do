import { addDays } from '../lib/dates'
import type { JournalEntry } from './types'

/** Consecutive days with at least one entry, ending today (or yesterday, so the streak survives until you write). */
export function computeStreak(entries: JournalEntry[], today: string): number {
  const days = new Set(entries.map((e) => e.date))
  let cursor = days.has(today) ? today : addDays(today, -1)
  let streak = 0
  while (days.has(cursor)) {
    streak++
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function averageMood(entries: JournalEntry[], since: string): number | null {
  const moods = entries.filter((e) => e.date >= since && e.mood !== null).map((e) => e.mood as number)
  if (!moods.length) return null
  return moods.reduce((sum, m) => sum + m, 0) / moods.length
}

export interface DayMood {
  date: string
  mood: number | null
}

/** Average mood per day for the last `days` days, oldest first. */
export function moodByDay(entries: JournalEntry[], today: string, days: number): DayMood[] {
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(today, i - days + 1)
    const moods = entries.filter((e) => e.date === date && e.mood !== null).map((e) => e.mood as number)
    return { date, mood: moods.length ? moods.reduce((s, m) => s + m, 0) / moods.length : null }
  })
}
