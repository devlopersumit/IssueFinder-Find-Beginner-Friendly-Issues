import React from 'react'
import type { DifficultyLevel } from '../utils/difficulty'

type DifficultyBadgeProps = {
  difficulty: DifficultyLevel
  className?: string
}

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, className = '' }) => {
  if (!difficulty) {
    return null
  }

  const badgeConfig = {
    beginner: {
      label: 'Beginner',
      dot: 'bg-emerald-400'
    },
    intermediate: {
      label: 'Intermediate',
      dot: 'bg-amber-400'
    },
    advanced: {
      label: 'Advanced',
      dot: 'bg-rose-400'
    }
  }

  const config = badgeConfig[difficulty]

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300 ${className}`}
      title={`Difficulty: ${config.label}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

export default DifficultyBadge
