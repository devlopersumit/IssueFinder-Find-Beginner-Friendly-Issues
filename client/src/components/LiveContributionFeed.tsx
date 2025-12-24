import React, { useMemo } from 'react'
import { useLiveContributions, type Contribution } from '../hooks/useLiveContributions'

type LiveContributionFeedProps = {
  limit?: number
  className?: string
}

const LiveContributionFeed: React.FC<LiveContributionFeedProps> = ({ limit = 10, className = '' }) => {
  const { contributions, isLoading, error, refresh } = useLiveContributions(limit)

  const getContributionMessage = (contribution: Contribution): string => {
    const actor = contribution.actor.login
    const repo = contribution.repo.name.split('/')[1] || contribution.repo.name

    switch (contribution.type) {
      case 'PushEvent':
        const commitCount = contribution.payload?.commits?.length || 1
        return `${actor} pushed ${commitCount} ${commitCount === 1 ? 'commit' : 'commits'} to ${repo}`
      
      case 'IssuesEvent':
        const issueAction = contribution.action === 'opened' ? 'opened' : contribution.action === 'closed' ? 'closed' : 'updated'
        return `${actor} ${issueAction} an issue in ${repo}`
      
      case 'PullRequestEvent':
        const prAction = contribution.action === 'opened' ? 'opened' : contribution.action === 'closed' ? 'merged' : 'updated'
        return `${actor} ${prAction} a pull request in ${repo}`
      
      case 'CreateEvent':
        return `${actor} created something new in ${repo}`
      
      default:
        return `${actor} contributed to ${repo}`
    }
  }

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  // Calculate stats
  const stats = useMemo(() => {
    const commits = contributions.filter(c => c.type === 'PushEvent').length
    const prs = contributions.filter(c => c.type === 'PullRequestEvent').length
    const issues = contributions.filter(c => c.type === 'IssuesEvent').length
    const contributors = new Set(contributions.map(c => c.actor.login)).size
    
    // Get popular repos
    const repoCounts: Record<string, number> = {}
    contributions.forEach(c => {
      const repoName = c.repo.full_name
      repoCounts[repoName] = (repoCounts[repoName] || 0) + 1
    })
    const popularRepos = Object.entries(repoCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name]) => name)

    return { commits, prs, issues, contributors, popularRepos }
  }, [contributions])

  if (error) {
    return (
      <div className={`border border-red-500 dark:border-[#f85149] bg-red-50 dark:bg-[#161b22] p-4 ${className}`}>
        <p className="text-sm text-red-600 dark:text-[#f85149] font-mono">[ERROR] Failed to load live contributions</p>
      </div>
    )
  }

  return (
    <div className={`border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] font-mono ${className}`}>
      {/* Terminal-style Header */}
      <div className="border-b border-gray-300 dark:border-[#30363d] bg-gray-50 dark:bg-[#161b22] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 dark:text-[#7ee787] text-sm">▶</span>
              <span className="text-blue-600 dark:text-[#58a6ff] text-sm font-semibold">live-contributions</span>
            </div>
            <span className="text-gray-600 dark:text-[#8b949e] text-xs">[GitHub Events API]</span>
          </div>
          <button
            onClick={refresh}
            className="text-xs text-gray-600 dark:text-[#8b949e] hover:text-gray-900 dark:hover:text-[#c9d1d9] transition-colors px-2 py-1 border border-gray-300 dark:border-[#30363d] hover:border-blue-500 dark:hover:border-[#58a6ff] rounded"
            disabled={isLoading}
          >
            {isLoading ? '[REFRESHING...]' : '[REFRESH]'}
          </button>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-[#0d1117]">
        {isLoading && contributions.length === 0 ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-6 w-6 rounded bg-gray-200 dark:bg-[#21262d]" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-3/4 bg-gray-200 dark:bg-[#21262d] rounded" />
                  <div className="h-2 w-1/2 bg-gray-200 dark:bg-[#21262d] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : contributions.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-[#8b949e] text-center py-4">[INFO] No recent contributions found</p>
        ) : (
          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {contributions.map((contribution, idx) => (
              <a
                key={contribution.id}
                href={contribution.repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 border-l-2 border-transparent hover:border-blue-500 dark:hover:border-[#58a6ff] hover:bg-gray-50 dark:hover:bg-[#161b22] transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={contribution.actor.avatar_url}
                    alt={contribution.actor.login}
                    className="h-6 w-6 rounded flex-shrink-0 border border-gray-300 dark:border-[#30363d]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-emerald-600 dark:text-[#7ee787] text-xs font-semibold">[{idx + 1}]</span>
                      <span className="text-blue-600 dark:text-[#58a6ff] text-xs font-semibold">{contribution.actor.login}</span>
                      <span className="text-gray-500 dark:text-[#8b949e] text-xs">→</span>
                      <span className="text-gray-900 dark:text-[#c9d1d9] text-xs">
                        {getContributionMessage(contribution)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-[#8b949e]">
                      <span className="text-orange-600 dark:text-[#f0883e]">{contribution.repo.full_name}</span>
                      <span>•</span>
                      <span>{getTimeAgo(contribution.created_at)}</span>
                      <span>•</span>
                      <span className="text-purple-600 dark:text-[#d2a8ff]">{contribution.type}</span>
                    </div>
                  </div>
                  <span className="text-gray-400 dark:text-[#8b949e] opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      {contributions.length > 0 && (
        <div className="border-t border-gray-300 dark:border-[#30363d] bg-gray-50 dark:bg-[#161b22] px-4 py-3">
          <div className="grid grid-cols-4 gap-4 mb-3">
            <div>
              <div className="text-xs text-gray-600 dark:text-[#8b949e] mb-1">COMMITS</div>
              <div className="text-sm font-semibold text-emerald-600 dark:text-[#7ee787]">{stats.commits}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-[#8b949e] mb-1">PULL REQUESTS</div>
              <div className="text-sm font-semibold text-blue-600 dark:text-[#58a6ff]">{stats.prs}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-[#8b949e] mb-1">ISSUES</div>
              <div className="text-sm font-semibold text-orange-600 dark:text-[#f0883e]">{stats.issues}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-[#8b949e] mb-1">CONTRIBUTORS</div>
              <div className="text-sm font-semibold text-purple-600 dark:text-[#d2a8ff]">{stats.contributors}</div>
            </div>
          </div>
          {stats.popularRepos.length > 0 && (
            <div className="border-t border-gray-300 dark:border-[#30363d] pt-3 mt-3">
              <div className="text-xs text-gray-600 dark:text-[#8b949e] mb-2">TRENDING REPOS:</div>
              <div className="flex flex-wrap gap-2">
                {stats.popularRepos.map((repo, idx) => (
                  <a
                    key={idx}
                    href={`https://github.com/${repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-[#58a6ff] hover:text-blue-700 dark:hover:text-[#79c0ff] hover:underline border border-gray-300 dark:border-[#30363d] px-2 py-1 rounded hover:border-blue-500 dark:hover:border-[#58a6ff] transition-colors"
                  >
                    {repo}
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="border-t border-gray-300 dark:border-[#30363d] pt-3 mt-3 text-xs text-gray-600 dark:text-[#8b949e]">
            <span className="text-emerald-600 dark:text-[#7ee787]">●</span> Auto-refresh every 30s
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveContributionFeed

