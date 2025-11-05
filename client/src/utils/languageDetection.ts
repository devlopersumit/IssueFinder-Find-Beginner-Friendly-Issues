/**
 * Detects the natural language of text content
 * Uses simple heuristics based on character patterns
 */

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

/**
 * Detects the natural language of a given text
 * Returns the language code or 'other' if detection is uncertain
 */
export function detectLanguage(text: string): NaturalLanguage {
  if (!text || text.trim().length === 0) {
    return 'en' // Default to English for empty text
  }

  // Remove URLs, code blocks, and special characters for better detection
  const cleanText = text
    .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/[#*_\-\[\](){}]/g, ' ') // Remove markdown and special chars
    .trim()

  if (cleanText.length < 3) {
    return 'en' // Too short to detect
  }

  // Chinese character ranges (CJK Unified Ideographs)
  const chinesePattern = /[\u4e00-\u9fff]/
  
  // Japanese character ranges (Hiragana, Katakana, CJK)
  const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/
  
  // Korean character range (Hangul)
  const koreanPattern = /[\uac00-\ud7a3]/
  
  // Arabic character range
  const arabicPattern = /[\u0600-\u06ff]/
  
  // Cyrillic (Russian, etc.)
  const cyrillicPattern = /[\u0400-\u04ff]/
  
  // Devanagari (Hindi, etc.)
  const devanagariPattern = /[\u0900-\u097f]/

  // Count occurrences
  const chineseMatches = (cleanText.match(chinesePattern) || []).length
  const japaneseMatches = (cleanText.match(japanesePattern) || []).length
  const koreanMatches = (cleanText.match(koreanPattern) || []).length
  const arabicMatches = (cleanText.match(arabicPattern) || []).length
  const cyrillicMatches = (cleanText.match(cyrillicPattern) || []).length
  const devanagariMatches = (cleanText.match(devanagariPattern) || []).length

  // Check for non-ASCII characters that might indicate other languages
  const nonAsciiChars = cleanText.match(/[^\x00-\x7F]/g) || []
  const nonAsciiRatio = nonAsciiChars.length / cleanText.length

  // If text has significant non-ASCII content, try to detect language
  if (nonAsciiRatio > 0.3) {
    // Japanese has both hiragana/katakana and kanji, so check for hiragana/katakana first
    if (japaneseMatches > 0 && /[\u3040-\u309f\u30a0-\u30ff]/.test(cleanText)) {
      return 'ja'
    }
    
    // Chinese (check for Chinese characters without Japanese hiragana/katakana)
    if (chineseMatches > 0 && !/[\u3040-\u309f\u30a0-\u30ff]/.test(cleanText)) {
      return 'zh'
    }
    
    // Korean
    if (koreanMatches > 0) {
      return 'ko'
    }
    
    // Arabic
    if (arabicMatches > 0) {
      return 'ar'
    }
    
    // Cyrillic (Russian)
    if (cyrillicMatches > 0) {
      return 'ru'
    }
    
    // Devanagari (Hindi)
    if (devanagariMatches > 0) {
      return 'hi'
    }
    
    // Other non-ASCII languages (Spanish, French, German, Portuguese with accents)
    // These are harder to detect, so we'll use heuristics
    if (/[àáâãäåèéêëìíîïòóôõöùúûüýÿñç]/i.test(cleanText)) {
      // Could be Spanish, French, Portuguese, etc.
      // Check for common Spanish words
      if (/\b(es|el|la|de|que|en|un|una|por|con|para)\b/i.test(cleanText)) {
        return 'es'
      }
      // Check for common French words
      if (/\b(le|la|les|de|du|des|et|est|un|une|pour|avec|dans)\b/i.test(cleanText)) {
        return 'fr'
      }
      // Check for common Portuguese words
      if (/\b(o|a|os|as|de|do|da|dos|das|em|um|uma|com|para)\b/i.test(cleanText)) {
        return 'pt'
      }
    }
    
    // German (umlauts)
    if (/[äöüß]/i.test(cleanText)) {
      return 'de'
    }
  }

  // Default to English if mostly ASCII or uncertain
  return 'en'
}

/**
 * Gets the user's browser language
 * Returns the language code (e.g., 'en', 'zh', 'ja')
 */
export function getBrowserLanguage(): NaturalLanguage {
  if (typeof navigator === 'undefined') {
    return 'en'
  }

  const lang = navigator.language || (navigator as any).userLanguage || 'en'
  const langCode = lang.split('-')[0].toLowerCase()

  // Map browser language codes to our supported languages
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

/**
 * Filters issues by natural language
 */
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
    
    // If title matches, include it
    if (allowedLanguages.includes(titleLang)) {
      return true
    }
    
    // If body exists and matches, include it
    if (bodyLang && allowedLanguages.includes(bodyLang)) {
      return true
    }
    
    // If "other" is in allowed languages and detected language is not in the list, include it
    if (allowedLanguages.includes('other')) {
      const commonLanguages: NaturalLanguage[] = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi']
      if (!commonLanguages.includes(titleLang) && (!bodyLang || !commonLanguages.includes(bodyLang))) {
        return true
      }
    }
    
    return false
  })
}

