/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { SearchResult } from "./searchServices";

/**
 * Simple in-memory cache for search results
 * Helps achieve <300ms performance for repeated queries
 */

type CacheEntry = {
  results: SearchResult[];
  timestamp: number;
  ttl: number; // Time to live in milliseconds
};

class SearchCache {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 100; // Limit cache size

  /**
   * Generate cache key from query and limit
   */
  private getCacheKey(query: string, limit: number): string {
    return `${query.toLowerCase().trim()}:${limit}`;
  }

  /**
   * Check if cache entry is valid
   */
  private isValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * Clean expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Evict oldest entries if cache is full
   */
  private evictOldest(): void {
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
  }

  /**
   * Get cached results
   */
  get(query: string, limit: number): SearchResult[] | null {
    if (!query.trim()) return null;

    const key = this.getCacheKey(query, limit);
    const entry = this.cache.get(key);

    if (entry && this.isValid(entry)) {
      return entry.results;
    }

    // Remove expired entry
    if (entry) {
      this.cache.delete(key);
    }

    return null;
  }

  /**
   * Cache search results
   */
  set(
    query: string,
    limit: number,
    results: SearchResult[],
    ttl?: number
  ): void {
    if (!query.trim()) return;

    const key = this.getCacheKey(query, limit);

    // Cleanup and eviction
    this.cleanup();
    this.evictOldest();

    this.cache.set(key, {
      results,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL,
    });
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      ttl: this.DEFAULT_TTL,
    };
  }
}

// Export singleton instance
export const searchCache = new SearchCache();
