/**
 * Contribution Impact Tracker Utilities
 * Calculates impact scores and tracks contributor statistics
 */

export type Contribution = {
  id: string
  type: 'issue' | 'pr' | 'commit' | 'review'
  repository: string
  repositoryUrl: string
  title: string
  url: string
  state: 'open' | 'closed' | 'merged'
  createdAt: string
  updatedAt: string
  closedAt?: string
  mergedAt?: string
  labels?: string[]
  additions?: number
  deletions?: number
  comments?: number
  reactions?: number
}

export type ContributorStats = {
  username: string
  avatarUrl: string
  profileUrl: string
  totalContributions: number
  issuesClosed: number
  prsMerged: number
  commits: number
  reviews: number
  repositoriesContributed: number
  languages: string[]
  impactScore: number
  currentStreak: number
  longestStreak: number
  contributionsThisWeek: number
  contributionsThisMonth: number
  contributionsThisYear: number
  firstContributionDate: string
  lastContributionDate: string
  achievements: Achievement[]
  contributions: Contribution[]
}

export type Achievement = {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export type ContributionTimelineItem = {
  date: string
  contributions: Contribution[]
  count: number
}

/**
 * Calculate Impact Score (0-100)
 * Based on multiple factors:
 * - Issues closed (30 points)
 * - PRs merged (30 points)
 * - Code contributions (20 points)
 * - Community engagement (10 points)
 * - Consistency (10 points)
 */
export function calculateImpactScore(stats: Partial<ContributorStats>): number {
  let score = 0

  // Issues closed (max 30 points)
  const issuesScore = Math.min(30, (stats.issuesClosed || 0) * 0.5)
  score += issuesScore

  // PRs merged (max 30 points)
  const prsScore = Math.min(30, (stats.prsMerged || 0) * 0.6)
  score += prsScore

  // Code contributions (max 20 points)
  const commitsScore = Math.min(20, (stats.commits || 0) * 0.1)
  score += commitsScore

  // Community engagement (max 10 points)
  const engagementScore = Math.min(10, (stats.reviews || 0) * 0.2)
  score += engagementScore

  // Consistency - streak bonus (max 10 points)
  const streakScore = Math.min(10, (stats.currentStreak || 0) * 0.5)
  score += streakScore

  return Math.round(Math.min(100, score))
}

/**
 * Fetch contributor data from GitHub API
 */
export async function fetchContributorData(username: string): Promise<ContributorStats> {
  // Validate and sanitize username
  const { validateGitHubUsername, sanitizeInput } = await import('./security')
  const validation = validateGitHubUsername(username)
  
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid GitHub username')
  }

  const sanitizedUsername = sanitizeInput(username.trim())

  try {
    // Fetch user profile - encode username to prevent injection
    const encodedUsername = encodeURIComponent(sanitizedUsername)
    const userResponse = await fetch(`https://api.github.com/users/${encodedUsername}`, {
      headers: {
        Accept: 'application/vnd.github+json'
      }
    })

    if (!userResponse.ok) {
      throw new Error(`GitHub user "${username}" not found.`)
    }

    const userData = await userResponse.json()

    // Fetch user's events (contributions) - encode username
    const eventsResponse = await fetch(`https://api.github.com/users/${encodedUsername}/events/public?per_page=100`, {
      headers: {
        Accept: 'application/vnd.github+json'
      }
    })

    if (!eventsResponse.ok) {
      throw new Error(`Failed to fetch events for "${username}".`)
    }

    const events: any[] = await eventsResponse.json()

    // Process events into contributions
    const contributions: Contribution[] = []
    const repositories = new Set<string>()
    const languages = new Set<string>()
    const contributionDates = new Set<string>()

    events.forEach((event) => {
      const date = new Date(event.created_at).toISOString().split('T')[0]
      contributionDates.add(date)

      switch (event.type) {
        case 'IssuesEvent':
          if (event.payload.action === 'closed' || event.payload.action === 'opened') {
            contributions.push({
              id: event.id,
              type: 'issue',
              repository: event.repo.name,
              repositoryUrl: `https://github.com/${event.repo.name}`,
              title: event.payload.issue?.title || 'Issue',
              url: event.payload.issue?.html_url || '',
              state: event.payload.action === 'closed' ? 'closed' : 'open',
              createdAt: event.payload.issue?.created_at || event.created_at,
              updatedAt: event.payload.issue?.updated_at || event.created_at,
              closedAt: event.payload.action === 'closed' ? event.created_at : undefined,
              labels: event.payload.issue?.labels?.map((l: any) => l.name) || []
            })
            repositories.add(event.repo.name)
          }
          break

        case 'PullRequestEvent':
          if (event.payload.action === 'closed' && event.payload.pull_request?.merged) {
            contributions.push({
              id: event.id,
              type: 'pr',
              repository: event.repo.name,
              repositoryUrl: `https://github.com/${event.repo.name}`,
              title: event.payload.pull_request?.title || 'Pull Request',
              url: event.payload.pull_request?.html_url || '',
              state: 'merged',
              createdAt: event.payload.pull_request?.created_at || event.created_at,
              updatedAt: event.payload.pull_request?.updated_at || event.created_at,
              mergedAt: event.created_at,
              additions: event.payload.pull_request?.additions || 0,
              deletions: event.payload.pull_request?.deletions || 0,
              comments: event.payload.pull_request?.comments || 0
            })
            repositories.add(event.repo.name)
          }
          break

        case 'PushEvent':
          contributions.push({
            id: event.id,
            type: 'commit',
            repository: event.repo.name,
            repositoryUrl: `https://github.com/${event.repo.name}`,
            title: event.payload.commits?.[0]?.message || 'Commit',
            url: `https://github.com/${event.repo.name}/commit/${event.payload.head}`,
            state: 'closed',
            createdAt: event.created_at,
            updatedAt: event.created_at
          })
          repositories.add(event.repo.name)
          break
      }
    })

    // Calculate statistics
    const issuesClosed = contributions.filter(c => c.type === 'issue' && c.state === 'closed').length
    const prsMerged = contributions.filter(c => c.type === 'pr' && c.state === 'merged').length
    const commits = contributions.filter(c => c.type === 'commit').length
    const reviews = contributions.filter(c => c.type === 'review').length

    // Calculate streaks
    const sortedDates = Array.from(contributionDates).sort()
    const { currentStreak, longestStreak } = calculateStreaks(sortedDates)

    // Get date ranges
    const firstContributionDate = sortedDates[0] || new Date().toISOString()
    const lastContributionDate = sortedDates[sortedDates.length - 1] || new Date().toISOString()

    // Calculate time-based contributions
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    const contributionsThisWeek = contributions.filter(c => 
      new Date(c.createdAt) >= weekAgo
    ).length

    const contributionsThisMonth = contributions.filter(c => 
      new Date(c.createdAt) >= monthAgo
    ).length

    const contributionsThisYear = contributions.filter(c => 
      new Date(c.createdAt) >= yearAgo
    ).length

    // Generate achievements
    const achievements = generateAchievements({
      issuesClosed,
      prsMerged,
      commits,
      currentStreak,
      repositoriesContributed: repositories.size,
      totalContributions: contributions.length
    })

    const stats: ContributorStats = {
      username: userData.login,
      avatarUrl: userData.avatar_url,
      profileUrl: userData.html_url,
      totalContributions: contributions.length,
      issuesClosed,
      prsMerged,
      commits,
      reviews,
      repositoriesContributed: repositories.size,
      languages: Array.from(languages),
      impactScore: 0, // Will be calculated below
      currentStreak,
      longestStreak,
      contributionsThisWeek,
      contributionsThisMonth,
      contributionsThisYear,
      firstContributionDate,
      lastContributionDate,
      achievements,
      contributions // Include contributions array
    }

    // Calculate impact score
    stats.impactScore = calculateImpactScore(stats)

    return stats
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch contributor data')
  }
}

