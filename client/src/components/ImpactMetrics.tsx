import React from 'react'
import type { ContributorStats } from '../utils/contributionTracker'

type ImpactMetricsProps = {
  stats: ContributorStats
  className?: string
}

const ImpactMetrics: React.FC<ImpactMetricsProps> = ({ stats, className = '' }) => {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
    if (score >= 60) return 'text-blue-600 dark:text-blue-400'
    if (score >= 40) return 'text-amber-600 dark:text-amber-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Elite Contributor'
    if (score >= 60) return 'Active Contributor'
    if (score >= 40) return 'Regular Contributor'
    return 'Getting Started'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Impact Score */}
      <div className="text-center">
        <div className="inline-flex flex-col items-center">
          <div className={`text-6xl font-bold ${getScoreColor(stats.impactScore)} mb-2`}>
            {stats.impactScore}
          </div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Impact Score
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            {getScoreLabel(stats.impactScore)}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.issuesClosed}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Issues Closed
          </div>
        </div>
        <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.prsMerged}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            PRs Merged
          </div>
        </div>
        <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.commits}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Commits
          </div>
        </div>
        <div className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.repositoriesContributed}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Repositories
          </div>
        </div>
      </div>

      {/* Streak & Activity */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {stats.currentStreak}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Day Streak
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            Longest: {stats.longestStreak} days
          </div>
        </div>
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">This Week</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.contributionsThisWeek}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {stats.contributionsThisMonth} this month
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImpactMetrics

