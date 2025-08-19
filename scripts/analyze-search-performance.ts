/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { prisma } from "../prisma/prisma";

/**
 * Advanced search performance analysis and optimization
 */

export async function analyzeSearchPerformance() {
  console.log("🔍 Analyzing current search performance...\n");

  // Test multiple query patterns
  const testQueries = [
    { query: "allah", description: "Common Arabic/French word" },
    { query: "prophète", description: "French with accent" },
    { query: "prière", description: "Short French word" },
    { query: "الله", description: "Pure Arabic" },
    { query: "a", description: "Very short query (worst case)" },
  ];

  for (const test of testQueries) {
    console.log(`Testing: "${test.query}" (${test.description})`);

    // Test direct database query performance
    const startTime = performance.now();

    try {
      const result = await prisma.$queryRaw`
        EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
        SELECT h.id, h.numero, h.matn_fr, h.matn_ar
        FROM "Hadith" h
        WHERE 
          h.matn_fr ILIKE '%' || ${test.query.toLowerCase()} || '%'
          OR h.matn_ar ILIKE '%' || ${test.query} || '%'
        ORDER BY h.numero ASC
        LIMIT 50
      `;

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      console.log(`  ⏱️  Time: ${executionTime.toFixed(2)}ms`);
      console.log(`  📊 Query plan:`, JSON.stringify(result, null, 2));
      console.log("");
    } catch (error) {
      console.error(`  ❌ Error testing "${test.query}":`, error);
    }
  }
}

/**
 * Check database configuration for search optimization
 */
export async function checkDatabaseConfig() {
  console.log("🔧 Checking database configuration...\n");

  try {
    // Check available extensions
    const extensions = await prisma.$queryRaw`
      SELECT extname, extversion 
      FROM pg_extension 
      WHERE extname IN ('pg_trgm', 'unaccent')
    `;
    console.log("📦 Available extensions:", extensions);

    // Check current indexes
    const indexes = await prisma.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename = 'Hadith'
      ORDER BY indexname
    `;
    console.log("📋 Current indexes:", indexes);

    // Check table statistics
    const stats = await prisma.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes,
        n_live_tup as live_rows,
        last_analyze,
        last_autoanalyze
      FROM pg_stat_user_tables 
      WHERE relname = 'Hadith'
    `;
    console.log("📈 Table statistics:", stats);

    // Check memory settings
    const memorySettings = await prisma.$queryRaw`
      SELECT 
        name,
        setting,
        unit,
        context
      FROM pg_settings 
      WHERE name IN ('work_mem', 'shared_buffers', 'random_page_cost', 'seq_page_cost')
    `;
    console.log("💾 Memory settings:", memorySettings);
  } catch (error) {
    console.error("❌ Error checking database config:", error);
  }
}

/**
 * Create optimal search recommendations
 */
export async function getSearchOptimizationRecommendations() {
  console.log("💡 Search optimization recommendations:\n");

  console.log("1. 📊 Use LIMIT more aggressively:");
  console.log("   - Current: 50 results");
  console.log("   - Recommended: 20-25 results for initial load");
  console.log("   - Add pagination for more results\n");

  console.log("2. 🎯 Implement query caching:");
  console.log("   - Cache common search terms");
  console.log("   - Use Redis or in-memory cache");
  console.log("   - TTL: 5-10 minutes\n");

  console.log("3. 🚀 Use search result materialization:");
  console.log("   - Pre-compute search indexes");
  console.log("   - Create search_cache table");
  console.log("   - Update on hadith changes\n");

  console.log("4. ⚡ Optimize for common patterns:");
  console.log("   - Most searches are 3-6 characters");
  console.log("   - Consider prefix/suffix optimization");
  console.log("   - Use different strategies per query length\n");

  console.log("5. 🔧 Database tuning:");
  console.log("   - Increase work_mem for complex queries");
  console.log("   - Tune random_page_cost for SSD");
  console.log("   - Consider connection pooling\n");
}

// Main analysis function
export async function runSearchPerformanceAnalysis() {
  try {
    await analyzeSearchPerformance();
    await checkDatabaseConfig();
    await getSearchOptimizationRecommendations();
  } catch (error) {
    console.error("❌ Analysis failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}
