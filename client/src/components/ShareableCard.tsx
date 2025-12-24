import React, { useRef } from 'react'
import type { ContributorStats } from '../utils/contributionTracker'

type ShareableCardProps = {
  stats: ContributorStats
  period?: 'week' | 'month' | 'year' | 'all'
  onExport?: () => void
}

const ShareableCard: React.FC<ShareableCardProps> = ({ stats, period = 'all', onExport }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const getPeriodLabel = () => {
    switch (period) {
      case 'week': return 'This Week'
      case 'month': return 'This Month'
      case 'year': return 'This Year'
      default: return 'All Time'
    }
  }

  const getPeriodValue = () => {
    switch (period) {
      case 'week': return stats.contributionsThisWeek
      case 'month': return stats.contributionsThisMonth
      case 'year': return stats.contributionsThisYear
      default: return stats.totalContributions
    }
  }

  const handleShare = async () => {
    if (navigator.share && cardRef.current) {
      try {
        // Sanitize username before sharing
        const { escapeHtml } = await import('../utils/security')
        const safeUsername = escapeHtml(stats.username)
        
        await navigator.share({
          title: `${safeUsername}'s Open Source Impact`,
          text: `Check out my contribution impact on IssueFinder! Impact Score: ${stats.impactScore}`,
          url: window.location.href
        })
      } catch (err) {
        // User cancelled or error - don't log sensitive info
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Share error')
        }
      }
    }
  }

  const handleCopyLink = () => {
    // Validate URL before copying
    const { sanitizeUrl } = require('../utils/security')
    const safeUrl = sanitizeUrl(window.location.href)
    if (safeUrl) {
      navigator.clipboard.writeText(safeUrl).catch(() => {
        // Silently fail
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Shareable Card Preview */}
      <div
        ref={cardRef}
        className="relative rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-blue-900/20 p-8"
      >
        <div className="text-center">
          <img
            src={stats.avatarUrl}
            alt={stats.username}
            className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-lg"
          />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            @{stats.username}
          </h3>
          <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            {stats.impactScore}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Impact Score
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.issuesClosed}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.prsMerged}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">PRs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.currentStreak}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Streak</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {getPeriodLabel()}: {getPeriodValue()} contributions
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              Tracked by IssueFinder.fun
            </div>
          </div>
        </div>
      </div>

      {/* Share Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Link
        </button>
        {onExport && (
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        )}
      </div>
    </div>
  )
}

export default ShareableCard

