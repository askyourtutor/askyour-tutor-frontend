/**
 * Simple in-memory cache with TTL and stale-while-revalidate support
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  isStale: boolean;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultTTL = 10 * 60 * 1000; // 10 minutes for course data
  private defaultStaleTime = 2 * 60 * 1000; // 2 minutes for stale check

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) return null;

    const now = Date.now();
    const age = now - entry.timestamp;

    // If data is expired, remove it
    if (age > this.defaultTTL) {
      this.cache.delete(key);
      return null;
    }

    // Mark as stale if beyond stale time
    if (age > this.defaultStaleTime && !entry.isStale) {
      entry.isStale = true;
    }

    return entry.data;
  }

  /**
   * Check if cached data is stale (needs revalidation)
   */
  isStale(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    const age = Date.now() - entry.timestamp;
    return age > this.defaultStaleTime;
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      isStale: false,
    });
  }

  /**
   * Clear specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getStats() {
    const entries = Array.from(this.cache.entries());
    const now = Date.now();
    
    return {
      total: entries.length,
      stale: entries.filter(([, entry]) => now - entry.timestamp > this.defaultStaleTime).length,
      fresh: entries.filter(([, entry]) => now - entry.timestamp <= this.defaultStaleTime).length,
    };
  }
}

export const cache = new CacheManager();

/**
 * Fetch with cache - implements stale-while-revalidate pattern
 */
export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  // Try to get from cache
  const cached = cache.get<T>(key);

  // If cached and not stale, return immediately
  if (cached && !cache.isStale(key)) {
    return cached;
  }

  // If cached but stale, return cached data and revalidate in background
  if (cached && cache.isStale(key)) {
    // Background revalidation
    fetcher()
      .then(data => cache.set(key, data))
      .catch(err => console.warn('Background revalidation failed:', err));
    
    return cached; // Return stale data immediately
  }

  // No cache, fetch fresh data
  const data = await fetcher();
  cache.set(key, data);
  return data;
}
