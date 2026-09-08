import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  theme: Theme
  effectiveTheme: 'light' | 'dark'
  toggleTheme: (event?: React.MouseEvent | MouseEvent) => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const TRANSITION_MS = 500

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'auto'

  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light' || saved === 'auto') {
      return saved as Theme
    }
  } catch (e) {
    console.error('Error reading theme from localStorage:', e)
  }

  return 'auto'
}

const getEffectiveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'auto') {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }
  return theme
}

const applyTheme = (effectiveTheme: 'light' | 'dark') => {
  if (typeof window === 'undefined') return

  const root = document.documentElement

  if (effectiveTheme === 'dark') {
    root.classList.add('dark')
    root.setAttribute('data-theme', 'dark')
  } else {
    root.classList.remove('dark')
    root.setAttribute('data-theme', 'light')
  }

  root.style.colorScheme = effectiveTheme
}

const enableThemeTransition = () => {
  const root = document.documentElement
  root.classList.add('theme-transitioning')
  window.setTimeout(() => {
    root.classList.remove('theme-transitioning')
  }, TRANSITION_MS)
}

const setRevealOrigin = (event?: React.MouseEvent | MouseEvent) => {
  const root = document.documentElement
  const x = event?.clientX ?? window.innerWidth - 40
  const y = event?.clientY ?? 40
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  root.style.setProperty('--vt-x', `${x}px`)
  root.style.setProperty('--vt-y', `${y}px`)
  root.style.setProperty('--vt-r', `${Math.ceil(endRadius)}px`)
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() =>
    getEffectiveTheme(getInitialTheme())
  )
  const themeRef = useRef(theme)
  themeRef.current = theme

  useEffect(() => {
    const newEffectiveTheme = getEffectiveTheme(theme)
    setEffectiveTheme(newEffectiveTheme)
    applyTheme(newEffectiveTheme)

    try {
      localStorage.setItem('theme', theme)
    } catch (e) {
      console.error('Error saving theme to localStorage:', e)
    }
  }, [theme])

  useEffect(() => {
    if (theme === 'auto' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const handleChange = (e: MediaQueryListEvent) => {
        const newEffectiveTheme = e.matches ? 'dark' : 'light'
        enableThemeTransition()
        setEffectiveTheme(newEffectiveTheme)
        applyTheme(newEffectiveTheme)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  const toggleTheme = React.useCallback((event?: React.MouseEvent | MouseEvent) => {
    const current = getEffectiveTheme(themeRef.current)
    const next = current === 'dark' ? 'light' : 'dark'

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const commitTheme = () => {
      // DOM only — Tailwind dark: styles flip instantly from the html class.
      // Avoid flushSync / heavy React work here so View Transitions don't hitch.
      applyTheme(next)
      try {
        localStorage.setItem('theme', next)
      } catch {
        /* ignore */
      }
      setThemeState(next)
      setEffectiveTheme(next)
    }

    if (prefersReducedMotion) {
      commitTheme()
      return
    }

    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => {
        finished: Promise<void>
        ready: Promise<void>
      }
    }

    if (typeof doc.startViewTransition === 'function') {
      const root = document.documentElement
      setRevealOrigin(event)
      root.setAttribute('data-theme-vt', 'active')

      const transition = doc.startViewTransition(() => {
        // DOM class flip only in the critical path — no flushSync.
        // React state is scheduled and paints after the new snapshot.
        applyTheme(next)
        try {
          localStorage.setItem('theme', next)
        } catch {
          /* ignore */
        }
        setThemeState(next)
        setEffectiveTheme(next)
      })

      transition.finished.finally(() => {
        root.removeAttribute('data-theme-vt')
      })
      return
    }

    enableThemeTransition()
    commitTheme()
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
