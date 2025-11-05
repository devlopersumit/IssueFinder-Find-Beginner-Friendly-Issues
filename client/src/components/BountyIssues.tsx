import React, { useEffect, useState, useRef } from 'react'
import DifficultyBadge from './DifficultyBadge'
import { detectDifficulty } from '../utils/difficulty'

type BountyIssuesProps = {
  className?: string
}

type GithubIssueItem = {
  id: number
  html_url: string
  title: string
  state: 'open' | 'closed'
  number: number
  repository_url: string
  labels: Array<{ name?: string; color?: string }>
  created_at: string
  body?: string
  assignee?: any | null
  assignees?: any[]
  pull_request?: any
}

type GithubSearchResponse = {
  total_count: number
  incomplete_results: boolean
  items: GithubIssueItem[]
}

const BountyIssues: React.FC<BountyIssuesProps> = ({ className = '' }) => {
  const [items, setItems] = useState<GithubIssueItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null)
  const [newItemsCount, setNewItemsCount] = useState<number>(0)
  const abortRef = useRef<AbortController | null>(null)
  const intervalRef = useRef<number | null>(null)
  const seenIdsRef = useRef<Set<number>>(new Set())
  const itemsRef = useRef<GithubIssueItem[]>([])

  // Simplified queries - more reliable, individual searches
  // Start with most common labels first
  const bountyQueries = [
    'state:open no:assignee label:bounty',
    'state:open no:assignee label:bountysource',
    'state:open no:assignee bounty in:title',
    'state:open no:assignee label:funded',
    'state:open no:assignee label:sponsor',
    'state:open no:assignee reward in:title',
  ]

  const fetchBountyIssues = async (isSilentRefresh: boolean = false) => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
    const controller = new AbortController()
    abortRef.current = controller

    if (!isSilentRefresh) {
      setIsLoading(true)
      // Clear items to show loading state
      setItems([])
      itemsRef.current = []
    } else {
      setIsRefreshing(true)
    }
    setError(null)
    const allIssues: GithubIssueItem[] = []
    const currentSeenIds = new Set<number>(seenIdsRef.current)
    let successCount = 0

    try {
      // Fetch queries sequentially with delays to avoid rate limiting
      for (let i = 0; i < bountyQueries.length; i++) {
        const query = bountyQueries[i]
        try {
          const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=30&sort=created&order=desc`
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              Accept: 'application/vnd.github+json'
            },
            signal: controller.signal
          })

          if (response.ok) {
            const json: GithubSearchResponse = await response.json()
            if (json.items) {
              json.items.forEach((issue) => {
                if (!currentSeenIds.has(issue.id)) {
                  currentSeenIds.add(issue.id)
                  allIssues.push(issue)
                }
              })
              successCount++
              console.log(`Query ${i + 1} succeeded: Found ${json.items.length} issues (total so far: ${allIssues.length})`)
            }
          } else {
            let errorText = ''
            try {
              errorText = await response.text()
            } catch {
              errorText = 'Unable to read error response'
            }
            console.warn(`Query ${i + 1} failed:`, response.status, response.statusText, errorText.substring(0, 100))
            
            if (response.status === 403) {
              // Rate limit - wait longer before continuing
              console.warn('Rate limit encountered, waiting 2 seconds...')
              await new Promise(resolve => setTimeout(resolve, 2000))
            }
          }
        } catch (err: unknown) {
          if ((err as any)?.name === 'AbortError') {
            console.log('Request aborted')
            return
          }
          // Continue with other queries even if one fails
          console.warn(`Query ${i + 1} error:`, query, err)
        }

        // Delay between queries to avoid rate limiting (except for last query)
        if (i < bountyQueries.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 800))
        }
      }
      
      console.log(`Fetch completed: ${successCount} successful queries, ${allIssues.length} total issues found`)

      // Filter to ensure only open, unassigned issues (not fixed yet)
      const openUnassignedIssues = allIssues.filter(issue => {
        // Only include open issues (not closed/fixed)
        if (issue.state !== 'open') {
          return false
        }
        
        // Exclude issues that have assignees (already assigned to someone)
        if (issue.assignee !== null && issue.assignee !== undefined) {
          return false
        }
        if (issue.assignees && issue.assignees.length > 0) {
          return false
        }
        
        // Exclude pull requests (they're not issues)
        if (issue.pull_request) {
          return false
        }
        if (issue.html_url && issue.html_url.includes('/pull/')) {
          return false
        }
        
        return true
      })
      console.log(`Filtered ${allIssues.length} issues to ${openUnassignedIssues.length} open/unassigned issues`)

      // Filter to only include actual bounty issues
      let verifiedBountyIssues = openUnassignedIssues.filter(issue => isBountyIssue(issue))
      console.log(`Filtered ${openUnassignedIssues.length} open issues to ${verifiedBountyIssues.length} verified bounty issues`)

      // If filtering removed all issues but we have results, use all results (they came from bounty queries anyway)
      if (verifiedBountyIssues.length === 0 && openUnassignedIssues.length > 0) {
        console.log(`⚠️ Filtering removed all issues, but queries matched bounty keywords. Showing all ${openUnassignedIssues.length} open bounty results.`)
        verifiedBountyIssues = openUnassignedIssues
      }

      // Only show error if ALL queries failed
      if (successCount === 0 && verifiedBountyIssues.length === 0 && !isSilentRefresh) {
        const errorMsg = 'Unable to fetch bounty issues. This might be due to rate limiting or network issues. Please try again in a moment.'
        console.error('All queries failed:', errorMsg)
        setError(new Error(errorMsg))
      } else {
        // Clear any previous errors if we got results (even if some queries failed)
        setError(null)
        if (verifiedBountyIssues.length > 0) {
          console.log(`✅ Successfully loaded ${verifiedBountyIssues.length} bounty issues from ${successCount} queries`)
        } else if (successCount > 0) {
          console.log(`⚠️ Queries succeeded but no bounty issues found`)
        }
      }

      // Sort by creation date (newest first)
      verifiedBountyIssues.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      
      // Update seen IDs with verified issues
      verifiedBountyIssues.forEach(issue => {
        seenIdsRef.current.add(issue.id)
      })

      // Detect new items
      const existingIds = new Set(itemsRef.current.map(item => item.id))
      const newItems = verifiedBountyIssues.filter(issue => !existingIds.has(issue.id))
      
      if (newItems.length > 0 && isSilentRefresh) {
        setNewItemsCount(newItems.length)
        // Reset new items count after 5 seconds
        setTimeout(() => setNewItemsCount(0), 5000)
      }

      // Merge new items with existing ones (only verified bounty issues)
      // First, verify existing items are still valid bounty issues
      const verifiedExistingItems = itemsRef.current.filter(issue => isBountyIssue(issue))
      
      // Merge and sort
      const mergedItems = [...newItems, ...verifiedExistingItems]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 30)
      
      itemsRef.current = mergedItems
      
      // Set items first
      setItems(mergedItems)
      setLastRefreshTime(new Date())
      
      // Only stop loading after all items are processed and set
      // Use setTimeout to ensure React state updates and DOM rendering complete
      setTimeout(() => {
        setIsLoading(false)
        setIsRefreshing(false)
        console.log(`✅ All bounty issues processed and displayed: ${mergedItems.length} issues`)
      }, 300)
    } catch (err: unknown) {
      if ((err as any)?.name === 'AbortError') return
      // Only set error if we have no items at all
      if (itemsRef.current.length === 0) {
        setError(err as Error)
      }
      // Stop loading even on error
      setTimeout(() => {
        setIsLoading(false)
        setIsRefreshing(false)
      }, 100)
    }
  }

  // Initial fetch and setup polling - always fetch on mount
  useEffect(() => {
    // Reset state to ensure fresh data on mount
    console.log('🔄 Component mounted: Resetting state and fetching fresh bounty issues...')
    setItems([])
    itemsRef.current = []
    seenIdsRef.current = new Set()
    setError(null)
    setIsLoading(true)

    // Always fetch fresh data on mount
    console.log('📡 Fetching bounty issues automatically...')
    fetchBountyIssues(false)

    // Poll every 2 minutes (120000ms) for new issues
    intervalRef.current = setInterval(() => {
      fetchBountyIssues(true)
    }, 120000)

    return () => {
      if (abortRef.current) {
        abortRef.current.abort()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only run on mount

  const handleManualRefresh = () => {
    fetchBountyIssues(false)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    
    if (diffSeconds < 60) return 'just now'
    if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`
    const diffHours = Math.floor(diffMinutes / 60)
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'opened today'
    if (diffDays === 1) return 'opened yesterday'
    if (diffDays < 7) return `opened ${diffDays} days ago`
    if (diffDays < 30) return `opened ${Math.floor(diffDays / 7)} weeks ago`
    return `opened ${Math.floor(diffDays / 30)} months ago`
  }

  const hasBountyLabel = (labels: Array<{ name?: string; color?: string }>): boolean => {
    if (!labels || labels.length === 0) return false
    const bountyKeywords = ['bounty', 'bountysource', 'funded', 'cash-prize', 'sponsor', 'paid', 'bounty-ready', 'bounty-available', 'reward', 'prize', 'issuehunt']
    return labels.some(label => {
      const labelLower = label.name?.toLowerCase() || ''
      return bountyKeywords.some(keyword => labelLower.includes(keyword))
    })
  }

  // Verify if an issue is actually a bounty issue
  const isBountyIssue = (issue: GithubIssueItem): boolean => {
    // Check labels
    if (hasBountyLabel(issue.labels || [])) {
      return true
    }

    // Check title for bounty keywords
    const titleLower = (issue.title || '').toLowerCase()
    const titleKeywords = [
      'bounty', 'bounties', 'bountysource', 'issuehunt',
      'cash prize', 'cash prize', 'cash reward', 'monetary reward',
      'sponsor', 'sponsorship', 'sponsored',
      'paid', 'payment', 'reward', 'prize', 'prize money',
      'funded', 'funding', 'compensation', 'compensated'
    ]
    
    if (titleKeywords.some(keyword => titleLower.includes(keyword))) {
      return true
    }

    // Check body for bounty keywords if available
    if (issue.body) {
      const bodyLower = issue.body.toLowerCase()
      if (titleKeywords.some(keyword => bodyLower.includes(keyword))) {
        return true
      }
    }

    return false
  }

  return (
    <section className={`relative bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 dark:from-amber-950/10 dark:via-gray-900 dark:to-orange-950/10 border-l-4 border-amber-500 dark:border-amber-600 border-t border-r border-b border-gray-200 dark:border-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="absolute top-0 right-0 -mt-3 -mr-3">
        <div className="bg-amber-500 dark:bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          Featured
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
                Bounty Issues
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unsolved bounty issues - fix them and earn rewards
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {newItemsCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-xs font-medium border border-green-200 dark:border-green-800 animate-pulse">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {newItemsCount} new
              </span>
            )}
            {isRefreshing && (
              <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </span>
            )}
            {lastRefreshTime && !isLoading && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Updated {formatTimeAgo(lastRefreshTime)}
              </span>
            )}
            {isLoading && items.length === 0 ? (
              <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : error && items.length === 0 ? (
              <span className="text-red-600 dark:text-red-400 text-xs">Unable to load</span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-lg font-medium border border-amber-200 dark:border-amber-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                {items.length} {items.length === 1 ? 'issue' : 'issues'}
              </span>
            )}
            {!isLoading && (
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Refresh now"
              >
                <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            )}
          </div>
        </div>
        
        {items.length === 0 && !isLoading && error && (
          <div className="text-center py-10 border border-gray-200 dark:border-gray-700 rounded-lg">
            <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">Unable to load bounty issues</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
              {error.message || 'Please check your connection and try again'}
            </p>
            <button
              onClick={handleManualRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        )}

        {/* Show loading spinner first - priority check */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="flex flex-col items-center justify-center">
              <svg className="animate-spin h-12 w-12 text-amber-500 dark:text-amber-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Fetching bounty issues
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Searching for open bounty issues with cash prizes and rewards...
              </p>
            </div>
          </div>
        )}

        {/* Only show "No bounty issues found" when NOT loading and no items */}
        {!isLoading && items.length === 0 && !error && !isRefreshing && (
          <div className="text-center py-10 border border-gray-200 dark:border-gray-700 rounded-lg">
            <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">No bounty issues found</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Check back later for new opportunities
            </p>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className="space-y-3">
            {items.map((issue) => {
              const repo = issue.repository_url?.split('/').slice(-2).join('/')
              const difficulty = detectDifficulty(issue.labels || [])
              const isBounty = hasBountyLabel(issue.labels || [])
              
              return (
                <article 
                  key={issue.id} 
                  className="group relative p-4 border-l-2 border-l-amber-400 dark:border-l-amber-600 border-t border-r border-b border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 hover:bg-amber-50/30 dark:hover:bg-amber-950/10 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <a 
                          href={issue.html_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400 line-clamp-2 flex-1 transition-colors"
                        >
                          {issue.title}
                        </a>
                        <DifficultyBadge difficulty={difficulty} />
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                        <span className="font-mono">{repo}</span>
                        <span>•</span>
                        <span>#{issue.number}</span>
                        <span>•</span>
                        <span>{formatDate(issue.created_at)}</span>
                      </div>
                      {issue.labels && issue.labels.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {issue.labels.slice(0, 5).map((l: any, i: number) => {
                            const labelLower = l.name?.toLowerCase() || ''
                            const isBountyLabel = labelLower.includes('bounty') || labelLower.includes('funded') || labelLower.includes('cash') || labelLower.includes('sponsor') || labelLower.includes('paid')
                            
                            return (
                              <span 
                                key={`${issue.id}-label-${i}`} 
                                className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                                  isBountyLabel
                                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-sm'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {l.name}
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {isBounty && (
                        <span className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm border border-amber-600">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                          Bounty
                        </span>
                      )}
                      <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                        Open
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default BountyIssues

