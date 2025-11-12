import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { SearchProvider } from './contexts/SearchContext'
import { FilterPreferencesProvider } from './contexts/FilterPreferencesContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SearchProvider>
        <FilterPreferencesProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </FilterPreferencesProvider>
      </SearchProvider>
    </ThemeProvider>
  </StrictMode>,
)
