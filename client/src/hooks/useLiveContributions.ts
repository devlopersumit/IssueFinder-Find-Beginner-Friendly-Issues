import { useEffect, useState, useRef } from 'react'

export type Contribution = {
  id: string
  actor: {
    login: string
    avatar_url: string
    html_url: string
  }
  repo: {
    name: string
    full_name: string
    html_url: string
  }
  type: 'PushEvent' | 'IssuesEvent' | 'PullRequestEvent' | 'CreateEvent' | 'WatchEvent' | 'ForkEvent'
  action?: string
  created_at: string
  payload?: {
    action?: string
    ref?: string
    commits?: Array<{ message: string }>
  }
  issue?: {
    title: string
    number: number
    html_url: string
  }
  pull_request?: {
    title: string
    number: number
    html_url: string
  }
}

type UseLiveContributionsResult = {
  contributions: Contribution[]
  isLoading: boolean
  error: Error | null
  refresh: () => void
}

const CACHE_DURATION = 30 * 1000 // 30 seconds
const REFRESH_INTERVAL = 30 * 1000 // Refresh every 30 seconds

export function useLiveContributions(limit: number = 10): UseLiveContributionsResult {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const intervalRef = useRef<number | null>(null)
  const lastFetchRef = useRef<number>(0)

  const fetchContributions = async () => {
    // Prevent too frequent requests
    const now = Date.now()
    if (now - lastFetchRef.current < CACHE_DURATION) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Fetch public GitHub events
      const response = await fetch('https://api.github.com/events', {
        headers: {
          Accept: 'application/vnd.github+json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch contributions')
      }

      const events: any[] = await response.json()
      
      // Transform events into contributions
      const transformed: Contribution[] = events
        .slice(0, limit * 2) // Get more to filter
        .map((event) => {
          const contribution: Contribution = {
            id: event.id,
            actor: {
              login: event.actor?.login || 'unknown',
              avatar_url: event.actor?.avatar_url || '',
              html_url: event.actor?.html_url || ''
            },
            repo: {
              name: event.repo?.name || 'unknown',
              full_name: event.repo?.name || 'unknown',
              html_url: `https://github.com/${event.repo?.name || ''}`
            },
            type: event.type,
            action: event.payload?.action,
            created_at: event.created_at,
            payload: event.payload
          }

          // Extract issue/PR info if available
          if (event.payload?.issue) {
            contribution.issue = {
              title: event.payload.issue.title,
              number: event.payload.issue.number,
              html_url: event.payload.issue.html_url
            }
          }

          if (event.payload?.pull_request) {
            contribution.pull_request = {
              title: event.payload.pull_request.title,
              number: event.payload.pull_request.number,
              html_url: event.payload.pull_request.html_url
            }
          }

          return contribution
        })
        .filter((c) => {
          // Filter to show only meaningful contributions
          return ['PushEvent', 'IssuesEvent', 'PullRequestEvent', 'CreateEvent'].includes(c.type)
        })
        .slice(0, limit)

      setContributions(transformed)
      lastFetchRef.current = now
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch contributions'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchContributions()

    // Set up auto-refresh
    intervalRef.current = window.setInterval(() => {
      fetchContributions()
    }, REFRESH_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [limit])

  const refresh = () => {
    lastFetchRef.current = 0
    fetchContributions()
  }

  return { contributions, isLoading, error, refresh }
}

