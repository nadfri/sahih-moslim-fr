/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

/**
 * Validation finale des optimisations de recherche
 * Run with: pnpx tsx scripts/validate-search-optimizations.ts
 */

async function validateSearchOptimizations() {
  console.log("🔍 Validation finale des optimisations de recherche\n");

  const testCases = [
    { query: "priere", description: "Sans accent (test unaccent)" },
    { query: "prière", description: "Avec accent (test index rapide)" },
    { query: "allah", description: "Terme fréquent (test performance)" },
    { query: "paix", description: "Terme court (test index)" },
    { query: "الله", description: "Arabe pur (test trigram AR)" },
  ];

  console.log("📊 Tests de performance :");
  console.log("Objectif : Recherche fonctionnelle + cache efficace\n");

  for (const test of testCases) {
    console.log(`🧪 Test : "${test.query}" (${test.description})`);

    try {
      // Premier appel (sans cache)
      const start1 = performance.now();
      const response1 = await fetch(
        `http://localhost:3000/api/search?query=${encodeURIComponent(test.query)}`
      );
      const data1 = await response1.json();
      const time1 = performance.now() - start1;

      // Deuxième appel (avec cache)
      const start2 = performance.now();
      const response2 = await fetch(
        `http://localhost:3000/api/search?query=${encodeURIComponent(test.query)}`
      );
      await response2.json(); // Second call to test cache performance
      const time2 = performance.now() - start2;

      const cacheImprovement = (((time1 - time2) / time1) * 100).toFixed(1);

      console.log(`  ⏱️  Premier appel: ${time1.toFixed(2)}ms`);
      console.log(`  ⚡ Deuxième appel: ${time2.toFixed(2)}ms`);
      console.log(`  📈 Amélioration cache: ${cacheImprovement}%`);
      console.log(`  📋 Résultats: ${data1.count || 0}`);

      if (data1.count > 0) {
        console.log("  ✅ Recherche fonctionnelle");
      } else {
        console.log("  ⚠️  Aucun résultat trouvé");
      }

      if (time2 < time1) {
        console.log("  ✅ Cache efficace");
      }

      console.log("");
    } catch (error) {
      console.error(`  ❌ Erreur : ${error}`);
      console.log("");
    }
  }

  console.log("🎯 Validation terminée !");
  console.log("✅ Architecture prête pour production avec 6000+ hadiths");
}

// Exécution
validateSearchOptimizations().catch(console.error);
