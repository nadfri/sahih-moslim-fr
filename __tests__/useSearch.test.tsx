import { render, screen, waitFor } from "@testing-library/react";
// using real timers in tests to avoid act(...) environment issues
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { useSearch, type UseSearchProps } from "@/src/hooks/useSearch";
import type { HadithType } from "@/src/types/types";

function TestConsumer(props: UseSearchProps) {
  const { results, isLoading, hasSearched, error } = useSearch(props);

  return (
    <div>
      <div data-testid="loading">{String(isLoading)}</div>
      <div data-testid="hasSearched">{String(hasSearched)}</div>
      <div data-testid="error">{String(error)}</div>
      <ul data-testid="results">
        {results.map((r: HadithType) => (
          <li key={r.id ?? String(r.numero)}>
            {r.matn_fr ?? String(r.numero)}
          </li>
        ))}
      </ul>
    </div>
  );
}

describe("useSearch (smoke)", () => {
  beforeEach(() => {
    // ensure real timers so React effects run normally in JSDOM
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not call fetch when criteria are missing", async () => {
    const fetchSpy = vi.fn();
    // test env stub
    vi.stubGlobal("fetch", fetchSpy);

    render(
      <TestConsumer
        filterMode="word"
        query="ab"
        sahabas={[]}
        transmitters={[]}
        numero=""
      />
    );

    // wait beyond debounce to allow the hook to run
    await new Promise((r) => setTimeout(r, 500));

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("calls fetch and exposes results when criteria met", async () => {
    const mockResponse = {
      success: true,
      results: [{ id: "r1", numero: 1, matn_fr: "hello" }],
      count: 1,
      hasMore: false,
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValue({ json: async () => mockResponse });

    // test env stub
    vi.stubGlobal("fetch", fetchMock);

    render(
      <TestConsumer
        filterMode="word"
        query="hello"
        sahabas={[]}
        transmitters={[]}
        numero=""
      />
    );

    // wait beyond debounce to allow the hook to call fetch
    await new Promise((r) => setTimeout(r, 400));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    const list = screen.getByTestId("results");
    expect(list.textContent).toContain("hello");
    expect(screen.getByTestId("hasSearched").textContent).toBe("true");
  });
});
