import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useContributorProfile } from '../hooks/useContributorProfile'
import ImpactMetrics from '../components/ImpactMetrics'
import ContributionTimeline from '../components/ContributionTimeline'
import ShareableCard from '../components/ShareableCard'
import AchievementBadges from '../components/AchievementBadges'

const ContributorProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>()
  
  // Validate and sanitize username from URL
  const { validateGitHubUsername, sanitizeInput } = require('../utils/security')
  const sanitizedUsername = username ? sanitizeInput(decodeURIComponent(username)) : null
  const validation = sanitizedUsername ? validateGitHubUsername(sanitizedUsername) : { valid: false }
  
  const { stats, timeline, isLoading, error, refresh } = useContributorProfile(
    validation.valid ? sanitizedUsername : null
  )
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'achievements' | 'share'>('overview')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading contributor profile...</p>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error?.message || `Could not find contributor profile for "${username}"`}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={stats.avatarUrl}
              alt={stats.username}
              className="w-24 h-24 rounded-full border-4 border-emerald-500 dark:border-emerald-400 shadow-lg"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                @{stats.username}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Open Source Contributor
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <a
                  href={stats.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2C4.477 2 0 6.484 0 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C17.138 20.197 20 16.425 20 12.017 20 6.484 15.522 2 10 2z" clipRule="evenodd" />
                  </svg>
                  View on GitHub
                </a>
                <button
                  onClick={refresh}
                  className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap gap-4">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'timeline', label: 'Timeline', icon: '📅' },
              { id: 'achievements', label: 'Achievements', icon: '🏆' },
              { id: 'share', label: 'Share', icon: '🔗' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <ImpactMetrics stats={stats} />
              {stats.languages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Languages & Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <ContributionTimeline timeline={timeline} />
          )}

          {activeTab === 'achievements' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Achievements & Badges
              </h3>
              <AchievementBadges achievements={stats.achievements} />
            </div>
          )}

          {activeTab === 'share' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Share Your Contribution Impact
              </h3>
              <ShareableCard stats={stats} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ContributorProfile

