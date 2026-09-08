import { useEffect, useRef, useState, useMemo } from 'react'
import {
  getIssuesCacheHit,
  setIssuesCached,
  shareInflight,
} from '../utils/requestCache'
import {
  isRateLimited,
  updateRateLimitInfo,
  getRateLimitResetTime,
} from '../utils/rateLimitManager'

type GithubIssueItem = {
  id: number
  html_url: string
  title: string
  state: 'open' | 'closed'
  number: number
  repository_url: string
  labels: Array<{ name?: string; color?: string }>
  created_at: string
  updated_at?: string
  comments?: number
}

type GithubSearchResponse = {
  total_count: number
  incomplete_results: boolean
  items: GithubIssueItem[]
}

type UseFetchIssuesResult = {
  data: GithubSearchResponse | null
  isLoading: boolean
  error: Error | null
}

const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function requestIssues(
  query: string,
  page: number,
  perPage: number,
  signal: AbortSignal
): Promise<GithubSearchResponse> {
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&sort=updated&order=desc&page=${page}&per_page=${perPage}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
    },
    signal,
  })

  updateRateLimitInfo(response.headers)

  if (!response.ok) {
    if (response.status === 403) {
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
      if (rateLimitRemaining === '0') {
        throw new Error('Rate limit')
      }
      throw new Error(
        'Access forbidden. Your search might be too complex. Try simplifying your filters.'
      )
    }
    if (response.status === 422) {
      throw new Error('Invalid search query. Try adjusting your filters.')
    }
    if (response.status >= 500) {
      throw new Error('GitHub service is temporarily unavailable. Please try again later.')
    }
    throw new Error('Unable to fetch issues. Please try again.')
  }

  return response.json()
}

export function useFetchIssues(
  query: string,
  page: number = 1,
  perPage: number = 20
): UseFetchIssuesResult {
  const [data, setData] = useState<GithubSearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const retryTimeoutRef = useRef<number | null>(null)

  const cacheKey = useMemo(
    () => `issues_${query}_${page}_${perPage}`,
    [query, page, perPage]
  )

  useEffect(() => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }

    const controller = new AbortController()
    abortRef.current = controller

    async function fetchIssues(retryCount = 0): Promise<void> {
      if (controller.signal.aborted) return

      setError(null)

      try {
        if (!query || query.trim() === '') {
          setData({ total_count: 0, incomplete_results: false, items: [] })
          setIsLoading(false)
          return
        }

        const hit = getIssuesCacheHit<GithubSearchResponse>(cacheKey)

        // Fresh cache — serve only, no network
        if (hit?.fresh) {
          setData(hit.data)
          setIsLoading(false)
          return
        }

        // Stale cache — show it, then refresh once in background
        if (hit && !hit.fresh) {
          setData(hit.data)
          setIsLoading(false)

          if (!isRateLimited()) {
            void refreshInBackground()
          }
          return
        }

        // No cache — must load
        setIsLoading(true)

        if (isRateLimited()) {
          const resetTime = getRateLimitResetTime()
          if (resetTime) {
            const waitTime = resetTime - Date.now()
            if (waitTime > 0 && waitTime < 3600000) {
              setIsLoading(false)
              retryTimeoutRef.current = window.setTimeout(() => {
                if (!controller.signal.aborted) {
                  fetchIssues(0)
                }
              }, waitTime + 1000)
              return
            }
          }
        }

        // Shared fetch is not tied to this mount's abort — unmounting Hero
        // must not cancel an Issues page request for the same key.
        const json = await shareInflight(cacheKey, () =>
          requestIssues(query, page, perPage, new AbortController().signal)
        )

        if (controller.signal.aborted) return

        setIssuesCached(cacheKey, json)
        setData(json)
      } catch (err: unknown) {
        if ((err as { name?: string })?.name === 'AbortError') return
        if (controller.signal.aborted) return

        const message = (err as Error).message || ''

        if (message.includes('Rate limit')) {
          const cached = getIssuesCacheHit<GithubSearchResponse>(cacheKey)
          if (cached) {
            setData(cached.data)
            setIsLoading(false)
            return
          }

          const resetTime = getRateLimitResetTime()
          if (resetTime) {
            const waitTime = resetTime - Date.now()
            if (waitTime > 0 && waitTime < 3600000) {
              setIsLoading(true)
              retryTimeoutRef.current = window.setTimeout(() => {
                if (!controller.signal.aborted) {
                  fetchIssues(0)
                }
              }, waitTime + 1000)
              return
            }
          }
          setIsLoading(false)
          return
        }

        if (message.includes('temporarily unavailable') && retryCount < MAX_RETRIES) {
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount)
          await sleep(delay)
          if (!controller.signal.aborted) {
            return fetchIssues(retryCount + 1)
          }
        }

        const stale = getIssuesCacheHit<GithubSearchResponse>(cacheKey)
        if (stale) {
          setData(stale.data)
          setIsLoading(false)
          return
        }

        if (err instanceof TypeError && message.includes('fetch')) {
          setError(new Error('Network error. Please check your connection.'))
        } else {
          setError(err as Error)
        }

        setData({ total_count: 0, incomplete_results: false, items: [] })
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    async function refreshInBackground(): Promise<void> {
      try {
        if (isRateLimited() || controller.signal.aborted) return

        const json = await shareInflight(cacheKey, () =>
          requestIssues(query, page, perPage, new AbortController().signal)
        )

        if (controller.signal.aborted) return
        setIssuesCached(cacheKey, json)
        setData(json)
      } catch {
        // Keep serving stale cache
      }
    }

    fetchIssues()

    return () => {
      controller.abort()
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
    }
  }, [query, page, perPage, cacheKey])

  return { data, isLoading, error }
}
