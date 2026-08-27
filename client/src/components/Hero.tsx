import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildGitHubQuery } from '../utils/queryBuilder'
import { HEALTH_THRESHOLDS } from '../utils/repoHealth'
import { getIssuesCached, setIssuesCached } from '../utils/requestCache'

type QualitySignal = {
  label: string
  value: string
  description: string
}

const qualitySignals: QualitySignal[] = [
  {
    label: 'Issue freshness',
    value: '≤ 7 days',
    description: 'Only issues with recent activity make it through',
  },
  {
    label: 'Repo maintenance',
    value: `≤ ${HEALTH_THRESHOLDS.maxDaysSincePush} days`,
    description: 'Repos must have been pushed to recently',
  },
  {
    label: 'Project trust',
    value: `≥ ${HEALTH_THRESHOLDS.minStars}★ / ${HEALTH_THRESHOLDS.minForks}⑂`,
    description: 'Stars or forks signal a real community',
  },
  {
    label: 'Difficulty tags',
    value: 'Auto',
    description: 'Beginner, intermediate, and advanced labels detected',
  },
]

function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`
  return count.toLocaleString()
}

const Hero: React.FC = () => {
  const [liveIssueCount, setLiveIssueCount] = useState<number | null>(null)
  const [isLoadingCount, setIsLoadingCount] = useState(true)

  useEffect(() => {
    const query = buildGitHubQuery({})
    const cacheKey = `hero_issue_count_${query}`

    const cached = getIssuesCached<number>(cacheKey)
    if (cached !== null) {
      setLiveIssueCount(cached)
      setIsLoadingCount(false)
      return
    }

    const controller = new AbortController()

    async function fetchCount() {
      try {
        const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=1`
        const response = await fetch(url, {
          headers: { Accept: 'application/vnd.github+json' },
          signal: controller.signal,
        })

        if (!response.ok) return

        const data = await response.json()
        if (typeof data.total_count === 'number') {
          setIssuesCached(cacheKey, data.total_count)
          setLiveIssueCount(data.total_count)
        }
      } catch {
        // silently fail — criteria cards still show value
      } finally {
        setIsLoadingCount(false)
      }
    }

    fetchCount()
    return () => controller.abort()
  }, [])

  return (
    <section className="relative overflow-hidden border-b border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] font-mono">
      <div className="border-b border-gray-300 dark:border-[#30363d] bg-gray-50 dark:bg-[#161b22] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-600 dark:text-[#8b949e] ml-2">issuefinder.fun</span>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:py-12 lg:py-20">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 border border-gray-300 dark:border-[#30363d] bg-gray-50 dark:bg-[#161b22] px-3 py-1 sm:px-4 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-[#8b949e]">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-600 dark:bg-[#7ee787]" />
              <span className="text-emerald-600 dark:text-[#7ee787]">▶</span>
              <span className="hidden sm:inline">live open source intelligence</span>
              <span className="sm:hidden">live osi</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-2 sm:gap-3 border-l-2 border-emerald-600 dark:border-[#7ee787] bg-gray-50 dark:bg-[#161b22] px-3 py-2 sm:px-5 sm:py-2.5 w-full sm:w-fit mx-auto lg:mx-0">
                <span className="text-emerald-600 dark:text-[#7ee787] text-sm flex-shrink-0 mt-0.5">$</span>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-[#c9d1d9] leading-relaxed">
                  Ready to make your first contribution? Start here and find issues that match your skills!
                </p>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-gray-900 dark:text-[#c9d1d9] leading-tight">
                <span className="text-blue-600 dark:text-[#58a6ff]">find</span>{' '}
                <span className="text-purple-600 dark:text-[#d2a8ff]">github</span>{' '}
                <span className="text-emerald-600 dark:text-[#7ee787]">issues</span>
                <br className="hidden sm:block" />
                <span className="text-gray-700 dark:text-[#8b949e]">that match your skills</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-[#8b949e] leading-relaxed px-2 sm:px-0">
                Stop wasting time searching. We show you open-source projects and issues that are perfect for you. Filter by your favorite programming language, difficulty level, and start contributing today.
              </p>
            </div>

            <div className="flex flex-col items-stretch sm:items-center gap-2 sm:gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to="/categories"
                className="inline-flex items-center justify-center border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-gray-900 dark:text-[#c9d1d9] transition-colors hover:bg-gray-50 dark:hover:bg-[#161b22] hover:border-blue-500 dark:hover:border-[#58a6ff]"
              >
                <span className="text-emerald-600 dark:text-[#7ee787] mr-2">▶</span>
                Explore categories
              </Link>
              <Link
                to="/beginner-guide"
                className="inline-flex items-center justify-center border border-emerald-600 dark:border-[#7ee787] bg-emerald-50 dark:bg-[#238636] px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-emerald-700 dark:text-[#c9d1d9] transition-colors hover:bg-emerald-100 dark:hover:bg-[#2ea043]"
              >
                <span className="text-emerald-600 dark:text-[#7ee787] mr-2">$</span>
                Beginner Guide
              </Link>
              <Link
                to="/bounty"
                className="inline-flex items-center justify-center border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-gray-800 dark:text-[#c9d1d9] transition-colors hover:bg-gray-50 dark:hover:bg-[#161b22]"
              >
                <span className="text-orange-600 dark:text-[#f0883e] mr-2">▶</span>
                View bounty issues
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-[#8b949e] lg:justify-start px-2 sm:px-0">
              <span className="text-emerald-600 dark:text-[#7ee787] flex-shrink-0">✓</span>
              <span className="text-center sm:text-left">
                Live data from GitHub — filtered for freshness and repo health, refreshed every 15 minutes.
              </span>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="border border-gray-300 dark:border-[#30363d] bg-gray-50 dark:bg-[#161b22] p-4 sm:p-6">
              <div className="mb-4 sm:mb-6 border-b border-gray-300 dark:border-[#30363d] pb-3 sm:pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-600 dark:text-[#7ee787] text-sm">▶</span>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-[#8b949e]">
                    How we filter issues
                  </p>
                </div>
                <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-[#c9d1d9]">
                  Quality rules, not fake stats
                </h2>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 dark:text-[#8b949e] leading-relaxed">
                  Every issue passes these checks before we show it. No inflated numbers — just the criteria we actually use.
                </p>
              </div>

              <div className="mb-4 sm:mb-6 rounded-lg border border-emerald-300 dark:border-[#238636] bg-emerald-50 dark:bg-[#0d4432]/40 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-[#7ee787]">
                  Matching on GitHub right now
                </p>
                <p className="mt-1 text-2xl font-bold text-emerald-800 dark:text-[#7ee787]">
                  {isLoadingCount ? (
                    <span className="inline-block h-7 w-24 animate-pulse rounded bg-emerald-200 dark:bg-[#238636]/50" />
                  ) : liveIssueCount !== null ? (
                    `${formatCount(liveIssueCount)}+ issues`
                  ) : (
                    'Live from GitHub'
                  )}
                </p>
                <p className="mt-1 text-xs text-emerald-700/80 dark:text-[#7ee787]/80">
                  Open, unassigned, updated this week — good first issue or help wanted
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {qualitySignals.map((item) => (
                  <div
                    key={item.label}
                    className="border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] p-3 sm:p-4 text-left"
                  >
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-[#8b949e]">
                      {item.label}
                    </dt>
                    <dd className="mt-1 sm:mt-2 text-lg sm:text-xl font-semibold text-blue-600 dark:text-[#58a6ff]">
                      {item.value}
                    </dd>
                    <p className="mt-1 text-xs text-gray-600 dark:text-[#8b949e] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
