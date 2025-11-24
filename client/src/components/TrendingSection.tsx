import React from 'react'
import { Link } from 'react-router-dom'
import { useFetchIssues } from '../hooks/useFetchIssues'
import { buildGitHubQuery } from '../utils/queryBuilder'
import DifficultyBadge from './DifficultyBadge'
import { detectDifficulty } from '../utils/difficulty'
import { calculateFreshness } from '../utils/issueFreshness'
import FreshnessIndicator from './FreshnessIndicator'

const TrendingSection: React.FC = () => {
  const trendingQuery = buildGitHubQuery({
    selectedCategories: ['good first issue'],
    selectedLastActivity: 'week'
  })

  const { data, isLoading } = useFetchIssues(trendingQuery, 1, 6)

  const trendingIssues = data?.items?.slice(0, 6) || []

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'today'
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Trending Issues</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Most active issues this week</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (trendingIssues.length === 0) {
    return null
  }

  return (
    <section className="py-12 border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Trending Issues</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Most active issues this week</p>
          </div>
          <Link
            to="/categories"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trendingIssues.map((issue) => {
            const repo = issue.repository_url?.split('/').slice(-2).join('/')
            const difficulty = detectDifficulty(issue.labels || [])
            const freshness = calculateFreshness(issue.updated_at, issue.created_at)

            return (
              <a
                key={issue.id}
                href={issue.html_url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="truncate text-xs font-semibold text-slate-600 dark:text-slate-400">{repo}</p>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <DifficultyBadge difficulty={difficulty} />
                    <FreshnessIndicator 
                      status={freshness.status} 
                      label={freshness.label}
                      description={freshness.description}
                    />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {issue.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-auto">
                  <span className="inline-flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDate(issue.created_at)}
                  </span>
                  {issue.comments !== undefined && issue.comments > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 13V5a3 3 0 00-3-3H5a3 3 0 00-3 3v8a3 3 0 003 3h1v2.382a.5.5 0 00.79.407L10.5 16H15a3 3 0 003-3z" />
                      </svg>
                      {issue.comments}
                    </span>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TrendingSection

