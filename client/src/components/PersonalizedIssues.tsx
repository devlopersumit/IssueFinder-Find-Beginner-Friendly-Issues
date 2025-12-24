import React, { useState } from 'react'
import { usePersonalizedIssues } from '../hooks/usePersonalizedIssues'
import { type IssueMatch } from '../utils/issueMatcher'
import { detectDifficulty } from '../utils/difficulty'

type PersonalizedIssuesProps = {
  className?: string
  limit?: number
}

const PersonalizedIssues: React.FC<PersonalizedIssuesProps> = ({ className = '', limit = 10 }) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [displayLimit, setDisplayLimit] = useState<number>(limit)
  const { matchedIssues, isLoading, error, profile, loadProfileFromGitHub } = usePersonalizedIssues(
    'is:open is:issue no:assignee label:"good first issue"',
    50 // Fetch more issues for "Show More"
  )

  const handleLoadProfile = async () => {
    if (inputValue.trim()) {
      await loadProfileFromGitHub(inputValue.trim())
    }
  }

  const getMatchBadgeColor = (score: number): string => {
    if (score >= 70) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    if (score >= 50) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    if (score >= 30) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }

  const getMatchLabel = (score: number): string => {
    if (score >= 70) return 'Perfect Match'
    if (score >= 50) return 'Great Match'
    if (score >= 30) return 'Good Match'
    return 'Match'
  }

  return (
    <div className={`border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] font-mono ${className}`}>
      {/* Terminal-style Header */}
      <div className="border-b border-gray-300 dark:border-[#30363d] bg-gray-50 dark:bg-[#161b22] px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-emerald-600 dark:text-[#7ee787] text-sm">▶</span>
            <span className="text-blue-600 dark:text-[#58a6ff] text-sm font-semibold">ai-issue-matcher</span>
            <span className="text-gray-600 dark:text-[#8b949e] text-xs">[ML Engine]</span>
          </div>
        </div>

        {/* Profile Input - Terminal Style */}
        <div className="flex gap-2">
          <span className="text-emerald-600 dark:text-[#7ee787] text-sm py-2">$</span>
          <input
            type="text"
            placeholder="github_username"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLoadProfile()}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-gray-900 dark:text-[#c9d1d9] placeholder-gray-500 dark:placeholder-[#6e7681] focus:outline-none focus:border-blue-500 dark:focus:border-[#58a6ff] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#58a6ff] text-sm"
          />
          <button
            onClick={handleLoadProfile}
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-emerald-600 dark:bg-[#238636] text-white dark:text-[#c9d1d9] border border-emerald-700 dark:border-[#2ea043] hover:bg-emerald-700 dark:hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            {isLoading ? '[LOADING...]' : '[MATCH]'}
          </button>
        </div>

        {profile?.username && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-[#8b949e]">
            <span className="text-emerald-600 dark:text-[#7ee787]">✓</span>
            <span>Profile loaded: <span className="text-blue-600 dark:text-[#58a6ff] font-semibold">@{profile.username}</span></span>
            {profile.languages && profile.languages.length > 0 && (
              <span>• <span className="text-purple-600 dark:text-[#d2a8ff]">{profile.languages.length}</span> languages detected</span>
            )}
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-[#0d1117]">
        {error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-600 dark:text-[#f85149]">[ERROR] {error.message}</p>
          </div>
        ) : isLoading && matchedIssues.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-gray-200 dark:bg-[#21262d] rounded w-3/4 mb-2" />
                <div className="h-2 bg-gray-200 dark:bg-[#21262d] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : matchedIssues.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-600 dark:text-[#8b949e]">
              {profile ? '[INFO] No matching issues found. Try adjusting your profile.' : '[INFO] Enter GitHub username to get personalized recommendations!'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {matchedIssues.slice(0, displayLimit).map((match: IssueMatch, idx: number) => {
              const issue = match.issue
              const repo = issue.repository_url?.split('/').slice(-2).join('/')
              const difficulty = detectDifficulty(issue.labels || [])

              return (
                <a
                  key={issue.id}
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 border-l-2 border-transparent hover:border-blue-500 dark:hover:border-[#58a6ff] hover:bg-gray-50 dark:hover:bg-[#161b22] transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-emerald-600 dark:text-[#7ee787] text-xs font-semibold">[{idx + 1}]</span>
                        {match.matchScore > 0 ? (
                          <span className={`px-2 py-0.5 text-xs font-semibold border ${
                            match.matchScore >= 70 
                              ? 'border-emerald-600 dark:border-[#7ee787] text-emerald-600 dark:text-[#7ee787]' 
                              : match.matchScore >= 50 
                              ? 'border-blue-600 dark:border-[#58a6ff] text-blue-600 dark:text-[#58a6ff]' 
                              : 'border-orange-600 dark:border-[#f0883e] text-orange-600 dark:text-[#f0883e]'
                          }`}>
                            {getMatchLabel(match.matchScore)} {match.matchScore}%
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs font-semibold border border-gray-500 dark:border-[#8b949e] text-gray-600 dark:text-[#8b949e]">
                            Good First Issue
                          </span>
                        )}
                        <span className={`text-xs px-1.5 py-0.5 border ${
                          difficulty === 'beginner' 
                            ? 'border-emerald-600 dark:border-[#7ee787] text-emerald-600 dark:text-[#7ee787]' 
                            : difficulty === 'intermediate' 
                            ? 'border-orange-600 dark:border-[#f0883e] text-orange-600 dark:text-[#f0883e]' 
                            : 'border-red-600 dark:border-[#f85149] text-red-600 dark:text-[#f85149]'
                        }`}>
                          {difficulty.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-sm text-gray-900 dark:text-[#c9d1d9] group-hover:text-blue-600 dark:group-hover:text-[#58a6ff] transition-colors line-clamp-2 mb-1">
                        {issue.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-[#8b949e]">
                        <span className="text-orange-600 dark:text-[#f0883e]">{repo}</span>
                        {match.reasons.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-purple-600 dark:text-[#d2a8ff]">{match.reasons[0]}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-400 dark:text-[#8b949e] opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
                  </div>
                </a>
              )
              })}
            </div>
            
            {matchedIssues.length > displayLimit && (
              <div className="mt-4 text-center border-t border-gray-300 dark:border-[#30363d] pt-4">
                <button
                  onClick={() => setDisplayLimit(prev => prev + limit)}
                  className="text-xs text-blue-600 dark:text-[#58a6ff] hover:text-blue-700 dark:hover:text-[#79c0ff] border border-gray-300 dark:border-[#30363d] hover:border-blue-500 dark:hover:border-[#58a6ff] px-4 py-2 transition-colors"
                >
                  [SHOW MORE] +{matchedIssues.length - displayLimit} issues
                </button>
                <p className="text-xs text-gray-600 dark:text-[#8b949e] mt-2">
                  Showing {displayLimit} of {matchedIssues.length} {profile ? 'matched' : 'available'} issues
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {matchedIssues.length > 0 && (
        <div className="border-t border-gray-300 dark:border-[#30363d] px-4 py-3 bg-gray-50 dark:bg-[#161b22]">
          <p className="text-xs text-gray-600 dark:text-[#8b949e] text-center">
            {profile 
              ? `[INFO] Showing ${Math.min(displayLimit, matchedIssues.length)} of ${matchedIssues.length} issues matched to @${profile.username}`
              : `[INFO] Showing ${Math.min(displayLimit, matchedIssues.length)} of ${matchedIssues.length} available issues. Enter GitHub username for personalized recommendations!`}
          </p>
        </div>
      )}
    </div>
  )
}

export default PersonalizedIssues

