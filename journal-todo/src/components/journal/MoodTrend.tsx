import { moodOf } from '../../journal/constants'
import type { DayMood } from '../../journal/insights'
import type { Level } from '../../journal/types'
import { formatShortDate, weekdayShort } from '../../lib/dates'

/** One bar per day; height and colour follow that day's average mood. */
export default function MoodTrend({ days }: { days: DayMood[] }) {
  return (
    <div className="trend">
      <div className="trend-bars">
        {days.map(({ date, mood }) => {
          const level = mood === null ? null : (Math.round(mood) as Level)
          const label = `${formatShortDate(date)}: ${level ? moodOf(level).label : 'no mood logged'}`
          return (
            <div key={date} className="trend-col" title={label}>
              <span className="visually-hidden">{label}</span>
              {level ? (
                <span className={`trend-bar mood-${level}`} style={{ height: `${(mood! / 5) * 100}%` }} />
              ) : (
                <span className="trend-empty" />
              )}
            </div>
          )
        })}
      </div>
      <div className="trend-axis" aria-hidden="true">
        {days.map(({ date }) => (
          <span key={date}>{weekdayShort(date).charAt(0)}</span>
        ))}
      </div>
    </div>
  )
}
