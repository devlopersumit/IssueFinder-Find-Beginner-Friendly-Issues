export type QueryBuilderParams = {
  searchTerm?: string
  selectedLabels?: string[]
  selectedCategories?: string[]
  selectedLanguage?: string | null
  selectedLicense?: string | null
  selectedDifficulty?: string | null
  selectedType?: string | null
  selectedFramework?: string | null
  selectedLastActivity?: string | null
}

function getDifficultyLabels(difficulty: string | null): { include: string[], exclude?: string[] } {
  if (!difficulty) return { include: [] }
  
  const difficultyMap: Record<string, { include: string[], exclude?: string[] }> = {
    beginner: {
      include: [
        'good first issue',      // Most common - used by thousands of repos
        'good-first-issue',
      ],
    },
    intermediate: {
      include: [
        'help wanted',           // Most common - used by thousands of repos
        'help-wanted',           // Hyphenated version (also very common)
      ],
      exclude: [
        'good first issue',      // Exclude beginner labels to avoid overlap
        'good-first-issue',
      ]
    },
    advanced: {
      include: [
        'expert',                // Common label for advanced issues
        'advanced',              // Direct label
        'hard',                  // Simple common label
        'difficult',             // Alternative
        'complex',               // Alternative
        'challenging',
      ],
      exclude: [
        'good first issue',      // Exclude beginner labels
        'good-first-issue',
        'first-timers-only',
        'help wanted',           // Exclude intermediate labels
        'help-wanted',
      ]
    }
  }
  
  return difficultyMap[difficulty] || { include: [] }
}

function getFrameworkSearch(framework: string | null): string {
  if (!framework) return ''
  
  const frameworkMap: Record<string, string> = {
    react: 'react',
    vue: 'vue',
    angular: 'angular',
    nextjs: 'next.js',
    nuxt: 'nuxt',
    svelte: 'svelte',
    express: 'express',
    django: 'django',
    flask: 'flask',
    rails: 'rails',
    spring: 'spring',
    laravel: 'laravel',
    fastapi: 'fastapi',
    nestjs: 'nestjs'
  }
  
  const searchTerm = frameworkMap[framework]
  if (!searchTerm) return ''
  
  return searchTerm
}

function getLastActivityQuery(activity: string | null): string {
  if (!activity) return ''
  
  try {
    const now = new Date()
    let date: Date
    
    switch (activity) {
      case 'last-week':
        date = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'last-month':
        date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'last-3months':
        date = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'active':
        date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        return ''
    }
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    return `updated:>${dateStr}`
  } catch (error) {
    console.error('Error generating last activity query:', error)
    return ''
  }
}

export function buildGitHubQuery(params: QueryBuilderParams): string {
  const parts: string[] = []
  
  parts.push('state:open')
  parts.push('type:issue')
  parts.push('no:assignee')
  
  const now = new Date()
  // Default to issues updated in last 1 month (30 days)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  const thirtyDaysAgoStr = `${thirtyDaysAgo.getFullYear()}-${String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(thirtyDaysAgo.getDate()).padStart(2, '0')}`
  
  if (params.selectedLastActivity) {
    const activityQuery = getLastActivityQuery(params.selectedLastActivity)
    if (activityQuery) {
      parts.push(activityQuery)
    } else {
      // Default to issues updated in last 1 month
      parts.push(`updated:>${thirtyDaysAgoStr}`)
    }
  } else {
    // Default to issues updated in last 1 month
    parts.push(`updated:>${thirtyDaysAgoStr}`)
  }
  
  if (params.selectedDifficulty) {
    const difficultyConfig = getDifficultyLabels(params.selectedDifficulty)
    
    if (params.selectedDifficulty === 'advanced') {
      // Don't reset parts array - keep the date filter and other filters
      // Just add the advanced difficulty labels
      parts.push('(label:"expert" OR label:"advanced" OR label:"hard" OR label:"difficult" OR label:"complex" OR label:"challenging")')
      parts.push('-label:"good first issue"')
      parts.push('-label:"good-first-issue"')
      parts.push('-label:"first-timers-only"')
      parts.push('-label:"help wanted"')
      parts.push('-label:"help-wanted"')
    } else {
      if (difficultyConfig.include.length > 0) {
        if (difficultyConfig.include.length === 1) {
          parts.push(`label:"${difficultyConfig.include[0]}"`)
        } else {
          const includeLabels = difficultyConfig.include.map(label => `label:"${label}"`).join(' OR ')
          parts.push(`(${includeLabels})`)
        }
        
        if (difficultyConfig.exclude && difficultyConfig.exclude.length > 0) {
          difficultyConfig.exclude.forEach(label => {
            parts.push(`-label:"${label}"`)
          })
        }
      }
    }
  }
  
  // Add search term (works with all difficulty levels)
  if (params.searchTerm && params.searchTerm.trim()) {
    parts.push(params.searchTerm.trim())
  }
  
  // Add framework filter (works with all difficulty levels)
  if (params.selectedFramework) {
    const frameworkQuery = getFrameworkSearch(params.selectedFramework)
    if (frameworkQuery) {
      parts.push(frameworkQuery)
    }
  }
  
  // Add language filter (works with all difficulty levels)
  if (params.selectedLanguage) {
    parts.push(`language:${params.selectedLanguage}`)
  }
  
  // Add category filters (only if no difficulty is selected, or if it's not advanced)
  if (params.selectedDifficulty !== 'advanced' && params.selectedCategories && params.selectedCategories.length > 0 && !params.selectedCategories.includes('all')) {
    const categoryQueries = params.selectedCategories.map((cat) => `label:"${cat}"`)
    if (categoryQueries.length === 1) {
      parts.push(categoryQueries[0])
    } else if (categoryQueries.length > 1) {
      parts.push(`(${categoryQueries.join(' OR ')})`)
    }
  }
  
  // Add type filter (only if no difficulty is selected, or if it's not advanced)
  if (params.selectedDifficulty !== 'advanced' && params.selectedType) {
    if (!params.selectedCategories || !params.selectedCategories.includes(params.selectedType)) {
      parts.push(`label:"${params.selectedType}"`)
    }
  }
  
  // Add custom labels (works with all difficulty levels)
  if (params.selectedLabels && params.selectedLabels.length > 0) {
    params.selectedLabels.forEach((l) => parts.push(`label:"${l}"`))
  }
  
  
  const query = parts.join(' ')
  
  const hasAnyFilter = params.selectedDifficulty || 
                       params.selectedType || 
                       params.selectedFramework || 
                       params.selectedLanguage ||
                       params.selectedLicense ||
                       params.selectedLastActivity ||
                       (params.selectedCategories && params.selectedCategories.length > 0 && !params.selectedCategories.includes('all')) ||
                       (params.selectedLabels && params.selectedLabels.length > 0) ||
                       (params.searchTerm && params.searchTerm.trim())
  
  const baseDateFilter = `updated:>${thirtyDaysAgoStr}`
  
  // If no filters are applied, show good first issues and help wanted
  if (!hasAnyFilter && query === `state:open type:issue no:assignee ${baseDateFilter}`) {
    return `state:open type:issue no:assignee ${baseDateFilter} (label:"good first issue" OR label:"help wanted")`
  }
  
  return query
}

