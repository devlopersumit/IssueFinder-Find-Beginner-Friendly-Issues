import { useEffect, useState } from 'react'
import { useFetchIssues } from './useFetchIssues'
import { matchIssues, fetchUserProfile, type UserProfile, type IssueMatch } from '../utils/issueMatcher'

type UsePersonalizedIssuesResult = {
  matchedIssues: IssueMatch[]
  isLoading: boolean
  error: Error | null
  profile: UserProfile | null
  setProfile: (profile: UserProfile | null) => void
  loadProfileFromGitHub: (username: string) => Promise<void>
}

export function usePersonalizedIssues(
  defaultQuery: string = 'is:open is:issue no:assignee',
  limit: number = 10
): UsePersonalizedIssuesResult {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [matchedIssues, setMatchedIssues] = useState<IssueMatch[]>([])
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false)
  const [profileError, setProfileError] = useState<Error | null>(null)
  
  const { data, isLoading: isLoadingIssues, error: issuesError } = useFetchIssues(defaultQuery, 1, 50)

  useEffect(() => {
    if (!data?.items || data.items.length === 0) {
      setMatchedIssues([])
      return
    }

    if (!profile || (!profile.languages && !profile.repositories)) {
      // No profile, show top issues without matching
      setMatchedIssues(
        data.items.slice(0, limit).map(issue => ({
          issue,
          matchScore: 0,
          reasons: []
        }))
      )
      return
    }

    // Match issues against profile
    const matched = matchIssues(data.items, profile)
    setMatchedIssues(matched.slice(0, limit))
  }, [data, profile, limit])

  const loadProfileFromGitHub = async (username: string) => {
    if (!username.trim()) {
      setProfile(null)
      return
    }

    setIsLoadingProfile(true)
    setProfileError(null)

    try {
      const fetchedProfile = await fetchUserProfile(username.trim())
      if (fetchedProfile.username) {
        setProfile(fetchedProfile as UserProfile)
      } else {
        setProfileError(new Error('User not found or profile unavailable'))
      }
    } catch (error) {
      setProfileError(error instanceof Error ? error : new Error('Failed to load profile'))
    } finally {
      setIsLoadingProfile(false)
    }
  }

  return {
    matchedIssues,
    isLoading: isLoadingIssues || isLoadingProfile,
    error: issuesError || profileError,
    profile,
    setProfile,
    loadProfileFromGitHub
  }
}

