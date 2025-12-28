import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { validateGitHubUsername } from '../utils/security'
import Hero from '../components/Hero'

const ProfileSearchForm: React.FC = () => {
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    const validation = validateGitHubUsername(username)
    
    if (!validation.valid) {
      setError(validation.error || 'Invalid username')
      return
    }

    // Sanitize username before navigation
    const sanitized = username.trim().toLowerCase()
    navigate(`/contributor/${encodeURIComponent(sanitized)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6 font-mono">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-emerald-600 dark:text-[#7ee787] text-sm">$</span>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="github_username"
            className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-gray-900 dark:text-[#c9d1d9] placeholder-gray-500 dark:placeholder-[#6e7681] focus:outline-none focus:border-blue-500 dark:focus:border-[#58a6ff] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#58a6ff] text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={!username.trim()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-emerald-600 dark:border-[#238636] bg-emerald-600 dark:bg-[#238636] px-6 py-3 text-sm font-semibold text-white dark:text-[#c9d1d9] transition-colors hover:bg-emerald-700 dark:hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-xs">[VIEW]</span>
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-[#f85149] text-center font-mono">
          [ERROR] {error}
        </p>
      )}
      {!error && (
        <p className="mt-2 text-xs text-gray-600 dark:text-[#8b949e] text-center font-mono">
          [INFO] Enter your GitHub username to see your contribution impact
        </p>
      )}
    </form>
  )
}

const HomePage: React.FC = () => {
  const problems = [
    {
      title: 'Too much time searching',
      description: 'Spending hours scrolling through GitHub looking for the right issue',
      solution: 'We filter and curate issues so you find matches in seconds, not hours'
    },
    {
      title: 'Can\'t find beginner-friendly issues',
      description: 'Hard to identify which issues are suitable for first-time contributors',
      solution: 'Smart difficulty detection and "good first issue" filtering makes it easy'
    },
    {
      title: 'Issues don\'t match your skills',
      description: 'Finding issues in languages or frameworks you don\'t know',
      solution: 'Filter by programming language, framework, and tech stack automatically'
    },
    {
      title: 'Stale or inactive issues',
      description: 'Wasting time on issues that haven\'t been updated in months',
      solution: 'Freshness indicators show only active issues updated recently'
    },
    {
      title: 'No clear difficulty levels',
      description: 'Uncertain if an issue is too easy, too hard, or just right for you',
      solution: 'Automatic difficulty classification: Beginner, Intermediate, or Advanced'
    },
    {
      title: 'Hard to discover new projects',
      description: 'Struggling to find interesting projects worth contributing to',
      solution: 'Browse curated repositories organized by category and popularity'
    }
  ]

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Smart Filtering',
      description: 'Filter by language, difficulty, category, and freshness'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Fresh Issues Only',
      description: 'See only active issues updated in the last 60 days'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Beginner Friendly',
      description: 'Special focus on issues perfect for first-time contributors'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      title: 'Organized by Category',
      description: 'Browse bugs, features, documentation, and more by category'
    }
  ]

  return (
    <>
      <Hero />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:py-16 bg-white dark:bg-[#0d1117] font-mono">
        {/* Contribution Impact Tracker CTA */}
        <section className="mb-16">
          <div className="relative border-2 border-emerald-500 dark:border-[#238636] bg-gray-50 dark:bg-[#161b22] shadow-lg shadow-emerald-500/20 dark:shadow-[#238636]/20">
            {/* Animated border glow */}
            <div className="absolute -inset-0.5 border-2 border-emerald-400 dark:border-[#2ea043] opacity-50 animate-pulse pointer-events-none"></div>
            
            {/* Terminal Header */}
            <div className="relative border-b-2 border-emerald-500 dark:border-[#238636] bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-[#0d4432] dark:to-[#0d4432] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-[#c9d1d9] ml-2">contribution-tracker</span>
                <span className="ml-auto flex items-center gap-1.5 px-2 py-0.5 bg-emerald-600 dark:bg-[#238636] text-white text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  NEW
                </span>
              </div>
            </div>
            
            <div className="relative p-8 sm:p-12">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-emerald-600 dark:text-[#7ee787] text-lg animate-pulse">▶</span>
                  <span className="text-blue-600 dark:text-[#58a6ff] text-base font-bold">track-contribution-impact</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[#c9d1d9] mb-4">
                  <span className="text-emerald-600 dark:text-[#7ee787]">Track</span> Your Contribution{' '}
                  <span className="text-blue-600 dark:text-[#58a6ff]">Impact</span>
                </h2>
                <p className="text-base text-gray-600 dark:text-[#8b949e] mb-8 max-w-2xl leading-relaxed">
                  Get your personalized contribution profile with impact score, achievements, and shareable cards. Showcase your open source journey!
                </p>
              </div>
              <div className="bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-[#30363d] p-6 mb-6">
                <ProfileSearchForm />
              </div>
              <div className="text-center">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 border-2 border-blue-500 dark:border-[#58a6ff] bg-white dark:bg-[#0d1117] px-6 py-3 text-sm font-semibold text-blue-600 dark:text-[#58a6ff] transition-all hover:bg-blue-50 dark:hover:bg-[#1c2128] hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <span className="text-emerald-600 dark:text-[#7ee787]">▶</span>
                  Developer Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Dashboard CTA */}
        <section className="mb-16">
          <div className="relative border-2 border-blue-500 dark:border-[#58a6ff] bg-gray-50 dark:bg-[#161b22] shadow-lg shadow-blue-500/20 dark:shadow-[#58a6ff]/20">
            {/* Animated border glow */}
            <div className="absolute -inset-0.5 border-2 border-blue-400 dark:border-[#79c0ff] opacity-50 animate-pulse pointer-events-none"></div>
            
            {/* Terminal Header */}
            <div className="relative border-b-2 border-blue-500 dark:border-[#58a6ff] bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#1c2b41] dark:to-[#1c2b41] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-[#c9d1d9] ml-2">developer-dashboard</span>
                <span className="ml-auto flex items-center gap-1.5 px-2 py-0.5 bg-blue-600 dark:bg-[#1f6feb] text-white text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  LIVE
                </span>
              </div>
            </div>
            
            <div className="relative p-8 sm:p-12 text-center">
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-emerald-600 dark:text-[#7ee787] text-lg animate-pulse">▶</span>
                  <span className="text-blue-600 dark:text-[#58a6ff] text-base font-bold">open-dashboard</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[#c9d1d9] mb-4">
                  <span className="text-blue-600 dark:text-[#58a6ff]">Developer</span> Dashboard
                </h2>
                <p className="text-base text-gray-600 dark:text-[#8b949e] mb-8 max-w-2xl mx-auto leading-relaxed">
                  Experience our terminal-style interface with live contributions feed and AI-powered issue matching engine
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117]">
                    <span className="text-emerald-600 dark:text-[#7ee787]">✓</span>
                    <span className="text-gray-700 dark:text-[#c9d1d9]">Live Feed</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117]">
                    <span className="text-purple-600 dark:text-[#d2a8ff]">✓</span>
                    <span className="text-gray-700 dark:text-[#c9d1d9]">AI Matching</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117]">
                    <span className="text-orange-600 dark:text-[#f0883e]">✓</span>
                    <span className="text-gray-700 dark:text-[#c9d1d9]">Terminal UI</span>
                  </div>
                </div>
              </div>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 border-2 border-emerald-600 dark:border-[#238636] bg-emerald-600 dark:bg-[#238636] px-8 py-3 text-sm font-semibold text-white dark:text-[#c9d1d9] transition-all hover:bg-emerald-700 dark:hover:bg-[#2ea043] hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30"
              >
                <span className="text-xs font-bold">[OPEN]</span>
                Developer Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Problems We Solve Section */}
        <section className="mb-16">
          <div className="border border-gray-300 dark:border-[#30363d] bg-gray-50 dark:bg-[#161b22] mb-6 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-600 dark:text-[#7ee787] text-sm">▶</span>
              <span className="text-blue-600 dark:text-[#58a6ff] text-sm font-semibold">problems-we-solve</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[#c9d1d9] mb-4">
              The Problems We Solve
            </h2>
            <p className="text-base text-gray-600 dark:text-[#8b949e] max-w-2xl">
              Open source contributors face real challenges. Here's how IssueFinder helps you overcome them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] p-6 hover:border-blue-500 dark:hover:border-[#58a6ff] transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0">
                    <span className="text-red-600 dark:text-[#f85149] text-sm">[!]</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-[#c9d1d9] mb-1">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-[#8b949e] mb-3 leading-relaxed">
                      {problem.description}
                    </p>
                    <div className="flex items-start gap-2 pt-3 border-t border-gray-300 dark:border-[#30363d]">
                      <span className="text-emerald-600 dark:text-[#7ee787] text-sm">✓</span>
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 leading-relaxed">
                        {problem.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works / Features */}
        <section className="mb-16">
          <div className="border border-gray-300 dark:border-[#30363d] bg-gray-50 dark:bg-[#161b22] mb-6 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-600 dark:text-[#7ee787] text-sm">▶</span>
              <span className="text-blue-600 dark:text-[#58a6ff] text-sm font-semibold">how-it-works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[#c9d1d9] mb-4">
              How IssueFinder Helps
            </h2>
            <p className="text-base text-gray-600 dark:text-[#8b949e] max-w-2xl">
              Powerful features designed to make your contribution journey smoother
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] p-6 text-center hover:border-blue-500 dark:hover:border-[#58a6ff] transition-colors"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 border border-gray-300 dark:border-[#30363d] bg-gray-50 dark:bg-[#161b22] text-blue-600 dark:text-[#58a6ff] mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-[#c9d1d9] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#8b949e] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="border border-gray-300 dark:border-[#30363d] bg-gray-50 dark:bg-[#161b22] p-8 sm:p-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-emerald-600 dark:text-[#7ee787] text-sm">▶</span>
              <span className="text-blue-600 dark:text-[#58a6ff] text-sm font-semibold">get-started</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-[#c9d1d9] mb-4">
              Ready to start contributing?
            </h2>
            <p className="text-base text-gray-600 dark:text-[#8b949e] mb-8 max-w-2xl mx-auto">
              Stop wasting time searching. Find issues that match your skills in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/categories"
                className="inline-flex items-center justify-center border border-emerald-600 dark:border-[#238636] bg-emerald-600 dark:bg-[#238636] px-8 py-3 text-sm font-semibold text-white dark:text-[#c9d1d9] transition-colors hover:bg-emerald-700 dark:hover:bg-[#2ea043]"
              >
                <span className="text-xs mr-2">[BROWSE]</span>
                Browse by Category
              </Link>
              <Link
                to="/issues"
                className="inline-flex items-center justify-center border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-8 py-3 text-sm font-semibold text-gray-900 dark:text-[#c9d1d9] transition-colors hover:bg-gray-50 dark:hover:bg-[#161b22] hover:border-blue-500 dark:hover:border-[#58a6ff]"
              >
                <span className="text-blue-600 dark:text-[#58a6ff] text-xs mr-2">▶</span>
                View All Issues
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default HomePage
