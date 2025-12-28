import React from 'react'
import { Link } from 'react-router-dom'

type Highlight = {
  label: string
  value: string
  description: string
}

const highlights: Highlight[] = [
  {
    label: 'Fresh Issues',
    value: '1.2k+',
    description: 'Active tickets ready for contribution',
  },
  {
    label: 'Languages',
    value: '25',
    description: 'Auto-detected tech stacks and tags',
  },
  {
    label: 'Curated Repos',
    value: '320',
    description: 'Hand reviewed projects worth your time',
  },
  {
    label: 'Filters',
    value: '40+',
    description: 'Dial in difficulty, type, and frameworks',
  },
]

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-b border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] font-mono">
      {/* Terminal-style header bar */}
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

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 border border-gray-300 dark:border-[#30363d] bg-gray-50 dark:bg-[#161b22] px-4 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-[#8b949e]">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-600 dark:bg-[#7ee787]" />
              <span className="text-emerald-600 dark:text-[#7ee787]">▶</span>
              <span>live open source intelligence</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 border-l-2 border-emerald-600 dark:border-[#7ee787] bg-gray-50 dark:bg-[#161b22] px-5 py-2.5 w-fit mx-auto lg:mx-0">
                <span className="text-emerald-600 dark:text-[#7ee787] text-sm">$</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-[#c9d1d9]">
                  Ready to make your first contribution? Start here and find issues that match your skills!
                </p>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-[#c9d1d9] sm:text-5xl lg:text-6xl">
                <span className="text-blue-600 dark:text-[#58a6ff]">find</span>{' '}
                <span className="text-purple-600 dark:text-[#d2a8ff]">github</span>{' '}
                <span className="text-emerald-600 dark:text-[#7ee787]">issues</span>
                <br />
                <span className="text-gray-700 dark:text-[#8b949e]">that match your skills</span>
              </h1>
              <p className="text-base text-gray-600 dark:text-[#8b949e] sm:text-lg lg:text-xl leading-relaxed">
                Stop wasting time searching. We show you open-source projects and issues that are perfect for you. Filter by your favorite programming language, difficulty level, and start contributing today.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to="/categories"
                className="inline-flex items-center justify-center border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-6 py-3 text-base font-semibold text-gray-900 dark:text-[#c9d1d9] transition-colors hover:bg-gray-50 dark:hover:bg-[#161b22] hover:border-blue-500 dark:hover:border-[#58a6ff]"
              >
                <span className="text-emerald-600 dark:text-[#7ee787] mr-2">▶</span>
                Explore categories
              </Link>
              <Link
                to="/beginner-guide"
                className="inline-flex items-center justify-center border border-emerald-600 dark:border-[#7ee787] bg-emerald-50 dark:bg-[#238636] px-6 py-3 text-base font-semibold text-emerald-700 dark:text-[#c9d1d9] transition-colors hover:bg-emerald-100 dark:hover:bg-[#2ea043]"
              >
                <span className="text-emerald-600 dark:text-[#7ee787] mr-2">$</span>
                Beginner Guide
              </Link>
              <Link
                to="/bounty"
                className="inline-flex items-center justify-center border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-6 py-3 text-base font-semibold text-gray-800 dark:text-[#c9d1d9] transition-colors hover:bg-gray-50 dark:hover:bg-[#161b22]"
              >
                <span className="text-orange-600 dark:text-[#f0883e] mr-2">▶</span>
                View bounty issues
              </Link>
            </div>

            <div className="flex items-center justify-center gap-3 text-sm text-gray-600 dark:text-[#8b949e] lg:justify-start">
              <span className="text-emerald-600 dark:text-[#7ee787]">✓</span>
              <span>Fresh issues updated every hour. All ready for new contributors.</span>
            </div>
          </div>

          <div className="relative">
            <div className="border border-gray-300 dark:border-[#30363d] bg-gray-50 dark:bg-[#161b22] p-6">
              <div className="mb-6 border-b border-gray-300 dark:border-[#30363d] pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-600 dark:text-[#7ee787] text-sm">▶</span>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-[#8b949e]">Why developers love IssueFinder</p>
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-[#c9d1d9]">Save time, find better projects</h2>
                <p className="mt-3 text-sm text-gray-600 dark:text-[#8b949e] leading-relaxed">
                  No more endless scrolling. We filter out the noise and show you only the issues that match what you're looking for.
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-4 sm:gap-6">
                {highlights.map((item) => (
                  <div key={item.label} className="border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] p-4 text-left">
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-[#8b949e]">{item.label}</dt>
                    <dd className="mt-2 text-2xl font-semibold text-blue-600 dark:text-[#58a6ff]">{item.value}</dd>
                    <p className="mt-1 text-xs text-gray-600 dark:text-[#8b949e]">{item.description}</p>
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