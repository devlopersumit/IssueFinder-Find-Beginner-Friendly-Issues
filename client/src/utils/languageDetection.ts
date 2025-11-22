export type NaturalLanguage = 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'pt' | 'ru' | 'ar' | 'hi' | 'other'

export const LANGUAGE_NAMES: Record<NaturalLanguage, string> = {
  en: 'English',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese',
  ru: 'Russian',
  ar: 'Arabic',
  hi: 'Hindi',
  other: 'Other'
}

export function detectLanguage(text: string): NaturalLanguage {
  if (!text || text.trim().length === 0) {
    return 'en' // Default to English for empty text
  }

  const cleanText = text
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#*_\-\[\](){}]/g, ' ')
    .trim()

  if (cleanText.length < 3) {
    return 'en'
  }

  const chinesePattern = /[\u4e00-\u9fff]/
  const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/
  const koreanPattern = /[\uac00-\ud7a3]/
  const arabicPattern = /[\u0600-\u06ff]/
  const cyrillicPattern = /[\u0400-\u04ff]/
  const devanagariPattern = /[\u0900-\u097f]/

  const chineseMatches = (cleanText.match(chinesePattern) || []).length
  const japaneseMatches = (cleanText.match(japanesePattern) || []).length
  const koreanMatches = (cleanText.match(koreanPattern) || []).length
  const arabicMatches = (cleanText.match(arabicPattern) || []).length
  const cyrillicMatches = (cleanText.match(cyrillicPattern) || []).length
  const devanagariMatches = (cleanText.match(devanagariPattern) || []).length

  const nonAsciiChars = cleanText.match(/[^\x00-\x7F]/g) || []
  const nonAsciiRatio = nonAsciiChars.length / cleanText.length

  if (nonAsciiRatio > 0.3) {
    if (japaneseMatches > 0 && /[\u3040-\u309f\u30a0-\u30ff]/.test(cleanText)) {
      return 'ja'
    }
    
    if (chineseMatches > 0 && !/[\u3040-\u309f\u30a0-\u30ff]/.test(cleanText)) {
      return 'zh'
    }
    
    if (koreanMatches > 0) {
      return 'ko'
    }
    
    if (arabicMatches > 0) {
      return 'ar'
    }
    
    if (cyrillicMatches > 0) {
      return 'ru'
    }
    
    if (devanagariMatches > 0) {
      return 'hi'
    }
    
    if (/[àáâãäåèéêëìíîïòóôõöùúûüýÿñç]/i.test(cleanText)) {
      if (/\b(es|el|la|de|que|en|un|una|por|con|para)\b/i.test(cleanText)) {
        return 'es'
      }
      if (/\b(le|la|les|de|du|des|et|est|un|une|pour|avec|dans)\b/i.test(cleanText)) {
        return 'fr'
      }
      if (/\b(o|a|os|as|de|do|da|dos|das|em|um|uma|com|para)\b/i.test(cleanText)) {
        return 'pt'
      }
    }
    
    if (/[äöüß]/i.test(cleanText)) {
      return 'de'
    }
  }

  return 'en'
}

export function getBrowserLanguage(): NaturalLanguage {
  if (typeof navigator === 'undefined') {
    return 'en'
  }

  const lang = navigator.language || (navigator as any).userLanguage || 'en'
  const langCode = lang.split('-')[0].toLowerCase()

  const languageMap: Record<string, NaturalLanguage> = {
    en: 'en',
    zh: 'zh',
    ja: 'ja',
    ko: 'ko',
    es: 'es',
    fr: 'fr',
    de: 'de',
    pt: 'pt',
    ru: 'ru',
    ar: 'ar',
    hi: 'hi'
  }

  return languageMap[langCode] || 'en'
}

export function filterByLanguage<T extends { title: string; body?: string }>(
  items: T[],
  allowedLanguages: NaturalLanguage[]
): T[] {
  if (allowedLanguages.length === 0 || allowedLanguages.includes('other')) {
    return items // Show all if no filter or "other" selected
  }

  return items.filter(item => {
    const titleLang = detectLanguage(item.title)
    const bodyLang = item.body ? detectLanguage(item.body) : null
    
    if (allowedLanguages.includes(titleLang)) {
      return true
    }
    
    if (bodyLang && allowedLanguages.includes(bodyLang)) {
      return true
    }
    
    if (allowedLanguages.includes('other')) {
      const commonLanguages: NaturalLanguage[] = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi']
      if (!commonLanguages.includes(titleLang) && (!bodyLang || !commonLanguages.includes(bodyLang))) {
        return true
      }
    }
    
    return false
  })
}

