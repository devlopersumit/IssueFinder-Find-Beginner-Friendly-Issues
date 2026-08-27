export type RepoHealthInfo = {
  isHealthy: boolean
  stars: number
  forks: number
  pushedAt: string | null
}

export const HEALTH_THRESHOLDS = {
  minStars: 50,
  minForks: 10,
  maxDaysSincePush: 14,
} as const

type GitHubRepoResponse = {
  stargazers_count: number
  forks_count: number
  archived: boolean
  disabled?: boolean
  pushed_at: string | null
  description?: string | null
}

export function evaluateRepoHealth(repoData: GitHubRepoResponse): boolean {
  if (repoData.archived || repoData.disabled) return false

  const daysSincePush = repoData.pushed_at
    ? (Date.now() - new Date(repoData.pushed_at).getTime()) / (1000 * 60 * 60 * 24)
    : Infinity

  if (daysSincePush > HEALTH_THRESHOLDS.maxDaysSincePush) return false

  const hasCommunity =
    repoData.stargazers_count >= HEALTH_THRESHOLDS.minStars ||
    repoData.forks_count >= HEALTH_THRESHOLDS.minForks

  return hasCommunity
}

export async function fetchRepositoryHealth(repoUrl: string): Promise<RepoHealthInfo> {
  const fallback: RepoHealthInfo = { isHealthy: true, stars: 0, forks: 0, pushedAt: null }

  try {
    const cacheKey = `repoHealth_${repoUrl}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const { health, timestamp } = JSON.parse(cached)
      const cacheAge = Date.now() - timestamp
      const cacheMaxAge = 6 * 60 * 60 * 1000
      if (cacheAge < cacheMaxAge && health) {
        return health as RepoHealthInfo
      }
    }
  } catch {
    // ignore cache errors
  }

  try {
    const parts = repoUrl.replace('https://api.github.com/repos/', '').split('/')
    if (parts.length < 2) return { ...fallback, isHealthy: false }

    const [owner, repo] = parts
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: 'application/vnd.github+json' },
    })

    if (response.status === 403 || response.status === 429) {
      return fallback
    }

    if (!response.ok) {
      return { ...fallback, isHealthy: false }
    }

    const repoData: GitHubRepoResponse = await response.json()
    const health: RepoHealthInfo = {
      isHealthy: evaluateRepoHealth(repoData),
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      pushedAt: repoData.pushed_at,
    }

    try {
      localStorage.setItem(
        `repoHealth_${repoUrl}`,
        JSON.stringify({ health, timestamp: Date.now() })
      )
    } catch {
      // ignore storage errors
    }

    return health
  } catch {
    return fallback
  }
}

export async function fetchRepositoryHealthBatch(
  repoUrls: string[],
  delayMs = 200
): Promise<Record<string, RepoHealthInfo>> {
  const uniqueUrls = Array.from(new Set(repoUrls))
  const results: Record<string, RepoHealthInfo> = {}

  for (let i = 0; i < uniqueUrls.length; i++) {
    if (i > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
    const url = uniqueUrls[i]
    results[url] = await fetchRepositoryHealth(url)
  }

  return results
}
