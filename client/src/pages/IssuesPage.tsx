import React, { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import FiltersPanel from '../components/FiltersPanel'
import IssueList from '../components/IssueList'
import MobileCategoryTabs from '../components/MobileCategoryTabs'
import { useSearch } from '../contexts/SearchContext'
import type { NaturalLanguage } from '../utils/languageDetection'
import { getBrowserLanguage } from '../utils/languageDetection'
import { buildGitHubQuery } from '../utils/queryBuilder'
import { TAGLINE } from '../constants/brand'

const IssuesPage: React.FC = () => {
  const { submittedSearch } = useSearch()
  const [searchParams] = useSearchParams()
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
    setSelectedNaturalLanguages([getBrowserLanguage()])
  }, [])

  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const difficultyParam = searchParams.get('difficulty')
    const languageParam = searchParams.get('language')

    if (categoryParam) setSelectedCategories([categoryParam])
    if (difficultyParam) setSelectedDifficulty(difficultyParam)
    if (languageParam) setSelectedLanguage(languageParam)
  }, [searchParams])

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]))
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (category === 'all') return prev.includes('all') ? [] : ['all']
      if (prev.includes(category)) return prev.filter((c) => c !== category)
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
  }, [
    submittedSearch,
    selectedLabels,
    selectedCategories,
    selectedLanguage,
    selectedDifficulty,
    selectedType,
    selectedFramework,
    selectedLastActivity,
  ])

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl font-medium tracking-tight text-ink dark:text-white sm:text-4xl">
          Browse issues
        </h1>
        <p className="mt-2 text-base text-ink-muted">{TAGLINE}</p>
      </header>

      <MobileCategoryTabs selectedCategories={selectedCategories} onToggleCategory={toggleCategory} />

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
        <div className="mb-6 md:hidden">
          <FiltersPanel
            className="rounded-lg"
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

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <aside className="hidden md:col-span-3 md:block">
          <FiltersPanel
            className="sticky top-20 rounded-lg"
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
        </aside>
        <div className="md:col-span-9">
          <IssueList query={query} naturalLanguageFilter={selectedNaturalLanguages} />
        </div>
      </div>
    </main>
  )
}

export default IssuesPage
