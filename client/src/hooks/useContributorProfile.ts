import { useEffect, useState } from 'react'
import { 
  fetchContributorData, 
  buildContributionTimeline,
  type ContributorStats,
  type Contribution,
  type ContributionTimelineItem
} from '../utils/contributionTracker'

type UseContributorProfileResult = {
  stats: ContributorStats | null
  timeline: ContributionTimelineItem[]
  isLoading: boolean
  error: Error | null
  refresh: () => void
}

export function useContributorProfile(username: string | null): UseContributorProfileResult {
  const [stats, setStats] = useState<ContributorStats | null>(null)
  const [timeline, setTimeline] = useState<ContributionTimelineItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const loadProfile = async () => {
    if (!username || !username.trim()) {
      setStats(null)
      setTimeline([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const contributorStats = await fetchContributorData(username.trim())
      setStats(contributorStats)

      // Build timeline from contributions
      if (contributorStats.contributions && contributorStats.contributions.length > 0) {
        const timelineData = buildContributionTimeline(contributorStats.contributions)
        setTimeline(timelineData)
      } else {
        setTimeline([])
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load contributor profile'))
      setStats(null)
      setTimeline([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [username])

  return {
    stats,
    timeline,
    isLoading,
    error,
    refresh: loadProfile
  }
}

