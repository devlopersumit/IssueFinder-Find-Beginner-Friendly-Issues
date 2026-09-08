import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCT_NAME, TAGLINE } from '../constants/brand'
import { useFetchIssues } from '../hooks/useFetchIssues'
import { buildGitHubQuery } from '../utils/queryBuilder'
import { detectDifficulty } from '../utils/difficulty'
import { fetchRepositoryHealthBatch } from '../utils/repoHealth'

const PREVIEW_COUNT = 3
const ROTATE_MS = 40_000
const FALLBACK_POOL = 12

const fallbackIssues = [
  {
    id: 'fallback-1',
    html_url: '/issues',
    repo: 'facebook / react',
    title: 'Improve docs for concurrent features',
    meta: 'TypeScript · updated today · Beginner',
  },
  {
    id: 'fallback-2',
    html_url: '/issues',
    repo: 'vercel / next.js',
    title: 'Clarify error message for missing env vars',
    meta: 'JavaScript · updated yesterday · Beginner',
  },
  {
    id: 'fallback-3',
    html_url: '/issues',
    repo: 'rust-lang / rust',
    title: 'Help wanted: polish compiler diagnostics',
    meta: 'Rust · updated 2d ago · Intermediate',
  },
]

function formatUpdated(dateString?: string, createdAt?: string): string {
  const raw = dateString || createdAt
  if (!raw) return 'recently'

  const date = new Date(raw)
  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'updated today'
  if (diffDays === 1) return 'updated yesterday'
  if (diffDays < 7) return `updated ${diffDays}d ago`
  return `updated ${Math.floor(diffDays / 7)}w ago`
}

function formatDifficulty(labels: Array<{ name?: string; color?: string }>): string {
  const difficulty = detectDifficulty(labels)
  if (!difficulty) return 'Open'
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
}

function formatRepo(repositoryUrl: string): string {
  const parts = repositoryUrl.split('/').slice(-2)
  if (parts.length < 2) return repositoryUrl
  return `${parts[0]} / ${parts[1]}`
}

