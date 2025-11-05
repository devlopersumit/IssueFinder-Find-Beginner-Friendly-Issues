import React from 'react'
import { NaturalLanguage, LANGUAGE_NAMES } from '../utils/languageDetection'

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
  selectedNaturalLanguages?: NaturalLanguage[]
  onToggleNaturalLanguage?: (language: NaturalLanguage) => void
}

const ISSUE_CATEGORIES = [
  { key: 'all', label: 'All Issues' },
  { key: 'good first issue', label: 'Good First Issue' },
  { key: 'help wanted', label: 'Help Wanted' },
  { key: 'bug', label: 'Bug' },
  { key: 'enhancement', label: 'Enhancement' },
  { key: 'feature', label: 'Feature' },
  { key: 'documentation', label: 'Documentation' },
  { key: 'refactor', label: 'Refactor' },
  { key: 'performance', label: 'Performance' },
  { key: 'testing', label: 'Testing' },
  { key: 'question', label: 'Question' },
]

const LANGUAGES = [
  { key: 'javascript', label: 'JavaScript' },
  { key: 'typescript', label: 'TypeScript' },
  { key: 'python', label: 'Python' },
  { key: 'java', label: 'Java' },
  { key: 'go', label: 'Go' },
  { key: 'rust', label: 'Rust' },
  { key: 'cpp', label: 'C++' },
  { key: 'c', label: 'C' },
  { key: 'csharp', label: 'C#' },
  { key: 'php', label: 'PHP' },
  { key: 'ruby', label: 'Ruby' },
  { key: 'swift', label: 'Swift' },
  { key: 'kotlin', label: 'Kotlin' },
  { key: 'dart', label: 'Dart' },
  { key: 'html', label: 'HTML' },
  { key: 'css', label: 'CSS' },
  { key: 'scala', label: 'Scala' },
  { key: 'lua', label: 'Lua' },
  { key: 'shell', label: 'Shell' },
  { key: 'r', label: 'R' },
  { key: null as unknown as string, label: 'Any Language' }
]

const NATURAL_LANGUAGES: { key: NaturalLanguage; label: string }[] = [
  { key: 'en', label: LANGUAGE_NAMES.en },
  { key: 'zh', label: LANGUAGE_NAMES.zh },
  { key: 'ja', label: LANGUAGE_NAMES.ja },
  { key: 'ko', label: LANGUAGE_NAMES.ko },
  { key: 'es', label: LANGUAGE_NAMES.es },
  { key: 'fr', label: LANGUAGE_NAMES.fr },
  { key: 'de', label: LANGUAGE_NAMES.de },
  { key: 'pt', label: LANGUAGE_NAMES.pt },
  { key: 'ru', label: LANGUAGE_NAMES.ru },
  { key: 'ar', label: LANGUAGE_NAMES.ar },
  { key: 'hi', label: LANGUAGE_NAMES.hi },
  { key: 'other', label: LANGUAGE_NAMES.other }
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
  selectedNaturalLanguages = [],
  onToggleNaturalLanguage
}) => {
  const [searchLang, setSearchLang] = React.useState('')
  const [searchNaturalLang, setSearchNaturalLang] = React.useState('')

  const filteredLanguages = React.useMemo(() => {
    if (!searchLang) return LANGUAGES
    return LANGUAGES.filter(lang => 
      lang.label.toLowerCase().includes(searchLang.toLowerCase())
    )
  }, [searchLang])

  const filteredNaturalLanguages = React.useMemo(() => {
    if (!searchNaturalLang) return NATURAL_LANGUAGES
    return NATURAL_LANGUAGES.filter(lang => 
      lang.label.toLowerCase().includes(searchNaturalLang.toLowerCase())
    )
  }, [searchNaturalLang])

  const handleCategoryToggle = (category: string) => {
    if (!onToggleCategory) return
    
    if (category === 'all') {
      // Clear all categories
      selectedCategories.forEach(c => onToggleCategory(c))
    } else {
      // Toggle this category and remove 'all' if it was selected
      if (selectedCategories.includes('all')) {
        onToggleCategory('all')
      }
      onToggleCategory(category)
    }
  }

  return (
    <aside className={`bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded transition-colors duration-200 ${className}`}>
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wide">Filters</h2>
        <div className="space-y-5">
          {showTags && onToggleCategory && !isMobile && (
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Issue Categories</p>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {ISSUE_CATEGORIES.map((cat) => {
                  const active = selectedCategories.includes(cat.key) || (cat.key === 'all' && selectedCategories.length === 0)
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => handleCategoryToggle(cat.key)}
                      className={`w-full flex items-center gap-2 rounded px-3 py-2 text-xs font-medium text-left transition-colors ${
                        active 
                          ? 'bg-slate-700 dark:bg-slate-600 text-white' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <span>{cat.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          {showTags && !onToggleCategory && (
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {['enhancement', 'good first issue', 'help wanted'].map((l) => {
                  const active = selectedLabels.includes(l)
                  return (
                    <button
                      key={l}
                      type="button"
                      onClick={() => onToggleLabel(l)}
                      className={`rounded px-3 py-1 text-xs font-medium ${
                        active 
                          ? 'bg-slate-700 dark:bg-slate-600 text-white' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      #{l}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Languages</p>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Search language..."
                value={searchLang}
                onChange={(e) => setSearchLang(e.target.value)}
                className="w-full rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-slate-500"
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {filteredLanguages.map((opt) => (
                <label 
                  key={String(opt.key)} 
                  className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ${
                    (selectedLanguage ?? '') === (opt.key ?? '') 
                      ? 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="language"
                    className="h-3.5 w-3.5 text-slate-700 dark:text-slate-400"
                    checked={(selectedLanguage ?? '') === (opt.key ?? '')}
                    onChange={() => onChangeLanguage(opt.key ?? null)}
                  />
                  <span className={`text-sm ${(selectedLanguage ?? '') === (opt.key ?? '') ? 'font-medium text-slate-900 dark:text-slate-200' : 'text-gray-700 dark:text-gray-300'}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
          {onToggleNaturalLanguage && (
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Issue Language</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-2 italic">Filter by the language issues are written in</p>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Search language..."
                  value={searchNaturalLang}
                  onChange={(e) => setSearchNaturalLang(e.target.value)}
                  className="w-full rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-slate-500"
                />
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filteredNaturalLanguages.map((lang) => {
                  const isSelected = selectedNaturalLanguages.includes(lang.key)
                  return (
                    <label 
                      key={lang.key}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ${
                        isSelected
                          ? 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 text-slate-700 dark:text-slate-400"
                        checked={isSelected}
                        onChange={() => onToggleNaturalLanguage(lang.key)}
                      />
                      <span className={`text-sm ${isSelected ? 'font-medium text-slate-900 dark:text-slate-200' : 'text-gray-700 dark:text-gray-300'}`}>
                        {lang.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default FiltersPanel


