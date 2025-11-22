export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | null

const BEGINNER_LABELS = [
  'good first issue',
  'good-first-issue',
  'first-timers-only',
  'first timers only',
  'beginner',
  'easy',
  'starter',
  'newcomer',
  'good-for-beginners',
  'good for beginners'
]

const INTERMEDIATE_LABELS = [
  'help wanted',
  'help-wanted',
  'medium',
  'intermediate',
  'moderate'
]

const ADVANCED_LABELS = [
  'expert',
  'advanced',
  'hard',
  'difficult',
  'complex',
  'challenging'
]

export function detectDifficulty(labels: Array<{ name?: string; color?: string }>): DifficultyLevel {
  if (!labels || labels.length === 0) {
    return null
  }

  const labelNames = labels.map(l => l.name?.toLowerCase() || '')

  for (const label of labelNames) {
    if (ADVANCED_LABELS.some(adv => label.includes(adv))) {
      return 'advanced'
    }
  }

  for (const label of labelNames) {
    if (BEGINNER_LABELS.some(beg => label.includes(beg))) {
      return 'beginner'
    }
  }

  for (const label of labelNames) {
    if (INTERMEDIATE_LABELS.some(int => label.includes(int))) {
      return 'intermediate'
    }
  }

  return null
}
