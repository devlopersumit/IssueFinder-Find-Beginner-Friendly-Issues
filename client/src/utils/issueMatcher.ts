export type UserProfile = {
  username?: string
  languages?: string[]
  repositories?: string[]
  contributions?: number
  preferredTopics?: string[]
}

export type IssueMatch = {
  issue: any
  matchScore: number
  reasons: string[]
  matchedLanguages?: string[]
  matchedTopics?: string[]
}

/**
 * Calculate match score between user profile and an issue
 * Returns a score from 0-100
 */
export function calculateMatchScore(
  issue: any,
  profile: UserProfile
): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []
  const matchedLanguages: string[] = []
  const matchedTopics: string[] = []

  // If no profile provided, return low score
  if (!profile.username && (!profile.languages || profile.languages.length === 0)) {
    return { score: 0, reasons: [] }
  }

  // Extract issue information
  const issueLabels = (issue.labels || []).map((l: any) => l.name?.toLowerCase() || '').filter(Boolean)
  const issueTitle = (issue.title || '').toLowerCase()
  const issueBody = (issue.body || '').toLowerCase()
  const repoUrl = issue.repository_url || ''
  const repoName = repoUrl.split('/').pop() || ''

  // Language matching (40 points)
  if (profile.languages && profile.languages.length > 0) {
    const languageKeywords: Record<string, string[]> = {
      javascript: ['javascript', 'js', 'node', 'react', 'vue', 'angular'],
      typescript: ['typescript', 'ts', 'tsx'],
      python: ['python', 'py', 'django', 'flask', 'pandas'],
      java: ['java', 'spring', 'maven'],
      go: ['go', 'golang'],
      rust: ['rust', 'rs'],
      php: ['php', 'laravel', 'symfony'],
      ruby: ['ruby', 'rails'],
      cpp: ['c++', 'cpp', 'cplusplus'],
      csharp: ['c#', 'csharp', '.net'],
    }

    for (const lang of profile.languages) {
      const keywords = languageKeywords[lang.toLowerCase()] || [lang.toLowerCase()]
      const found = keywords.some(keyword => 
        issueTitle.includes(keyword) || 
        issueBody.includes(keyword) ||
        repoName.toLowerCase().includes(keyword)
      )
      
      if (found) {
        score += 40 / profile.languages.length
        matchedLanguages.push(lang)
        reasons.push(`Matches your ${lang} experience`)
      }
    }
  }

  // Repository matching (20 points)
  if (profile.repositories && profile.repositories.length > 0) {
    const repoMatch = profile.repositories.some(repo => 
      repoUrl.toLowerCase().includes(repo.toLowerCase())
    )
    if (repoMatch) {
      score += 20
      reasons.push('From a repository you follow')
    }
  }

  // Topic/Interest matching (20 points)
  if (profile.preferredTopics && profile.preferredTopics.length > 0) {
    for (const topic of profile.preferredTopics) {
      const topicLower = topic.toLowerCase()
      if (issueTitle.includes(topicLower) || issueBody.includes(topicLower)) {
        score += 20 / profile.preferredTopics.length
        matchedTopics.push(topic)
        reasons.push(`Related to ${topic}`)
      }
    }
  }

  // Label matching (10 points)
  const beginnerLabels = ['good first issue', 'beginner', 'first-timers-only', 'starter']
  const hasBeginnerLabel = issueLabels.some((label: string) => 
    beginnerLabels.some(bl => label.includes(bl))
  )
  
  if (hasBeginnerLabel && (!profile.contributions || profile.contributions < 5)) {
    score += 10
    reasons.push('Perfect for beginners')
  }

  // Issue freshness (10 points)
  if (issue.updated_at) {
    const updatedDate = new Date(issue.updated_at)
    const daysSinceUpdate = (Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceUpdate < 7) {
      score += 10
      reasons.push('Recently updated')
    } else if (daysSinceUpdate < 30) {
      score += 5
    }
  }

  // Cap score at 100
  score = Math.min(100, Math.round(score))

  return { score, reasons }
}

/**
 * Match issues against user profile
 */
export function matchIssues(
  issues: any[],
  profile: UserProfile
): IssueMatch[] {
  return issues
    .map(issue => {
      const { score, reasons } = calculateMatchScore(issue, profile)
      return {
        issue,
        matchScore: score,
        reasons,
        matchedLanguages: profile.languages?.filter(lang => 
          reasons.some(r => r.includes(lang))
        ),
        matchedTopics: profile.preferredTopics?.filter(topic =>
          reasons.some(r => r.includes(topic))
        )
      }
    })
    .filter(match => match.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * Fetch user profile from GitHub (if username provided)
 */
export async function fetchUserProfile(username: string): Promise<Partial<UserProfile>> {
  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: { Accept: 'application/vnd.github+json' }
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
        headers: { Accept: 'application/vnd.github+json' }
      })
    ])

    if (!userResponse.ok || !reposResponse.ok) {
      return {}
    }

    const user = await userResponse.json()
    const repos = await reposResponse.json()

    // Extract languages from repositories
    const languageSet = new Set<string>()
    for (const repo of repos.slice(0, 20)) {
      if (repo.language) {
        languageSet.add(repo.language.toLowerCase())
      }
    }

    // Extract repository names
    const repositoryNames = repos.map((r: any) => r.full_name)

    return {
      username: user.login,
      languages: Array.from(languageSet),
      repositories: repositoryNames,
      contributions: user.public_repos || 0
    }
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    return {}
  }
}

