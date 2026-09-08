import React from 'react'
import type { FreshnessStatus } from '../utils/issueFreshness'

type FreshnessIndicatorProps = {
  status: FreshnessStatus
  label: string
  description?: string
  className?: string
}

const FreshnessIndicator: React.FC<FreshnessIndicatorProps> = ({
  status,
  label,
  description,
  className = '',
}) => {
  const color =
    status === 'active'
      ? 'text-accent'
      : status === 'stale'
        ? 'text-amber-600 dark:text-amber-500'
        : 'text-ink-muted'

  return (
    <span
      className={`text-xs font-medium ${color} ${className}`}
      title={description || label}
      aria-label={`Issue status: ${label}`}
    >
      {label}
    </span>
  )
}

export default FreshnessIndicator
