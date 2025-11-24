import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import IssueList from '../components/IssueList'
import { buildGitHubQuery } from '../utils/queryBuilder'

const HomePage: React.FC = () => {
  const defaultQuery = useMemo(() => {
    return buildGitHubQuery({
      selectedCategories: ['good first issue', 'help wanted'],
    })
  }, [])

  return (
    <>
      <Hero />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Open Source Issues</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Discover beginner-friendly issues ready for contribution
              </p>
            </div>
            <Link
            to="/issues"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
            View all →
            </Link>
          </div>
        <IssueList className="rounded-md" query={defaultQuery} naturalLanguageFilter={[]} />
      </main>
    </>
  )
}

export default HomePage