const Hero: React.FC = () => {
  const previewQuery = useMemo(
    () =>
      buildGitHubQuery({
        selectedCategories: ['good first issue', 'help wanted'],
        selectedLastActivity: 'last-week',
      }),
    []
  )

  const { data, isLoading } = useFetchIssues(previewQuery, 1, FALLBACK_POOL)
  const [healthyRepos, setHealthyRepos] = useState<Record<string, boolean>>({})
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const items = data?.items
    if (!items?.length) return

    const repoUrls = Array.from(
      new Set(items.map((item) => item.repository_url).filter(Boolean))
    )

    let cancelled = false
    fetchRepositoryHealthBatch(repoUrls, 120).then((results) => {
      if (cancelled) return
      const next: Record<string, boolean> = {}
      for (const [url, info] of Object.entries(results)) {
        next[url] = info.isHealthy
      }
      setHealthyRepos(next)
    })

    return () => {
      cancelled = true
    }
  }, [data])

  useEffect(() => {
    const id = window.setInterval(() => {
      setRotation((prev) => prev + 1)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [])

  const livePreview = useMemo(() => {
    const items = data?.items
    if (!items?.length) return []

    const healthReady = Object.keys(healthyRepos).length > 0
    const uniqueByRepo = new Map<string, (typeof items)[number]>()

    for (const issue of items) {
      const repoUrl = issue.repository_url
      if (!repoUrl || uniqueByRepo.has(repoUrl)) continue
      if (healthReady && healthyRepos[repoUrl] === false) continue
      uniqueByRepo.set(repoUrl, issue)
    }

    const pool = Array.from(uniqueByRepo.values())
    if (pool.length === 0) return []

    const start = rotation % pool.length
    const picked = []
    for (let i = 0; i < Math.min(PREVIEW_COUNT, pool.length); i++) {
      picked.push(pool[(start + i) % pool.length])
    }

    return picked.map((issue) => ({
      id: String(issue.id),
      html_url: issue.html_url,
      repo: formatRepo(issue.repository_url),
      title: issue.title,
      meta: `${formatUpdated(issue.updated_at, issue.created_at)} · ${formatDifficulty(issue.labels || [])}`,
    }))
  }, [data, healthyRepos, rotation])

  const previewIssues = livePreview.length > 0 ? livePreview : fallbackIssues
  const isLive = livePreview.length > 0

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(13,148,136,0.14),transparent_55%),radial-gradient(ellipse_50%_40%_at_90%_10%,rgba(20,20,20,0.04),transparent),linear-gradient(180deg,#fafafa_0%,#f4f4f5_100%)] dark:bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(45,212,191,0.12),transparent_55%),linear-gradient(180deg,#09090b_0%,#18181b_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(20,20,20,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,20,20,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 85%)',
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl px-4 pb-10 pt-16 sm:px-6 sm:pb-14 sm:pt-20 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="animate-fade-up font-display text-2xl font-medium tracking-tight text-ink dark:text-white sm:text-3xl">
            {PRODUCT_NAME}
          </p>
          <h1
            className="animate-fade-up mt-5 font-display text-4xl font-medium leading-[1.12] text-ink sm:text-5xl sm:leading-[1.08] lg:text-6xl dark:text-white"
            style={{ animationDelay: '80ms' }}
          >
            The fastest path to your first open-source PR
          </h1>
          <p
            className="animate-fade-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl dark:text-zinc-400"
            style={{ animationDelay: '160ms' }}
          >
            {TAGLINE}
          </p>
          <div
            className="animate-fade-up mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: '240ms' }}
          >
            <Link to="/issues" className="btn-primary px-7 py-3 text-base">
              Browse fresh issues
            </Link>
            <Link
              to="/beginner-guide"
              className="text-sm font-semibold text-ink-soft underline-offset-4 transition hover:text-ink hover:underline dark:text-zinc-300 dark:hover:text-white"
            >
              New here? Read the guide →
            </Link>
          </div>
        </div>

        <div
          className="animate-fade-up mx-auto mt-14 max-w-3xl sm:mt-16"
          style={{ animationDelay: '320ms' }}
        >
          <div className="overflow-hidden rounded-xl border border-paper-line/80 bg-white/90 shadow-soft backdrop-blur-sm dark:border-zinc-700/80 dark:bg-zinc-900/90">
            <div className="flex items-center justify-between border-b border-paper-line px-4 py-3 dark:border-zinc-800">
              <span className="text-xs font-medium tracking-wide text-ink-muted">
                Live preview · fresh & maintained only
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-accent">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                {isLive ? 'Refreshes every 45 min' : isLoading ? 'Loading…' : 'Sample issues'}
              </span>
            </div>
            <ul className="divide-y divide-paper-line dark:divide-zinc-800">
              {isLoading && !isLive
                ? Array.from({ length: PREVIEW_COUNT }).map((_, idx) => (
                    <li key={idx} className="animate-pulse px-4 py-4 sm:px-5">
                      <div className="h-3 w-28 rounded bg-zinc-200 dark:bg-zinc-700" />
                      <div className="mt-2 h-5 w-3/4 max-w-md rounded bg-zinc-200 dark:bg-zinc-700" />
                      <div className="mt-2 h-3 w-40 rounded bg-zinc-200 dark:bg-zinc-700" />
                    </li>
                  ))
                : previewIssues.map((issue) => {
                    const rowClass =
                      'block px-4 py-4 text-left transition hover:bg-zinc-50 sm:px-5 dark:hover:bg-zinc-800/60'
                    const body = (
                      <>
                        <p className="text-sm font-semibold text-ink dark:text-zinc-100">
                          {issue.repo}
                        </p>
                        <p className="mt-1 font-display text-lg font-medium leading-snug text-ink dark:text-white">
                          {issue.title}
                        </p>
                        <p className="mt-1.5 text-xs text-ink-muted">{issue.meta}</p>
                      </>
                    )

                    return (
                      <li key={issue.id}>
                        {issue.html_url.startsWith('http') ? (
                          <a
                            href={issue.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className={rowClass}
                          >
                            {body}
                          </a>
                        ) : (
                          <Link to={issue.html_url} className={rowClass}>
                            {body}
                          </Link>
                        )}
                      </li>
                    )
                  })}
            </ul>
            <div className="border-t border-paper-line bg-zinc-50/80 px-4 py-3 text-center dark:border-zinc-800 dark:bg-zinc-950/50">
              <Link
                to="/issues"
                className="text-sm font-semibold text-accent transition hover:text-accent-dark"
              >
                See all matching issues →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
