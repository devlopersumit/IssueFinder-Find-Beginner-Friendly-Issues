import React from 'react'
import { Link } from 'react-router-dom'

type LeaderboardEntry = {
  username: string
  avatarUrl: string
  impactScore: number
  contributions: number
  rank: number
}

type LeaderboardProps = {
  entries: LeaderboardEntry[]
  period?: 'week' | 'month' | 'all'
  className?: string
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, period = 'all', className = '' }) => {
  const getPeriodLabel = () => {
    switch (period) {
      case 'week': return 'This Week'
      case 'month': return 'This Month'
      default: return 'All Time'
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
    if (rank === 2) return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
    if (rank === 3) return 'bg-amber-100 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
    return 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
  }

  if (entries.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No leaderboard data available yet
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Top Contributors - {getPeriodLabel()}
        </h3>
      </div>
      <div className="space-y-2">
        {entries.map((entry) => (
          <Link
            key={entry.username}
            to={`/contributor/${entry.username}`}
            className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all hover:shadow-md ${getRankColor(entry.rank)}`}
          >
            <div className="text-2xl font-bold w-12 text-center">
              {getRankIcon(entry.rank)}
            </div>
            <img
              src={entry.avatarUrl}
              alt={entry.username}
              className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                @{entry.username}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {entry.contributions} contributions
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {entry.impactScore}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Impact
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Leaderboard

