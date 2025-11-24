import React, { useMemo, useState, useEffect } from 'react'
import FiltersPanel from '../components/FiltersPanel'
import IssueList from '../components/IssueList'
import MobileCategoryTabs from '../components/MobileCategoryTabs'
import { useSearch } from '../contexts/SearchContext'
import type { NaturalLanguage } from '../utils/languageDetection'
import { getBrowserLanguage } from '../utils/languageDetection'
import { buildGitHubQuery } from '../utils/queryBuilder'

const IssuesPage: React.FC = () => {
  const { submittedSearch } = useSearch()
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [selectedNaturalLanguages, setSelectedNaturalLanguages] = useState<NaturalLanguage[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null)
  const [selectedLastActivity, setSelectedLastActivity] = useState<string | null>(null)

  useEffect(() => {
    const browserLang = getBrowserLanguage()
    setSelectedNaturalLanguages([browserLang])
  }, [])

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]))
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (category === 'all') {
        return prev.includes('all') ? [] : ['all']
      }
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      }
      return [...prev.filter((c) => c !== 'all'), category]
    })
  }

  const query = useMemo(() => {
    return buildGitHubQuery({
      searchTerm: submittedSearch || undefined,
      selectedLabels,
      selectedCategories,
      selectedLanguage,
      selectedDifficulty,
      selectedType,
      selectedFramework,
      selectedLastActivity,
    })
  }, [submittedSearch, selectedLabels, selectedCategories, selectedLanguage, selectedDifficulty, selectedType, selectedFramework, selectedLastActivity])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Browse Issues</h1>
        <p className="text-slate-600 dark:text-slate-400">Find open source issues that match your skills</p>
      </div>

      <MobileCategoryTabs
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
      />

      <div className="mb-4 flex items-center justify-between">
        <div className="md:hidden">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => setShowMobileFilters((v) => !v)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {showMobileFilters && (
        <div className="md:hidden mb-4">
          <FiltersPanel
            className="rounded-md"
            selectedLabels={selectedLabels}
            onToggleLabel={toggleLabel}
            selectedLanguage={selectedLanguage}
            onChangeLanguage={setSelectedLanguage}
            showTags={true}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            isMobile={true}
            selectedDifficulty={selectedDifficulty}
            onChangeDifficulty={setSelectedDifficulty}
            selectedType={selectedType}
            onChangeType={setSelectedType}
            selectedFramework={selectedFramework}
            onChangeFramework={setSelectedFramework}
            selectedLastActivity={selectedLastActivity}
            onChangeLastActivity={setSelectedLastActivity}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="hidden md:block md:col-span-3">
          <FiltersPanel
            className="rounded-md md:sticky md:top-4"
            selectedLabels={selectedLabels}
            onToggleLabel={toggleLabel}
            selectedLanguage={selectedLanguage}
            onChangeLanguage={setSelectedLanguage}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            selectedDifficulty={selectedDifficulty}
            onChangeDifficulty={setSelectedDifficulty}
            selectedType={selectedType}
            onChangeType={setSelectedType}
            selectedFramework={selectedFramework}
            onChangeFramework={setSelectedFramework}
            selectedLastActivity={selectedLastActivity}
            onChangeLastActivity={setSelectedLastActivity}
          />
        </div>
        <div className="md:col-span-9">
          <IssueList className="rounded-md" query={query} naturalLanguageFilter={selectedNaturalLanguages} />
        </div>
      </div>
    </main>
  )
}

export default IssuesPage

