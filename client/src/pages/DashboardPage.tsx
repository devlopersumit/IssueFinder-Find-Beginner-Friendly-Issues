import React from 'react'
import LiveContributionFeed from '../components/LiveContributionFeed'
import PersonalizedIssues from '../components/PersonalizedIssues'

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 dark:bg-[#0d1117] text-gray-100 dark:text-[#c9d1d9] font-mono">
      {/* Terminal Header */}
      <div className="border-b border-gray-700 dark:border-[#30363d] bg-gray-800 dark:bg-[#161b22]">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="ml-4 text-xs text-gray-400 dark:text-[#8b949e]">
              issuefinder.fun — Developer Dashboard
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6 border-b border-gray-700 dark:border-[#30363d] pb-4">
          <h1 className="text-2xl font-bold text-blue-400 dark:text-[#58a6ff] mb-2">
            <span className="text-emerald-400 dark:text-[#7ee787]">$</span> open-source-dashboard
          </h1>
          <p className="text-sm text-gray-400 dark:text-[#8b949e]">
            Real-time contributions feed & AI-powered issue matching engine
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="border border-gray-700 dark:border-[#30363d] bg-gray-800 dark:bg-[#161b22] p-3 rounded">
            <div className="text-xs text-gray-400 dark:text-[#8b949e] mb-1">STATUS</div>
            <div className="text-sm font-semibold text-emerald-400 dark:text-[#7ee787] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-[#7ee787] animate-pulse"></span>
              LIVE
            </div>
          </div>
          <div className="border border-gray-700 dark:border-[#30363d] bg-gray-800 dark:bg-[#161b22] p-3 rounded">
            <div className="text-xs text-gray-400 dark:text-[#8b949e] mb-1">API</div>
            <div className="text-sm font-semibold text-blue-400 dark:text-[#58a6ff]">GitHub Events</div>
          </div>
          <div className="border border-gray-700 dark:border-[#30363d] bg-gray-800 dark:bg-[#161b22] p-3 rounded">
            <div className="text-xs text-gray-400 dark:text-[#8b949e] mb-1">REFRESH</div>
            <div className="text-sm font-semibold text-orange-400 dark:text-[#f0883e]">30s interval</div>
          </div>
          <div className="border border-gray-700 dark:border-[#30363d] bg-gray-800 dark:bg-[#161b22] p-3 rounded">
            <div className="text-xs text-gray-400 dark:text-[#8b949e] mb-1">MODE</div>
            <div className="text-sm font-semibold text-purple-400 dark:text-[#d2a8ff]">AI Matching</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Live Contributions Feed */}
          <div className="xl:col-span-1">
            <LiveContributionFeed limit={12} />
          </div>

          {/* AI-Powered Issue Matching */}
          <div className="xl:col-span-1">
            <PersonalizedIssues limit={12} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 border-t border-gray-700 dark:border-[#30363d] pt-4">
          <div className="text-xs text-gray-400 dark:text-[#8b949e] space-y-1">
            <div>
              <span className="text-emerald-400 dark:text-[#7ee787]">✓</span> Live contributions feed powered by GitHub Events API
            </div>
            <div>
              <span className="text-emerald-400 dark:text-[#7ee787]">✓</span> AI matching engine analyzes your GitHub profile for personalized recommendations
            </div>
            <div>
              <span className="text-emerald-400 dark:text-[#7ee787]">✓</span> All data updates in real-time without page refresh
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage

