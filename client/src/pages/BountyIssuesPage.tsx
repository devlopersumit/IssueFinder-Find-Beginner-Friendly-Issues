import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BountyIssues from '../components/BountyIssues'
import { useSearch } from '../contexts/SearchContext'

const BountyIssuesPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const { submittedSearch } = useSearch()

  // Force remount when component mounts
  useEffect(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  // If user has searched, show a message suggesting they use the search page
  useEffect(() => {
    if (submittedSearch && submittedSearch.trim()) {
      // Search is handled globally - if they want to search, they should use the search page
      // But we can still show bounty issues filtered by search if needed
    }
  }, [submittedSearch])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Bounty Issues
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Discover unsolved bounty issues with cash prizes and rewards. Fix them and earn money!
          </p>
          {submittedSearch && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              💡 Looking for "{submittedSearch}"? Try the <Link to="/search" className="underline font-semibold">search page</Link> for more results.
            </p>
          )}
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
      {/* Key ensures component remounts and fetches fresh data */}
      <BountyIssues key={`bounty-${refreshKey}`} />
    </main>
  )
}

export default BountyIssuesPage

