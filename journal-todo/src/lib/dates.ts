// Entry dates are stored as local calendar days ("YYYY-MM-DD") so they never shift with time zones.

const pad = (n: number) => String(n).padStart(2, '0')

export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(iso: string, days: number): string {
  const date = parseISODate(iso)
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

export function formatLongDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatMonth(iso: string): string {
  return parseISODate(iso).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

export function formatShortDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function weekdayShort(iso: string): string {
  return parseISODate(iso).toLocaleDateString(undefined, { weekday: 'short' })
}

export function dayOfMonth(iso: string): number {
  return parseISODate(iso).getDate()
}

export function relativeDayLabel(iso: string, today: string): string | null {
  if (iso === today) return 'Today'
  if (iso === addDays(today, -1)) return 'Yesterday'
  return null
}

export function greetingFor(hour: number): string {
  if (hour < 5) return 'Still up'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
