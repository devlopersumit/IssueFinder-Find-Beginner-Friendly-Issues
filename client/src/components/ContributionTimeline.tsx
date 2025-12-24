import React from 'react'
import type { ContributionTimelineItem } from '../utils/contributionTracker'

type ContributionTimelineProps = {
  timeline: ContributionTimelineItem[]
  className?: string
}

const ContributionTimeline: React.FC<ContributionTimelineProps> = ({ timeline, className = '' }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const getContributionIcon = (type: string) => {
    switch (type) {
      case 'issue':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'pr':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        )
      case 'commit':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )
    }
  }

  if (timeline.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No contributions found in timeline
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {timeline.slice(0, 30).map((item, index) => (
        <div key={item.date} className="flex gap-4">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></div>
            {index < timeline.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2"></div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {formatDate(item.date)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.count} {item.count === 1 ? 'contribution' : 'contributions'}
              </span>
            </div>
            <div className="space-y-2">
              {item.contributions.slice(0, 3).map((contribution) => {
                // Validate URL before rendering
                const { sanitizeUrl, isGitHubUrl } = require('../utils/security')
                const safeUrl = sanitizeUrl(contribution.url) && isGitHubUrl(contribution.url) 
                  ? contribution.url 
                  : '#'
                
                return (
                <a
                  key={contribution.id}
                  href={safeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 rounded border border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                >
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 ${
                      contribution.type === 'issue' ? 'text-blue-600 dark:text-blue-400' :
                      contribution.type === 'pr' ? 'text-emerald-600 dark:text-emerald-400' :
                      'text-purple-600 dark:text-purple-400'
                    }`}>
                      {getContributionIcon(contribution.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {contribution.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {contribution.repository}
                      </p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              )})}
              {item.contributions.length > 3 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 pl-6">
                  +{item.contributions.length - 3} more
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ContributionTimeline

