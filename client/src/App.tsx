import React from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import IssuesPage from './pages/IssuesPage'
import SearchResultsPage from './pages/SearchResultsPage'
import RepositoriesPage from './pages/RepositoriesPage'
import BeginnerGuidePage from './pages/BeginnerGuidePage'
import CategoriesPage from './pages/CategoriesPage'
import { useSearch } from './contexts/SearchContext'

const AppContent: React.FC = () => {
  const { searchTerm, setSearchTerm, submitSearch } = useSearch()
  const navigate = useNavigate()

  const onSubmitSearch = () => {
    if (searchTerm.trim()) {
      submitSearch(searchTerm.trim())
      navigate('/search')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper dark:bg-zinc-950">
      <Header
        title="IssueFinder"
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSubmitSearch={onSubmitSearch}
      />
      <div className="flex-1">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/repositories" element={<RepositoriesPage />} />
        <Route path="/beginner-guide" element={<BeginnerGuidePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/bounty" element={<Navigate to="/issues" replace />} />
        <Route path="/dashboard" element={<Navigate to="/issues" replace />} />
        <Route path="/contributor/:username" element={<Navigate to="/issues" replace />} />
      </Routes>
      </div>
      <Footer
        githubUrl="https://github.com/sumitjhacodes"
        linkedinUrl="https://www.linkedin.com/in/sumit-jha?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        twitterUrl="https://x.com/_sumitjha_?t=4nSWLPjfWOEhS06PoX9-Lg&s=09"
      />
    </div>
  )
}

const App: React.FC = () => {
  return <AppContent />
}

export default App
