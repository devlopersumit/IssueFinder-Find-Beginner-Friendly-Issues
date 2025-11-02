import React, { useEffect, useState } from 'react'
import { useFetchRepositories } from '../hooks/useFetchRepositories'
import { useSearchRepository } from '../hooks/useSearchRepository'
import RepositoryModal from './RepositoryModal'

type RepositoryListProps = {
  className?: string
  language: string | null
}

const RepositoryList: React.FC<RepositoryListProps> = ({ className = '', language }) => {
  const [page, setPage] = useState<number>(1)
  const [sort, setSort] = useState<'stars' | 'updated' | 'forks'>('stars')
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const perPage = 20
  const [items, setItems] = useState<any[]>([])
  const { data, isLoading, error } = useFetchRepositories(language, sort, page, perPage)
  const { results: searchResults, isLoading: isSearching, error: searchError } = useSearchRepository(searchQuery.trim() || null)
  
  const isSearchMode = searchQuery.trim().length >= 2
  const displayItems = isSearchMode ? searchResults : items
  const displayLoading = isSearchMode ? isSearching : isLoading
  const displayError = isSearchMode ? searchError : error

  useEffect(() => {
    setPage(1)
    setItems([])
  }, [language, sort])

  useEffect(() => {
    if (data?.items) {
      setItems((prev) => {
        const prevIds = new Set(prev.map((i) => i.id))
        const merged = [...prev]
        data.items.forEach((it) => {
          if (!prevIds.has(it.id)) merged.push(it)
        })
        return merged
      })
    }
  }, [data])

  const totalCount = data?.total_count ?? 0
  const canLoadMore = items.length < totalCount && !isLoading && !error

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'updated today'
    if (diffDays === 1) return 'updated yesterday'
    if (diffDays < 7) return `updated ${diffDays} days ago`
    if (diffDays < 30) return `updated ${Math.floor(diffDays / 7)} weeks ago`
    return `updated ${Math.floor(diffDays / 30)} months ago`
  }

  return (
    <section className={`bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded transition-colors duration-200 ${className}`}>
      <div className="p-4">
        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repository (e.g., facebook/react or just react)..."
              className="w-full rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-slate-500"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Type at least 2 characters to search</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isSearchMode ? `Search Results${searchResults.length > 0 ? ` (${searchResults.length})` : ''}` : 'Best Repositories'}
          </h2>
          {!isSearchMode && (
            <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'stars' | 'updated' | 'forks')}
              className="rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              <option value="stars">Most Stars</option>
              <option value="updated">Recently Updated</option>
              <option value="forks">Most Forks</option>
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {displayLoading && displayItems.length === 0 ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading…
                </span>
              ) : displayError ? (
                <span className="text-red-600 dark:text-red-400">Error</span>
              ) : (
                <span className="font-medium">{totalCount.toLocaleString()} repos</span>
              )}
            </span>
          </div>
          )}
        </div>

        {displayItems.length === 0 && !displayLoading && !displayError && (
          <div className="text-center py-8">
            <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSearchMode ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              )}
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              {isSearchMode ? 'No repositories found' : 'No repositories found'}
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {isSearchMode ? 'Try searching with a different query or repository name.' : 'Try adjusting your filters.'}
            </p>
          </div>
        )}

        <div className="space-y-3">
          {(displayItems.length ? displayItems : [1, 2, 3]).map((item: any, idx: number) => {
            if (!displayItems.length) {
              return (
                <article key={`placeholder-${idx}`} className="p-4 border border-gray-300 dark:border-gray-700 rounded animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                      <div className="flex gap-4 mt-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </article>
              )
            }

            const repo = item
            return (
              <article
                key={repo.id}
                className="p-4 border border-gray-300 dark:border-gray-700 rounded hover:border-slate-500 dark:hover:border-slate-500 bg-white dark:bg-gray-800 transition-colors duration-200 cursor-pointer"
                onClick={() => setSelectedRepo(repo.full_name)}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={repo.owner.avatar_url}
                    alt={repo.owner.login}
                    className="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div
                        className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                      >
                        {repo.full_name}
                      </div>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                        aria-label="Open repository on GitHub"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                    {repo.description && (
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{repo.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {repo.stargazers_count.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2A5 5 0 0011 9H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {repo.forks_count.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {repo.open_issues_count} issues
                      </span>
                      <span>{formatDate(repo.updated_at)}</span>
                    </div>
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {repo.topics.slice(0, 5).map((topic: string) => (
                          <span
                            key={topic}
                            className="inline-flex items-center rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 text-xs font-normal text-gray-600 dark:text-gray-300"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {!isSearchMode && (
          <div className="mt-4 flex justify-center items-center gap-3">
            {canLoadMore && (
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="rounded bg-slate-700 dark:bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:hover:bg-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          )}
          {isLoading && items.length > 0 && (
            <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading more...
            </span>
            )}
          </div>
        )}
      </div>
      <RepositoryModal repoFullName={selectedRepo} onClose={() => setSelectedRepo(null)} />
    </section>
  )
}

export default RepositoryList

