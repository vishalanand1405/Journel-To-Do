import { useEffect, useState } from 'react'
import { MonitorIcon, MoonIcon, SunIcon } from './Icons'

type Theme = 'system' | 'light' | 'dark'

// Keep in sync with the inline script in index.html, which applies the theme before first paint.
const THEME_KEY = 'notebook.theme'
const NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    return 'system'
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') delete root.dataset.theme
    else root.dataset.theme = theme
    try {
      if (theme === 'system') localStorage.removeItem(THEME_KEY)
      else localStorage.setItem(THEME_KEY, theme)
    } catch {
      // Ignore unavailable storage.
    }
  }, [theme])

  const next = NEXT[theme]
  const label = `Theme: ${theme}. Switch to ${next}.`

  return (
    <button type="button" className="icon-btn" onClick={() => setTheme(next)} aria-label={label} title={label}>
      {theme === 'light' ? <SunIcon /> : theme === 'dark' ? <MoonIcon /> : <MonitorIcon />}
    </button>
  )
}
