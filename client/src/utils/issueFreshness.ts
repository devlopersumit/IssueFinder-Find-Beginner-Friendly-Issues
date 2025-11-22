export type FreshnessStatus = 'active' | 'stale' | 'inactive'

export interface FreshnessInfo {
  status: FreshnessStatus
  daysSinceUpdate: number
  label: string
  description: string
}

export function calculateFreshness(updatedAt: string | undefined, createdAt: string): FreshnessInfo {
  if (!updatedAt) {
    updatedAt = createdAt
  }

  const updatedDate = new Date(updatedAt)
  const now = new Date()
  const diffMs = now.getTime() - updatedDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 7) {
    return {
      status: 'active',
      daysSinceUpdate: diffDays,
      label: 'Active',
      description: `Updated ${diffDays === 0 ? 'today' : diffDays === 1 ? 'yesterday' : `${diffDays} days ago`}`
    }
  } else if (diffDays < 30) {
    return {
      status: 'stale',
      daysSinceUpdate: diffDays,
      label: 'Stale',
      description: `Updated ${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? 'week' : 'weeks'} ago`
    }
  } else {
    return {
      status: 'inactive',
      daysSinceUpdate: diffDays,
      label: 'Inactive',
      description: `Updated ${Math.floor(diffDays / 30)} ${Math.floor(diffDays / 30) === 1 ? 'month' : 'months'} ago`
    }
  }
}

