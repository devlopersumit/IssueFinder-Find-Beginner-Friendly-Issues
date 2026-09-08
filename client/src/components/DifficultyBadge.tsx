import React from 'react'
import type { DifficultyLevel } from '../utils/difficulty'

type DifficultyBadgeProps = {
  difficulty: DifficultyLevel
  className?: string
}

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, className = '' }) => {
  if (!difficulty) return null

  const labels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  }

  return (
    <span
      className={`text-xs text-ink-muted dark:text-zinc-500 ${className}`}
      title={`Difficulty: ${labels[difficulty]}`}
    >
      {labels[difficulty]}
    </span>
  )
}

export default DifficultyBadge
