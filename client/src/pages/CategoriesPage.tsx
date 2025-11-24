import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { buildGitHubQuery } from '../utils/queryBuilder'
import DifficultyBadge from '../components/DifficultyBadge'

type Category = {
  key: string
  label: string
  description: string
  color: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

const CATEGORIES: Category[] = [
  {
    key: 'good first issue',
    label: 'Good First Issue',
    description: 'Perfect for beginners starting their open source journey',
    color: 'emerald',
    difficulty: 'beginner'
  },
  {
    key: 'help wanted',
    label: 'Help Wanted',
    description: 'Projects actively seeking contributors',
    color: 'blue',
    difficulty: 'intermediate'
  },
  {
    key: 'bug',
    label: 'Bug Fixes',
    description: 'Issues that need debugging and fixing',
    color: 'red',
    difficulty: 'intermediate'
  },
  {
    key: 'feature',
    label: 'Features',
    description: 'New functionality and enhancements',
    color: 'purple',
    difficulty: 'intermediate'
  },
  {
    key: 'documentation',
    label: 'Documentation',
    description: 'Improve docs and write guides',
    color: 'amber',
    difficulty: 'beginner'
  },
  {
    key: 'refactor',
    label: 'Refactoring',
    description: 'Code improvements and optimizations',
    color: 'indigo',
    difficulty: 'intermediate'
  },
  {
    key: 'testing',
    label: 'Testing',
    description: 'Add tests and improve coverage',
    color: 'teal',
    difficulty: 'intermediate'
  },
  {
    key: 'enhancement',
    label: 'Enhancement',
    description: 'Improve existing features',
    color: 'violet',
    difficulty: 'intermediate'
  },
  {
    key: 'performance',
    label: 'Performance',
    description: 'Optimize speed and efficiency',
    color: 'cyan',
    difficulty: 'advanced'
  },
  {
    key: 'security',
    label: 'Security',
    description: 'Fix vulnerabilities and improve safety',
    color: 'rose',
    difficulty: 'advanced'
  }
]

const DIFFICULTY_LEVELS = [
  {
    key: 'beginner',
    label: 'Beginner Friendly',
    description: 'Perfect for first-time contributors',
    color: 'emerald'
  },
  {
    key: 'intermediate',
    label: 'Intermediate',
    description: 'Some experience recommended',
    color: 'blue'
  },
  {
    key: 'advanced',
    label: 'Advanced',
    description: 'For experienced developers',
    color: 'purple'
  }
]

const POPULAR_LANGUAGES = [
  { key: 'javascript', label: 'JavaScript' },
  { key: 'typescript', label: 'TypeScript' },
  { key: 'python', label: 'Python' },
  { key: 'java', label: 'Java' },
  { key: 'go', label: 'Go' },
  { key: 'rust', label: 'Rust' },
  { key: 'php', label: 'PHP' },
  { key: 'ruby', label: 'Ruby' },
  { key: 'cpp', label: 'C++' },
  { key: 'csharp', label: 'C#' },
]

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate()
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [loadingCounts, setLoadingCounts] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      const counts: Record<string, number> = {}
      const loading: Record<string, boolean> = {}

      for (const category of CATEGORIES) {
        loading[category.key] = true
        try {
          const query = buildGitHubQuery({
            selectedCategories: [category.key]
          })
          const response = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=1`)
          if (response.ok) {
            const data = await response.json()
            counts[category.key] = data.total_count || 0
          } else {
            counts[category.key] = 0
          }
        } catch (error) {
          counts[category.key] = 0
        } finally {
          loading[category.key] = false
        }
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      setCategoryCounts(counts)
      setLoadingCounts({})
    }

    fetchCategoryCounts()
  }, [])

  const handleLanguageClick = (languageKey: string) => {
    navigate(`/repositories?language=${encodeURIComponent(languageKey)}`)
  }

  const handleDifficultyClick = (difficultyKey: string) => {
    setSelectedDifficulty(difficultyKey === selectedDifficulty ? null : difficultyKey)
  }

  const handleCategoryClick = (categoryKey: string) => {
    const params = new URLSearchParams()
    params.set('category', categoryKey)
    if (selectedDifficulty) {
      params.set('difficulty', selectedDifficulty)
    }
    navigate(`/issues?${params.toString()}`)
  }

  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const filteredCategories = useMemo(() => {
    let filtered = CATEGORIES

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(cat => 
        cat.label.toLowerCase().includes(query) ||
        cat.description.toLowerCase().includes(query) ||
        cat.key.toLowerCase().includes(query)
      )
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(cat => cat.difficulty === selectedDifficulty)
    }

    return filtered
  }, [searchQuery, selectedDifficulty])

  const getCategoryIcon = (categoryKey: string) => {
    const icons: Record<string, JSX.Element> = {
      'good first issue': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'help wanted': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      'bug': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      'feature': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      'documentation': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      'refactor': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      'testing': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'enhancement': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      'performance': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      'security': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
    return icons[categoryKey] || (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    )
  }

  const colorClasses = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    blue: 'text-blue-600 dark:text-blue-400',
    red: 'text-red-600 dark:text-red-400',
    purple: 'text-purple-600 dark:text-purple-400',
    amber: 'text-amber-600 dark:text-amber-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    teal: 'text-teal-600 dark:text-teal-400',
    violet: 'text-violet-600 dark:text-violet-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
    rose: 'text-rose-600 dark:text-rose-400',
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Discover Issues by Category
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse open source issues organized by type and difficulty level
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {DIFFICULTY_LEVELS.map((difficulty) => (
                <button
                  key={difficulty.key}
                  onClick={() => handleDifficultyClick(difficulty.key)}
                  className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    selectedDifficulty === difficulty.key
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                      : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Found <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredCategories.length}</span> categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {filteredCategories.map((category) => {
            const count = categoryCounts[category.key] || 0
            const isLoading = loadingCounts[category.key] || false
            const iconColor = colorClasses[category.color as keyof typeof colorClasses] || colorClasses.emerald

            return (
              <div
                key={category.key}
                onClick={() => handleCategoryClick(category.key)}
                className="group relative rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 cursor-pointer transition-all hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`${iconColor} flex-shrink-0`}>
                    {getCategoryIcon(category.key)}
                  </div>
                  {isLoading ? (
                    <div className="h-5 w-12 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                  ) : (
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {count > 0 ? formatCount(count) : '—'}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
                  {category.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {category.description}
                </p>
                {category.difficulty && (
                  <div className="mt-3">
                    <DifficultyBadge difficulty={category.difficulty} />
                  </div>
                )}
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View issues</span>
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            )
          })}
        </div>

        {/* Popular Languages */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Browse by Language</h2>
            <Link
              to="/repositories"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3">
            {POPULAR_LANGUAGES.map((lang) => (
              <button
                key={lang.key}
                onClick={() => handleLanguageClick(lang.key)}
                className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 transition hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-sm dark:hover:border-emerald-700 dark:hover:bg-emerald-900/20"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {lang.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage
