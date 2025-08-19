/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { prisma } from "../prisma/prisma";

/**
 * Create optimized PostgreSQL indexes for Hadith search performance
 * Target: <300ms search time for 6000+ hadiths
 */

export async function createSearchIndexes() {
  console.log("🚀 Creating optimized search indexes...");

  try {
    // Enable required extensions
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS unaccent`;
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS pg_trgm`;
    console.log("✅ Extensions enabled");

    // French Full-Text Search index
    await prisma.$executeRaw`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hadith_matn_fr_fts 
      ON "Hadith" 
      USING gin(to_tsvector('french', unaccent(matn_fr)))
    `;
    console.log("✅ French FTS index created");

    // Arabic Full-Text Search index
    await prisma.$executeRaw`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hadith_matn_ar_fts 
      ON "Hadith" 
      USING gin(to_tsvector('simple', REGEXP_REPLACE(matn_ar, '[ًٌٍَُِّْٰ]', '', 'g')))
    `;
    console.log("✅ Arabic FTS index created");

    // Composite index for JOINs optimization
    await prisma.$executeRaw`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hadith_foreign_keys 
      ON "Hadith" ("chapterId", "narratorId", numero)
    `;
    console.log("✅ Foreign keys index created");

    // Update table statistics
    await prisma.$executeRaw`ANALYZE "Hadith"`;
    await prisma.$executeRaw`ANALYZE "Chapter"`;
    await prisma.$executeRaw`ANALYZE "Narrator"`;
    console.log("✅ Table statistics updated");

    console.log("🎉 All search indexes created successfully!");
    console.log("📊 Expected search performance: <300ms for 6000+ hadiths");
  } catch (error) {
    console.error("❌ Error creating search indexes:", error);
    throw error;
  }
}

/**
 * Test search performance
 */
export async function testSearchPerformance(query: string = "allah") {
  console.log(`🧪 Testing search performance for query: "${query}"`);

  const startTime = performance.now();

  try {
    const results = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM "Hadith" h
      WHERE 
        (
          to_tsvector('french', unaccent(h.matn_fr)) @@ plainto_tsquery('french', unaccent(${query}))
        ) OR (
          to_tsvector('simple', REGEXP_REPLACE(h.matn_ar, '[ًٌٍَُِّْٰ]', '', 'g')) @@ plainto_tsquery('simple', ${query})
        )
    `;

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    console.log(`⚡ Search completed in ${executionTime.toFixed(2)}ms`);
    console.log(`📊 Results found:`, results);

    if (executionTime < 300) {
      console.log("🎯 Performance target achieved! (<300ms)");
    } else {
      console.log(
        "⚠️  Performance target not met. Consider running VACUUM ANALYZE."
      );
    }

    return {
      executionTime,
      results,
      performanceTarget: executionTime < 300,
    };
  } catch (error) {
    console.error("❌ Error testing search performance:", error);
    throw error;
  }
}

/**
 * Check if search indexes exist
 */
export async function checkSearchIndexes() {
  try {
    const indexes = await prisma.$queryRaw`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename = 'Hadith' 
      AND indexname LIKE 'idx_hadith_%'
      ORDER BY indexname
    `;

    console.log("📋 Current search indexes:", indexes);
    return indexes;
  } catch (error) {
    console.error("❌ Error checking indexes:", error);
    throw error;
  }
}

// Main execution function
export async function optimizeSearchPerformance() {
  console.log("🔧 Starting search performance optimization...");

  try {
    // Check existing indexes
    await checkSearchIndexes();

    // Create missing indexes
    await createSearchIndexes();

    // Test performance
    await testSearchPerformance();

    console.log("✅ Search optimization completed successfully!");
  } catch (error) {
    console.error("❌ Search optimization failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
