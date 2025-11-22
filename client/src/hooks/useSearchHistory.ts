import { useState, useEffect } from 'react'

const SEARCH_HISTORY_KEY = 'issueFinder_searchHistory'
const MAX_HISTORY_ITEMS = 10

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setHistory(parsed)
        }
      }
    } catch (err) {
    }
  }, [])

  const addToHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return
    
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== searchTerm.toLowerCase().trim())
      const newHistory = [searchTerm.trim(), ...filtered].slice(0, MAX_HISTORY_ITEMS)
      
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
      } catch (err) {
      }
      
      return newHistory
    })
  }

  const clearHistory = () => {
    setHistory([])
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY)
    } catch (err) {
    }
  }

  return { history, addToHistory, clearHistory }
}

