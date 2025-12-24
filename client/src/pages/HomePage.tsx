import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'

const ProfileSearchForm: React.FC = () => {
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Import validation function
    const { validateGitHubUsername } = require('../utils/security')
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2C5.477 2 2 5.484 2 10.017c0 4.424 2.865 8.178 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.952 0-1.093.39-1.988 1.03-2.688-.104-.253-.447-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.026 2.748-1.026.546 1.377.203 2.394.1 2.647.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.696-4.566 4.945.359.309.679.92.679 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.019 10.019 0 0020 10.017C20 5.484 15.522 2 10 2z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username"
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={!username.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 dark:hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          View Profile
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400 text-center">
          {error}
        </p>
      )}
      {!error && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Enter your GitHub username to see your contribution impact
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
      <main className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        {/* Contribution Impact Tracker CTA */}
        <section className="mb-16">
          <div className="relative rounded-2xl overflow-hidden group">
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-2xl p-[2px]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 dark:from-emerald-500 dark:via-blue-400 dark:to-purple-400 opacity-75 dark:opacity-60 bg-[length:200%_100%] animate-gradient-border"></div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 dark:from-emerald-500 dark:via-blue-400 dark:to-purple-400 rounded-2xl opacity-20 dark:opacity-10 blur-xl animate-pulse-slow"></div>
            
            <div className="relative rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 p-8 sm:p-12 text-center z-10 backdrop-blur-sm">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">New Feature</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Track Your Contribution Impact
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Get your personalized contribution profile with impact score, achievements, and shareable cards. Showcase your open source journey!
              </p>
              <ProfileSearchForm />
              <div className="mt-6">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-blue-600 dark:border-blue-500 bg-white dark:bg-gray-900 px-8 py-3 text-base font-semibold text-blue-600 dark:text-blue-400 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Developer Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Dashboard CTA */}
        <section className="mb-16">
          <div className="relative rounded-2xl overflow-hidden group">
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-2xl p-[2px]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 dark:from-emerald-500 dark:via-blue-400 dark:to-purple-400 opacity-75 dark:opacity-60 bg-[length:200%_100%] animate-gradient-border"></div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 dark:from-emerald-500 dark:via-blue-400 dark:to-purple-400 rounded-2xl opacity-20 dark:opacity-10 blur-xl animate-pulse-slow"></div>
            
            <div className="relative rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-blue-900/20 p-8 sm:p-12 text-center z-10 backdrop-blur-sm">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">New Feature</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Developer Dashboard
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Experience our terminal-style interface with live contributions feed and AI-powered issue matching engine
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 dark:shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40 dark:hover:shadow-emerald-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Open Developer Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Problems We Solve Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              The Problems We Solve
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Open source contributors face real challenges. Here's how IssueFinder helps you overcome them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {problem.description}
                    </p>
                    <div className="flex items-start gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
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
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              How IssueFinder Helps
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to make your contribution journey smoother
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Ready to start contributing?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Stop wasting time searching. Find issues that match your skills in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/categories"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              Browse by Category
            </Link>
            <Link
              to="/issues"
              className="inline-flex items-center justify-center rounded-lg border-2 border-emerald-600 bg-white px-8 py-3 text-base font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-500 dark:bg-gray-900 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
            >
              View All Issues
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}

export default HomePage
