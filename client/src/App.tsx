import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import IssuesPage from './pages/IssuesPage'
import BountyIssuesPage from './pages/BountyIssuesPage'
import SearchResultsPage from './pages/SearchResultsPage'
import RepositoriesPage from './pages/RepositoriesPage'
import BeginnerGuidePage from './pages/BeginnerGuidePage'
import CategoriesPage from './pages/CategoriesPage'
import DashboardPage from './pages/DashboardPage'
import ContributorProfile from './pages/ContributorProfile'
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header
        title="IssueFinder"
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSubmitSearch={onSubmitSearch}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/bounty" element={<BountyIssuesPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/repositories" element={<RepositoriesPage />} />
        <Route path="/beginner-guide" element={<BeginnerGuidePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/contributor/:username" element={<ContributorProfile />} />
      </Routes>
      <Footer
        githubUrl="https://github.com/devlopersumit"
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
