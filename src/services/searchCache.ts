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

type CacheStats = {
  size: number;
  maxSize: number;
  ttl: number;
  hits: number;
  misses: number;
  hitRate: number;
};

class SearchCache {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 100; // Limit cache size
  private hits = 0;
  private misses = 0;

  /**
   * Generate cache key from query, locale and limit
   * Format: query:locale:limit (all lowercase, trimmed)
   */
  private getCacheKey(query: string, locale: string, limit: number): string {
    return `${query.toLowerCase().trim()}:${locale.toLowerCase()}:${limit}`;
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
   * Matches by query, locale, and limit
   */
  get(query: string, locale: string, limit: number): SearchResult[] | null {
    if (!query.trim()) return null;

    const key = this.getCacheKey(query, locale, limit);
    const entry = this.cache.get(key);

    if (entry && this.isValid(entry)) {
      this.hits++;
      console.debug(
        `[SearchCache] HIT: ${key} (hits: ${this.hits}, misses: ${this.misses})`
      );
      return entry.results;
    }

    this.misses++;
    console.debug(
      `[SearchCache] MISS: ${key} (hits: ${this.hits}, misses: ${this.misses})`
    );

    // Remove expired entry
    if (entry) {
      this.cache.delete(key);
    }

    return null;
  }

  /**
   * Cache search results with locale support
   */
  set(
    query: string,
    locale: string,
    limit: number,
    results: SearchResult[],
    ttl?: number
  ): void {
    if (!query.trim()) return;

    const key = this.getCacheKey(query, locale, limit);

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
  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      ttl: this.DEFAULT_TTL,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? ((this.hits / total) * 100).toFixed(2) : "0",
    } as unknown as CacheStats;
  }
}

// Export singleton instance
export const searchCache = new SearchCache();
