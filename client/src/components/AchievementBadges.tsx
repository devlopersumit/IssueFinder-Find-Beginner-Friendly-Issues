import React from 'react'
import type { Achievement } from '../utils/contributionTracker'

type AchievementBadgesProps = {
  achievements: Achievement[]
  className?: string
}

const AchievementBadges: React.FC<AchievementBadgesProps> = ({ achievements, className = '' }) => {
  const getRarityColor = (rarity: Achievement['rarity']): string => {
    switch (rarity) {
      case 'legendary':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
      case 'epic':
        return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
      case 'rare':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
      default:
        return 'border-gray-400 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
    }
  }

  if (achievements.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No achievements unlocked yet. Start contributing to earn badges!
        </p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {achievements.map((achievement) => (
        <div
          key={achievement.id}
          className={`p-4 rounded-lg border-2 ${getRarityColor(achievement.rarity)} transition-transform hover:scale-105`}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">{achievement.icon}</div>
            <div className="font-semibold text-sm mb-1">{achievement.name}</div>
            <div className="text-xs opacity-80 mb-2">{achievement.description}</div>
            <div className={`text-xs px-2 py-1 rounded-full inline-block ${
              achievement.rarity === 'legendary' ? 'bg-yellow-200 dark:bg-yellow-900/40' :
              achievement.rarity === 'epic' ? 'bg-purple-200 dark:bg-purple-900/40' :
              achievement.rarity === 'rare' ? 'bg-blue-200 dark:bg-blue-900/40' :
              'bg-gray-200 dark:bg-gray-700'
            }`}>
              {achievement.rarity.toUpperCase()}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AchievementBadges