/**
 * Calculate contribution streaks
 */
function calculateStreaks(dates: string[]): { currentStreak: number; longestStreak: number } {
  if (dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 1

  // Sort dates and reverse to start from most recent
  const sorted = [...dates].sort().reverse()
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Calculate current streak (from today/yesterday backwards)
  let expectedDate = sorted[0] === today ? today : yesterday
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] === expectedDate) {
      currentStreak++
      const date = new Date(expectedDate)
      date.setDate(date.getDate() - 1)
      expectedDate = date.toISOString().split('T')[0]
    } else if (i === 0 && sorted[i] !== today && sorted[i] !== yesterday) {
      // No contribution today or yesterday, streak is 0
      break
    } else {
      break
    }
  }

  // Calculate longest streak
  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i - 1])
    const currDate = new Date(sorted[i])
    const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      tempStreak++
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak)

  return { currentStreak, longestStreak }
}

/**
 * Generate achievements based on contributor stats
 */
function generateAchievements(stats: {
  issuesClosed: number
  prsMerged: number
  commits: number
  currentStreak: number
  repositoriesContributed: number
  totalContributions: number
}): Achievement[] {
  const achievements: Achievement[] = []
  const now = new Date().toISOString()

  // First contribution
  if (stats.totalContributions > 0) {
    achievements.push({
      id: 'first-contribution',
      name: 'First Steps',
      description: 'Made your first contribution',
      icon: '🎯',
      unlockedAt: now,
      rarity: 'common'
    })
  }

  // Issue closer
  if (stats.issuesClosed >= 10) {
    achievements.push({
      id: 'issue-closer',
      name: 'Bug Hunter',
      description: `Closed ${stats.issuesClosed} issues`,
      icon: '🐛',
      unlockedAt: now,
      rarity: stats.issuesClosed >= 100 ? 'legendary' : stats.issuesClosed >= 50 ? 'epic' : 'rare'
    })
  }

  // PR master
  if (stats.prsMerged >= 10) {
    achievements.push({
      id: 'pr-master',
      name: 'Code Contributor',
      description: `Merged ${stats.prsMerged} pull requests`,
      icon: '💻',
      unlockedAt: now,
      rarity: stats.prsMerged >= 100 ? 'legendary' : stats.prsMerged >= 50 ? 'epic' : 'rare'
    })
  }

  // Streak achievements
  if (stats.currentStreak >= 7) {
    achievements.push({
      id: 'week-streak',
      name: 'Consistent Contributor',
      description: `${stats.currentStreak} day streak`,
      icon: '🔥',
      unlockedAt: now,
      rarity: stats.currentStreak >= 365 ? 'legendary' : stats.currentStreak >= 100 ? 'epic' : 'rare'
    })
  }

  // Multi-repo contributor
  if (stats.repositoriesContributed >= 10) {
    achievements.push({
      id: 'multi-repo',
      name: 'Open Source Explorer',
      description: `Contributed to ${stats.repositoriesContributed} repositories`,
      icon: '🌍',
      unlockedAt: now,
      rarity: stats.repositoriesContributed >= 100 ? 'legendary' : stats.repositoriesContributed >= 50 ? 'epic' : 'rare'
    })
  }

  return achievements
}

/**
 * Build contribution timeline from contributions
 */
export function buildContributionTimeline(contributions: Contribution[]): ContributionTimelineItem[] {
  const timelineMap = new Map<string, Contribution[]>()

  contributions.forEach(contribution => {
    const date = new Date(contribution.createdAt).toISOString().split('T')[0]
    if (!timelineMap.has(date)) {
      timelineMap.set(date, [])
    }
    timelineMap.get(date)!.push(contribution)
  })

  return Array.from(timelineMap.entries())
    .map(([date, contribs]) => ({
      date,
      contributions: contribs,
      count: contribs.length
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

