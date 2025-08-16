"use client";

import { useEffect, useState } from "react";

export default function DebugSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/search?filterMode=word&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      console.log("Search response:", data);

      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error || "Search failed");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(handleSearch, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debug Search</h1>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tapez votre recherche..."
          className="w-full p-2 border rounded"
        />
      </div>

      {loading && <div>Chargement...</div>}
      {error && <div className="text-red-500">Erreur: {error}</div>}

      <div className="mb-4">
        <strong>Résultats trouvés: {results.length}</strong>
      </div>

      {results.map((result, index) => (
        <div
          key={result.id || index}
          className="border p-4 mb-2 rounded"
        >
          <div className="font-bold">Hadith #{result.numero}</div>
          <div className="text-sm text-gray-600 mb-2">
            Chapitre: {result.chapter?.name || "N/A"}
          </div>
          <div className="mb-2">{result.matn_fr?.substring(0, 200)}...</div>
          {query && (
            <div className="text-xs text-blue-600">
              Recherche: "{query}" - Trouvé dans le texte
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
