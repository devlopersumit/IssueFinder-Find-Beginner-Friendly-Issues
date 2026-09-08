type CacheEntry<T> = {
  data: T
  timestamp: number
  expiresAt: number
}

const CACHE_DURATION = 5 * 60 * 1000
const DAILY_CACHE_DURATION = 24 * 60 * 60 * 1000

/**
 * GitHub search issues change slowly for our UI (today / yesterday / Nd ago).
 * 45 minutes balances freshness vs unauthenticated rate limits (10 search req/min).
 */
export const ISSUES_CACHE_DURATION = 45 * 60 * 1000

const STORAGE_PREFIX = 'ih_issues_cache_v1:'
const MAX_PERSISTED_ENTRIES = 40

const cache = new Map<string, CacheEntry<unknown>>()
const inflight = new Map<string, Promise<unknown>>()

function readPersisted<T>(key: string): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return null
    const entry = JSON.parse(raw) as CacheEntry<T>
    if (!entry || typeof entry.expiresAt !== 'number' || entry.data === undefined) {
      return null
    }
    return entry
  } catch {
    return null
  }
}

function writePersisted<T>(key: string, entry: CacheEntry<T>): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry))
    prunePersisted()
  } catch {
    // Quota / private mode — memory cache still works
  }
}

function prunePersisted(): void {
  try {
    const keys: Array<{ key: string; expiresAt: number }> = []
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i)
      if (!fullKey?.startsWith(STORAGE_PREFIX)) continue
      try {
        const entry = JSON.parse(localStorage.getItem(fullKey) || '') as CacheEntry<unknown>
        keys.push({ key: fullKey, expiresAt: entry?.expiresAt ?? 0 })
      } catch {
        localStorage.removeItem(fullKey)
      }
    }

    const now = Date.now()
    for (const item of keys) {
      if (item.expiresAt < now - ISSUES_CACHE_DURATION) {
        localStorage.removeItem(item.key)
      }
    }

    const remaining = keys
      .filter((item) => localStorage.getItem(item.key))
      .sort((a, b) => a.expiresAt - b.expiresAt)

    while (remaining.length > MAX_PERSISTED_ENTRIES) {
      const oldest = remaining.shift()
      if (oldest) localStorage.removeItem(oldest.key)
    }
  } catch {
    /* ignore */
  }
}

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined
  if (entry) {
    if (Date.now() > entry.expiresAt) {
      cache.delete(key)
      return null
    }
    return entry.data
  }
  return null
}

export function setCached<T>(key: string, data: T, duration: number = CACHE_DURATION): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + duration,
  })
}

export function setDailyCached<T>(key: string, data: T): void {
  const today = new Date().toISOString().split('T')[0]
  const dailyKey = `${key}_${today}`
  setCached(dailyKey, data, DAILY_CACHE_DURATION)
}

export function getDailyCached<T>(key: string): T | null {
  const today = new Date().toISOString().split('T')[0]
  const dailyKey = `${key}_${today}`
  return getCached<T>(dailyKey)
}

export type IssuesCacheHit<T> = {
  data: T
  /** True while within ISSUES_CACHE_DURATION — do not hit the network */
  fresh: boolean
  ageMs: number
}

export function getIssuesCacheHit<T>(key: string): IssuesCacheHit<T> | null {
  const now = Date.now()

  let entry = cache.get(key) as CacheEntry<T> | undefined
  if (!entry) {
    const persisted = readPersisted<T>(key)
    if (persisted) {
      entry = persisted
      cache.set(key, persisted)
    }
  }

  if (!entry) return null

  const ageMs = now - entry.timestamp
  const fresh = now <= entry.expiresAt

  // Keep serving briefly after expiry (stale) so UI stays populated while we refresh
  const staleWindow = ISSUES_CACHE_DURATION
  if (!fresh && ageMs > ISSUES_CACHE_DURATION + staleWindow) {
    cache.delete(key)
    try {
      localStorage.removeItem(STORAGE_PREFIX + key)
    } catch {
      /* ignore */
    }
    return null
  }

  return { data: entry.data, fresh, ageMs }
}

export function setIssuesCached<T>(key: string, data: T): void {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + ISSUES_CACHE_DURATION,
  }
  cache.set(key, entry)
  writePersisted(key, entry)
}

export function getIssuesCached<T>(key: string): T | null {
  const hit = getIssuesCacheHit<T>(key)
  return hit?.data ?? null
}

/** Deduplicate concurrent identical issue fetches across mounts (Hero + Issues). */
export function shareInflight<T>(key: string, factory: () => Promise<T>): Promise<T> {
  const existing = inflight.get(key) as Promise<T> | undefined
  if (existing) return existing

  const promise = factory().finally(() => {
    inflight.delete(key)
  })
  inflight.set(key, promise)
  return promise
}

export function invalidateCache(keyPattern?: string): void {
  if (!keyPattern) {
    cache.clear()
    try {
      const toRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const fullKey = localStorage.key(i)
        if (fullKey?.startsWith(STORAGE_PREFIX)) toRemove.push(fullKey)
      }
      toRemove.forEach((k) => localStorage.removeItem(k))
    } catch {
      /* ignore */
    }
    return
  }

  for (const key of cache.keys()) {
    if (key.includes(keyPattern)) {
      cache.delete(key)
    }
  }

  try {
    const toRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i)
      if (fullKey?.startsWith(STORAGE_PREFIX) && fullKey.includes(keyPattern)) {
        toRemove.push(fullKey)
      }
    }
    toRemove.forEach((k) => localStorage.removeItem(k))
  } catch {
    /* ignore */
  }
}
