/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

/**
 * Test script for search performance
 * Run with: npx tsx scripts/test-search-performance.ts
 */

async function testSearchAPI() {
  const testQueries = ["allah", "prophète", "prière", "الله", "صلاة"];

  console.log("🧪 Testing search API performance...\n");

  for (const query of testQueries) {
    const startTime = performance.now();

    try {
      const response = await fetch(
        `http://localhost:3000/api/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      const status = executionTime < 300 ? "🎯" : "⚠️";

      console.log(`${status} Query: "${query}"`);
      console.log(`   Time: ${executionTime.toFixed(2)}ms`);
      console.log(`   Results: ${data.count || 0}`);
      console.log(`   Status: ${response.status}\n`);
    } catch (error) {
      console.error(`❌ Error testing query "${query}":`, error);
    }
  }
}

// Run the test
testSearchAPI().catch(console.error);
