import React, { useState } from 'react'

type FiltersPanelProps = {
  className?: string
  selectedLabels: string[]
  onToggleLabel: (label: string) => void
  selectedLanguage: string | null
  onChangeLanguage: (language: string | null) => void
  showTags?: boolean
  selectedCategories?: string[]
  onToggleCategory?: (category: string) => void
  isMobile?: boolean
  // Advanced filters
  selectedDifficulty?: string | null
  onChangeDifficulty?: (difficulty: string | null) => void
  selectedType?: string | null
  onChangeType?: (type: string | null) => void
  selectedFramework?: string | null
  onChangeFramework?: (framework: string | null) => void
  selectedLastActivity?: string | null
  onChangeLastActivity?: (activity: string | null) => void
}

// Simplified categories - most commonly used
const ISSUE_CATEGORIES = [
  { key: 'all', label: 'All Issues' },
  { key: 'good first issue', label: 'Good First Issue' },
  { key: 'help wanted', label: 'Help Wanted' },
  { key: 'bug', label: 'Bug' },
  { key: 'feature', label: 'Feature' },
  { key: 'documentation', label: 'Documentation' },
]

// Most popular languages only
const POPULAR_LANGUAGES = [
  { key: null, label: 'Any Language' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'typescript', label: 'TypeScript' },
  { key: 'python', label: 'Python' },
  { key: 'java', label: 'Java' },
  { key: 'go', label: 'Go' },
  { key: 'rust', label: 'Rust' },
  { key: 'cpp', label: 'C++' },
  { key: 'csharp', label: 'C#' },
  { key: 'php', label: 'PHP' },
  { key: 'ruby', label: 'Ruby' },
]

const DIFFICULTY_LEVELS = [
  { key: null, label: 'Any Difficulty', color: 'gray' },
  { key: 'beginner', label: 'Beginner', color: 'green' },
  { key: 'intermediate', label: 'Intermediate', color: 'yellow' },
  { key: 'advanced', label: 'Advanced', color: 'red' },
]

const ISSUE_TYPES = [
  { key: null, label: 'Any Type' },
  { key: 'bug', label: 'Bug' },
  { key: 'feature', label: 'Feature' },
  { key: 'documentation', label: 'Documentation' },
  { key: 'refactor', label: 'Refactor' },
  { key: 'testing', label: 'Testing' },
]

// Most popular frameworks only
const POPULAR_FRAMEWORKS = [
  { key: null, label: 'Any Framework' },
  { key: 'react', label: 'React' },
  { key: 'vue', label: 'Vue.js' },
  { key: 'angular', label: 'Angular' },
  { key: 'nextjs', label: 'Next.js' },
  { key: 'express', label: 'Express' },
  { key: 'django', label: 'Django' },
  { key: 'flask', label: 'Flask' },
  { key: 'rails', label: 'Rails' },
]

const LAST_ACTIVITY_OPTIONS = [
  { key: null, label: 'Any Time' },
  { key: 'last-week', label: 'Updated Last Week' },
  { key: 'last-month', label: 'Updated Last Month' },
  { key: 'last-3months', label: 'Updated Last 3 Months' },
  { key: 'active', label: 'Active Maintainers' },
]

