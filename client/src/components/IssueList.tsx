import React, { useEffect, useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useFetchIssues } from '../hooks/useFetchIssues'
import DifficultyBadge from './DifficultyBadge'
import { detectDifficulty } from '../utils/difficulty'
import type { NaturalLanguage } from '../utils/languageDetection'
import { filterByLanguage } from '../utils/languageDetection'
import { fetchRepositoryLanguages } from '../utils/repoLanguages'
import { fetchRepositoryHealthBatch } from '../utils/repoHealth'
import { calculateFreshness } from '../utils/issueFreshness'
import FreshnessIndicator from './FreshnessIndicator'
import { useSavedIssues } from '../hooks/useSavedIssues'

type IssueListProps = {
  className?: string
  query: string
  naturalLanguageFilter?: NaturalLanguage[]
}

const IssueList: React.FC<IssueListProps> = ({ className = '', query, naturalLanguageFilter = [] }) => {
  const [page, setPage] = useState<number>(1)
  const perPage = 20
  type IssueItem = {
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

  const [items, setItems] = useState<IssueItem[]>([])
  const [repoLanguages, setRepoLanguages] = useState<Record<string, string[]>>({})
  const [repoHealth, setRepoHealth] = useState<Record<string, boolean>>({})
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false)
  const languagesFetchedRef = useRef<Set<string>>(new Set())
  const healthFetchedRef = useRef<Set<string>>(new Set())
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
  const { data, isLoading, error } = useFetchIssues(query, page, perPage)

  const displayError = error && !error.message.toLowerCase().includes('rate limit') ? error : null
  const { saveIssue, removeIssue, isSaved } = useSavedIssues()

  useEffect(() => {
    setPage(1)
    setItems([])
    languagesFetchedRef.current = new Set()
    healthFetchedRef.current = new Set()
    setRepoLanguages({})
    setRepoHealth({})
    setIsCheckingHealth(false)
    setIsInitialLoad(true)
  }, [query])

  useEffect(() => {
    if (!isLoading && data) {
      setIsInitialLoad(false)
    }
  }, [isLoading, data])

  useEffect(() => {
    if (data?.items) {
      setItems(data.items)

      const newRepos = data.items
        .filter((item) => item.repository_url && !languagesFetchedRef.current.has(item.repository_url))
        .map((item) => item.repository_url)

      if (newRepos.length > 0) {
        const uniqueRepos = Array.from(new Set(newRepos))
        uniqueRepos.forEach((repoUrl, index) => {
          setTimeout(async () => {
            if (!languagesFetchedRef.current.has(repoUrl)) {
              languagesFetchedRef.current.add(repoUrl)
              try {
                const languages = await fetchRepositoryLanguages(repoUrl)
                if (languages.length > 0) {
                  setRepoLanguages((prev) => ({ ...prev, [repoUrl]: languages }))
                }
              } catch {
                /* ignore */
              }
            }
          }, index * 200)
        })
      }

      const reposNeedingHealth = data.items
        .map((item) => item.repository_url)
        .filter((url) => url && !healthFetchedRef.current.has(url))

      if (reposNeedingHealth.length > 0) {
        const uniqueHealthRepos = Array.from(new Set(reposNeedingHealth))
        uniqueHealthRepos.forEach((url) => healthFetchedRef.current.add(url))
        setIsCheckingHealth(true)
        fetchRepositoryHealthBatch(uniqueHealthRepos)
          .then((healthResults) => {
            setRepoHealth((prev) => {
              const next = { ...prev }
              for (const [url, info] of Object.entries(healthResults)) {
                next[url] = info.isHealthy
              }
              return next
            })
          })
          .finally(() => setIsCheckingHealth(false))
      } else if (data.items.length === 0) {
        setIsCheckingHealth(false)
      }
    } else {
      setItems([])
    }
  }, [data])

  const filteredAndSortedItems = useMemo(() => {
    let result = items

    if (naturalLanguageFilter.length > 0) {
      result = filterByLanguage(result, naturalLanguageFilter)
    }

    result = result.filter((issue) => {
      const freshness = calculateFreshness(issue.updated_at, issue.created_at)
      if (freshness.status === 'inactive') return false
      if (repoHealth[issue.repository_url] === false) return false
      return true
    })

    return [...result].sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at).getTime()
      const dateB = new Date(b.updated_at || b.created_at).getTime()
      return dateB - dateA
    })
  }, [items, naturalLanguageFilter, repoHealth])

  const totalCount = data?.total_count ?? 0
  const githubMaxResults = 1000
  const maxAllowedPages = Math.floor(githubMaxResults / perPage)
  const actualTotalPages = Math.max(1, Math.ceil(totalCount / perPage))
  const totalPages = Math.min(actualTotalPages, maxAllowedPages)
  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages
  const displayItems = filteredAndSortedItems
  const isVerifying = isCheckingHealth && items.length > 0

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const formatRelative = (dateString: string) => {
    const date = new Date(dateString)
    const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'today'
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
    return `${Math.floor(diffDays / 30)}mo ago`
  }

  return (
    <section className={className}>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-medium text-ink dark:text-white">Fresh issues</h2>
          <p className="mt-1 text-sm text-ink-muted">Updated in the last 7 days · maintained repos</p>
        </div>
        <p className="text-sm text-ink-muted">
          {isLoading && displayItems.length === 0
            ? 'Loading…'
            : displayError
              ? displayError.message
              : `${totalCount.toLocaleString()} matching on GitHub`}
        </p>
      </div>

      {isVerifying && (
        <p className="mb-4 text-sm text-ink-muted">Checking repository health…</p>
      )}

      {(isLoading || isInitialLoad) && displayItems.length === 0 && (
        <div className="divide-y divide-paper-line overflow-hidden rounded-lg border border-paper-line bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="animate-pulse px-4 py-5 sm:px-5">
              <div className="h-3 w-1/3 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="mt-3 h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="mt-2 h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      )}

      {displayItems.length === 0 && !isLoading && !displayError && !isInitialLoad && !isVerifying && (
        <div className="rounded-lg border border-dashed border-paper-line px-6 py-14 text-center dark:border-zinc-700">
          <h3 className="font-display text-xl font-medium text-ink dark:text-white">No matching issues</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
            Try fewer filters, or browse beginner-friendly issues.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/issues" className="btn-secondary text-sm">
              Clear filters
            </Link>
            <Link to="/categories" className="btn-primary text-sm">
              Browse categories
            </Link>
          </div>
        </div>
      )}

      {displayItems.length === 0 && !isLoading && displayError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900/50 dark:bg-red-950/30">
          <h3 className="font-display text-lg font-medium text-red-900 dark:text-red-100">Unable to load issues</h3>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{displayError.message}</p>
          <button type="button" onClick={() => window.location.reload()} className="btn-secondary mt-4">
            Retry
          </button>
        </div>
      )}

      {displayItems.length > 0 && (
        <ul className="divide-y divide-paper-line overflow-hidden rounded-lg border border-paper-line bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {displayItems.map((issue) => {
            const repo = issue.repository_url?.split('/').slice(-2).join('/')
            const difficulty = detectDifficulty(issue.labels || [])
            const primaryLanguage = repoLanguages[issue.repository_url]?.[0]
            const freshness = calculateFreshness(issue.updated_at, issue.created_at)
            const saved = isSaved(issue.id)
            const topLabel = issue.labels?.find((l) => l.name)?.name

            return (
              <li key={issue.id} className="group px-4 py-5 transition hover:bg-zinc-50/80 sm:px-5 dark:hover:bg-zinc-800/40">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                      <span className="font-semibold text-ink dark:text-zinc-100">{repo}</span>
                      <span className="text-ink-muted">#{issue.number}</span>
                      {topLabel && (
                        <span className="text-ink-muted">· {topLabel}</span>
                      )}
                    </div>
                    <a
                      href={issue.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1.5 block font-display text-lg font-medium leading-snug text-ink transition group-hover:text-accent dark:text-white dark:group-hover:text-teal-400"
                    >
                      {issue.title}
                    </a>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                      {primaryLanguage && <span>{primaryLanguage}</span>}
                      <span>updated {formatRelative(issue.updated_at || issue.created_at)}</span>
                      <span>{issue.comments ?? 0} comments</span>
                      <FreshnessIndicator
                        status={freshness.status}
                        label={freshness.label}
                        description={freshness.description}
                      />
                      <DifficultyBadge difficulty={difficulty} />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      if (saved) removeIssue(issue.id)
                      else {
                        saveIssue({
                          id: issue.id,
                          html_url: issue.html_url,
                          title: issue.title,
                          repository_url: issue.repository_url,
                          number: issue.number,
                          created_at: issue.created_at,
                        })
                      }
                    }}
                    className="shrink-0 rounded-md p-2 text-ink-muted opacity-0 transition hover:bg-zinc-100 hover:text-ink group-hover:opacity-100 dark:hover:bg-zinc-800"
                    aria-label={saved ? 'Remove from saved' : 'Save for later'}
                    title={saved ? 'Saved' : 'Save'}
                  >
                    {saved ? (
                      <svg className="h-4 w-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    )}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {totalCount > 0 && displayItems.length > 0 && (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!hasPrevPage || isLoading}
            className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <p className="text-sm text-ink-muted">
            Page {page} of {totalPages}
          </p>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={!hasNextPage || isLoading}
            className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  )
}

export default IssueList
