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
      {/* Hero CTA Section */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/30 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-amber-900/10 border border-amber-200/50 dark:border-amber-800/30 p-8 shadow-lg">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-900/30 px-4 py-2 text-sm font-semibold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            Earn While You Code
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
            Start Contributing to <span className="text-amber-600 dark:text-amber-400">Bounty Issues</span> Today
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover real bounty issues with cash prizes and rewards. Fix them, earn money, and build your reputation in the open-source community. Every contribution counts!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="#bounty-issues"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Browse Bounty Issues
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 pt-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Real Bounty Issues Only
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified & Legitimate
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Updated Regularly
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 id="bounty-issues" className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Available Bounty Issues
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Browse through verified bounty issues. Each one offers real rewards for contributors.
          </p>
          {submittedSearch && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              💡 Looking for "{submittedSearch}"? Try the <Link to="/search" className="underline font-semibold">search page</Link> for more results.
            </p>
          )}
        </div>
      </div>
      {/* Key ensures component remounts and fetches fresh data */}
      <BountyIssues key={`bounty-${refreshKey}`} />
    </main>
  )
}

export default BountyIssuesPage