const FiltersPanel: React.FC<FiltersPanelProps> = ({ 
  className = '', 
  selectedLabels, 
  onToggleLabel, 
  selectedLanguage, 
  onChangeLanguage, 
  showTags = true,
  selectedCategories = [],
  onToggleCategory,
  isMobile = false,
  selectedDifficulty = null,
  onChangeDifficulty,
  selectedType = null,
  onChangeType,
  selectedFramework = null,
  onChangeFramework,
  selectedLastActivity = null,
  onChangeLastActivity,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    difficulty: true,
    type: false,
    category: false,
    language: false,
    framework: false,
    activity: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCategoryToggle = (category: string) => {
    if (!onToggleCategory) return
    
    if (category === 'all') {
      selectedCategories.forEach(c => onToggleCategory(c))
    } else {
      if (selectedCategories.includes('all')) {
        onToggleCategory('all')
      }
      onToggleCategory(category)
    }
  }

  const getDifficultyColor = (difficulty: string | null) => {
    if (!difficulty) return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
    if (difficulty === 'beginner') return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
    if (difficulty === 'intermediate') return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
    if (difficulty === 'advanced') return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
  }

  return (
    <aside className={`bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg transition-colors duration-200 ${className}`}>
      <div className="p-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </h2>
        
        <div className="space-y-3">
          {/* Difficulty Filter - Always Visible, Most Important */}
          {showTags && onChangeDifficulty && (
            <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
              <button
                type="button"
                onClick={() => toggleSection('difficulty')}
                className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Difficulty Level
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform ${expandedSections.difficulty ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.difficulty && (
                <div className="grid grid-cols-2 gap-2">
                  {DIFFICULTY_LEVELS.map((opt) => (
                    <button
                      key={String(opt.key)}
                      type="button"
                      onClick={() => onChangeDifficulty(opt.key ?? null)}
                      className={`px-3 py-2 rounded-md text-sm font-medium border-2 transition-all ${
                        (selectedDifficulty ?? '') === (opt.key ?? '')
                          ? getDifficultyColor(opt.key) + ' ring-2 ring-offset-1 ring-slate-400 dark:ring-slate-500'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-slate-400 dark:hover:border-slate-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Type Filter */}
          {showTags && onChangeType && (
            <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
              <button
                type="button"
                onClick={() => toggleSection('type')}
                className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Issue Type
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform ${expandedSections.type ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.type && (
                <div className="flex flex-wrap gap-2">
                  {ISSUE_TYPES.map((opt) => (
                    <button
                      key={String(opt.key)}
                      type="button"
                      onClick={() => onChangeType(opt.key ?? null)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                        (selectedType ?? '') === (opt.key ?? '')
                          ? 'bg-slate-700 dark:bg-slate-600 text-white border-slate-700 dark:border-slate-600'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Categories */}
          {showTags && onToggleCategory && !isMobile && (
            <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
              <button
                type="button"
                onClick={() => toggleSection('category')}
                className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Categories
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.category && (
                <div className="flex flex-wrap gap-2">
                  {ISSUE_CATEGORIES.map((cat) => {
                    const active = selectedCategories.includes(cat.key) || (cat.key === 'all' && selectedCategories.length === 0)
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => handleCategoryToggle(cat.key)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                          active
                            ? 'bg-slate-700 dark:bg-slate-600 text-white border-slate-700 dark:border-slate-600'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {cat.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Language Filter */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
            <button
              type="button"
              onClick={() => toggleSection('language')}
              className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Language
              </span>
              <svg 
                className={`w-4 h-4 transition-transform ${expandedSections.language ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.language && (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {POPULAR_LANGUAGES.map((opt) => (
                  <button
                    key={String(opt.key)}
                    type="button"
                    onClick={() => onChangeLanguage(opt.key ?? null)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all text-left ${
                      (selectedLanguage ?? '') === (opt.key ?? '')
                        ? 'bg-slate-700 dark:bg-slate-600 text-white border-slate-700 dark:border-slate-600'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Framework Filter */}
          {showTags && onChangeFramework && (
            <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
              <button
                type="button"
                onClick={() => toggleSection('framework')}
                className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Framework
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform ${expandedSections.framework ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.framework && (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {POPULAR_FRAMEWORKS.map((opt) => (
                    <button
                      key={String(opt.key)}
                      type="button"
                      onClick={() => onChangeFramework(opt.key ?? null)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all text-left ${
                        (selectedFramework ?? '') === (opt.key ?? '')
                          ? 'bg-slate-700 dark:bg-slate-600 text-white border-slate-700 dark:border-slate-600'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Last Activity Filter */}
          {showTags && onChangeLastActivity && (
            <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
              <button
                type="button"
                onClick={() => toggleSection('activity')}
                className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Last Activity
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform ${expandedSections.activity ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.activity && (
                <div className="space-y-1">
                  {LAST_ACTIVITY_OPTIONS.map((opt) => (
                    <button
                      key={String(opt.key)}
                      type="button"
                      onClick={() => onChangeLastActivity(opt.key ?? null)}
                      className={`w-full px-3 py-1.5 rounded-md text-xs font-medium border transition-all text-left ${
                        (selectedLastActivity ?? '') === (opt.key ?? '')
                          ? 'bg-slate-700 dark:bg-slate-600 text-white border-slate-700 dark:border-slate-600'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Clear Filters Button */}
          {(selectedDifficulty || selectedType || selectedFramework || selectedLanguage || selectedLastActivity ||
            (selectedCategories && selectedCategories.length > 0 && !selectedCategories.includes('all'))) && (
            <button
              type="button"
              onClick={() => {
                if (onChangeDifficulty) onChangeDifficulty(null)
                if (onChangeType) onChangeType(null)
                if (onChangeFramework) onChangeFramework(null)
                if (onChangeLastActivity) onChangeLastActivity(null)
                onChangeLanguage(null)
                if (onToggleCategory) {
                  selectedCategories.forEach(c => onToggleCategory(c))
                }
              }}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}

export default FiltersPanel
