import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSearch } from '../contexts/SearchContext'
import IssueList from '../components/IssueList'
import FiltersPanel from '../components/FiltersPanel'
import { buildGitHubQuery } from '../utils/queryBuilder'
import { TAGLINE } from '../constants/brand'

const SearchResultsPage: React.FC = () => {
  const { submittedSearch, clearSearch } = useSearch()
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null)
  const [selectedLastActivity, setSelectedLastActivity] = useState<string | null>(null)

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
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <h1 className="font-display text-3xl font-medium text-ink dark:text-white">
            Search issues
          </h1>
          <p className="mt-2 text-sm text-ink-muted">{TAGLINE}</p>
          {submittedSearch && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="text-sm text-ink-muted">
                Results for <span className="font-semibold text-ink dark:text-zinc-100">“{submittedSearch}”</span>
              </p>
              <button
                onClick={clearSearch}
                className="text-xs font-medium text-accent hover:underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>
        <Link to="/issues" className="btn-secondary">
          Browse all
        </Link>
      </div>

      <div className="mb-4 md:hidden">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setShowMobileFilters((v) => !v)}
        >
          {showMobileFilters ? 'Hide filters' : 'Filters'}
        </button>
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
          <IssueList className="rounded-md" query={query} />
        </div>
      </div>
    </main>
  )
}

export default SearchResultsPage

