import React, { useRef, useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useSearch } from '../contexts/SearchContext'
import { useSearchHistory } from '../hooks/useSearchHistory'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'

type HeaderProps = {
  title?: string
  searchTerm: string
  onSearchTermChange: (value: string) => void
  onSubmitSearch: () => void
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'text-ink dark:text-white'
      : 'text-ink-muted hover:text-ink dark:text-zinc-400 dark:hover:text-white'
  }`

const Header: React.FC<HeaderProps> = ({ title = 'IssueFinder', searchTerm, onSearchTermChange, onSubmitSearch }) => {
  const { effectiveTheme, toggleTheme } = useTheme()
  const { isDebouncing, submitSearch } = useSearch()
  const { history, addToHistory } = useSearchHistory()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useKeyboardShortcuts([
    {
      key: 'k',
      ctrlKey: true,
      handler: () => searchInputRef.current?.focus(),
      description: 'Focus search',
    },
    {
      key: 'k',
      metaKey: true,
      handler: () => searchInputRef.current?.focus(),
      description: 'Focus search',
    },
  ])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (term?: string) => {
    const searchValue = term || searchTerm.trim()
    if (searchValue) {
      addToHistory(searchValue)
      submitSearch(searchValue)
      onSubmitSearch()
      setShowSuggestions(false)
      setShowMobileMenu(false)
    }
  }

  const filteredHistory = history.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const navItems = [
    { to: '/issues', label: 'Issues' },
    { to: '/categories', label: 'Categories' },
    { to: '/repositories', label: 'Repos' },
    { to: '/beginner-guide', label: 'Guide' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-paper-line/80 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="font-display text-lg font-semibold tracking-tight text-ink dark:text-white">
            {title}
          </span>
        </Link>

        <nav className="hidden items-center md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="relative min-w-0 flex-1">
          <form
            className="flex items-center gap-2 rounded-md border border-paper-line bg-paper px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            onSubmit={(e) => {
              e.preventDefault()
              handleSearchSubmit()
            }}
          >
            <svg className="h-4 w-4 shrink-0 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                onSearchTermChange(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search issues…"
              className="w-full border-none bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none dark:text-zinc-100"
              aria-label="Search issues"
            />
            {isDebouncing && (
              <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-zinc-300 border-t-accent" />
            )}
            <kbd className="hidden rounded border border-paper-line px-1.5 py-0.5 text-[10px] font-medium text-ink-muted sm:inline dark:border-zinc-700">
              ⌘K
            </kbd>
          </form>
          {showSuggestions && filteredHistory.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-md border border-paper-line bg-white shadow-soft dark:border-zinc-700 dark:bg-zinc-900"
            >
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                Recent
              </div>
              {filteredHistory.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    onSearchTermChange(item)
                    handleSearchSubmit(item)
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <a
            href="https://github.com/sumitjhacodes/IssueFinder-Find-Beginner-Friendly-Issues"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-md border border-paper-line bg-white px-2.5 py-1.5 text-sm font-medium text-ink-soft transition hover:border-zinc-300 hover:text-ink sm:inline-flex dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-white"
            aria-label="Star us on GitHub"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.424 2.865 8.178 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.952 0-1.093.39-1.988 1.03-2.688-.104-.253-.447-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.026 2.748-1.026.546 1.377.203 2.394.1 2.647.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.696-4.566 4.945.359.309.679.92.679 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.019 10.019 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z" clipRule="evenodd" />
            </svg>
            <span>Star us</span>
          </a>
          <button
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="rounded-md p-2 text-ink-muted hover:bg-zinc-100 hover:text-ink md:hidden dark:hover:bg-zinc-800"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setTimeout(toggleTheme, 0)}
            className="rounded-md p-2 text-ink-muted transition hover:bg-zinc-100 hover:text-ink dark:hover:bg-zinc-800"
            aria-label={`Switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {effectiveTheme === 'dark' ? (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {showMobileMenu && (
        <nav className="border-t border-paper-line px-4 py-3 md:hidden dark:border-zinc-800">
          <div className="flex flex-col gap-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setShowMobileMenu(false)}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href="https://github.com/sumitjhacodes/IssueFinder-Find-Beginner-Friendly-Issues"
              target="_blank"
              rel="noreferrer"
              onClick={() => setShowMobileMenu(false)}
              className="px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink dark:text-zinc-400 dark:hover:text-white"
            >
              Star us on GitHub
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Header
