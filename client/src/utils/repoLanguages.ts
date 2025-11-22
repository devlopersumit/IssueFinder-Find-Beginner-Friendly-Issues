export type RepoLanguages = Record<string, string[]>

export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    'JavaScript': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
    'TypeScript': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    'Python': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700',
    'Java': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700',
    'Go': 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700',
    'Rust': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600',
    'C++': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    'C': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600',
    'C#': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    'PHP': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
    'Ruby': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700',
    'Swift': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700',
    'Kotlin': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    'Dart': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    'HTML': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700',
    'CSS': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    'Scala': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700',
    'Lua': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    'Shell': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600',
    'R': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
  }
  
  return colors[language] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600'
}

export async function fetchRepositoryLanguages(repoUrl: string): Promise<string[]> {
  try {
    const cacheKey = `repoLanguages_${repoUrl}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const { languages, timestamp } = JSON.parse(cached)
      const cacheAge = Date.now() - timestamp
      const cacheMaxAge = 24 * 60 * 60 * 1000
      if (cacheAge < cacheMaxAge && Array.isArray(languages)) {
        return languages
      }
    }
  } catch (err) {
  }

  try {
    const parts = repoUrl.replace('https://api.github.com/repos/', '').split('/')
    if (parts.length < 2) return []
    
    const owner = parts[0]
    const repo = parts[1]
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/languages`
    
    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/vnd.github+json'
      }
    })
    
    if (!response.ok) {
      if (response.status === 403 || response.status === 404) {
        try {
          const cacheKey = `repoLanguages_${repoUrl}`
          localStorage.setItem(cacheKey, JSON.stringify({
            languages: [],
            timestamp: Date.now()
          }))
        } catch (err) {
        }
      }
      return []
    }

    const languages: Record<string, number> = await response.json()
    
    const sortedLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([lang]) => lang)
    
    if (sortedLanguages.length > 0) {
      try {
        const cacheKey = `repoLanguages_${repoUrl}`
        localStorage.setItem(cacheKey, JSON.stringify({
          languages: sortedLanguages,
          timestamp: Date.now()
        }))
      } catch (err) {
      }
    }
    
    return sortedLanguages
  } catch (error) {
    return []
  }
}

