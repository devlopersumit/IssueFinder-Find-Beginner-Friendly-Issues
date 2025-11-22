import { useState, useEffect } from 'react'

const SAVED_ISSUES_KEY = 'issueFinder_savedIssues'

export type SavedIssue = {
  id: number
  html_url: string
  title: string
  repository_url: string
  number: number
  created_at: string
  savedAt: number
}

export function useSavedIssues() {
  const [savedIssues, setSavedIssues] = useState<SavedIssue[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_ISSUES_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setSavedIssues(parsed)
        }
      }
    } catch (err) {
    }
  }, [])

  const saveIssue = (issue: Omit<SavedIssue, 'savedAt'>) => {
    setSavedIssues((prev) => {
      if (prev.some((item) => item.id === issue.id)) {
        return prev
      }
      const newIssues = [...prev, { ...issue, savedAt: Date.now() }]
      try {
        localStorage.setItem(SAVED_ISSUES_KEY, JSON.stringify(newIssues))
      } catch (err) {
      }
      return newIssues
    })
  }

  const removeIssue = (issueId: number) => {
    setSavedIssues((prev) => {
      const newIssues = prev.filter((item) => item.id !== issueId)
      try {
        localStorage.setItem(SAVED_ISSUES_KEY, JSON.stringify(newIssues))
      } catch (err) {
      }
      return newIssues
    })
  }

  const isSaved = (issueId: number) => {
    return savedIssues.some((item) => item.id === issueId)
  }

  const clearAll = () => {
    setSavedIssues([])
    try {
      localStorage.removeItem(SAVED_ISSUES_KEY)
    } catch (err) {
    }
  }

  return { savedIssues, saveIssue, removeIssue, isSaved, clearAll }
}

