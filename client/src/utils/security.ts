/**
 * Security Utilities
 * Input validation, sanitization, and security helpers
 */

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 200) // Limit length
}

/**
 * Validate GitHub username format
 * GitHub usernames: 1-39 characters, alphanumeric and hyphens, cannot start/end with hyphen
 */
export function validateGitHubUsername(username: string): { valid: boolean; error?: string } {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' }
  }

  const trimmed = username.trim()

  if (trimmed.length === 0) {
    return { valid: false, error: 'Username cannot be empty' }
  }

  if (trimmed.length > 39) {
    return { valid: false, error: 'Username must be 39 characters or less' }
  }

  // GitHub username regex: alphanumeric, hyphens, cannot start/end with hyphen
  const githubUsernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/

  if (!githubUsernameRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid GitHub username format' }
  }

  return { valid: true }
}

/**
 * Sanitize URL to prevent open redirect attacks
 */
export function sanitizeUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null
  }

  try {
    const parsed = new URL(url)

    // Only allow https and http protocols
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      return null
    }

    // Block javascript: and data: protocols
    if (url.toLowerCase().startsWith('javascript:') || url.toLowerCase().startsWith('data:')) {
      return null
    }

    return parsed.toString()
  } catch {
    // Invalid URL
    return null
  }
}

/**
 * Validate and sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== 'string') {
    return ''
  }

  // Remove potentially dangerous characters but keep GitHub search syntax
  return query
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim()
    .slice(0, 500) // Limit length
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return ''
  }

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }

  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Validate URL is from GitHub
 */
export function isGitHubUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }

  try {
    const parsed = new URL(url)
    return parsed.hostname === 'github.com' || parsed.hostname.endsWith('.github.com')
  } catch {
    return false
  }
}

/**
 * Rate limit helper - simple in-memory rate limiting
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const requests = this.requests.get(identifier) || []

    // Remove old requests outside the window
    const recentRequests = requests.filter((time) => now - time < this.windowMs)

    if (recentRequests.length >= this.maxRequests) {
      return false
    }

    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    return true
  }

  reset(identifier: string): void {
    this.requests.delete(identifier)
  }
}

export const apiRateLimiter = new RateLimiter(10, 60000) // 10 requests per minute

