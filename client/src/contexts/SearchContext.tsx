import React, { createContext, useContext, useState, ReactNode } from 'react'

type SearchContextType = {
  searchTerm: string
  setSearchTerm: (term: string) => void
  submittedSearch: string
  submitSearch: (term: string) => void
  clearSearch: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [submittedSearch, setSubmittedSearch] = useState<string>('')

  const submitSearch = (term: string) => {
    const trimmedTerm = term.trim()
    setSubmittedSearch(trimmedTerm)
    setSearchTerm(trimmedTerm)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSubmittedSearch('')
  }

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        submittedSearch,
        submitSearch,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

