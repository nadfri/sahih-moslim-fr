import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExportSection } from "./ExportSection";

describe("ExportSection", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("affiche le titre et les boutons d'export", () => {
    render(<ExportSection />);
    expect(screen.getByText("Exporter en JSON")).toBeInTheDocument();
    expect(screen.getAllByText("Télécharger").length).toBeGreaterThan(0);
    expect(screen.getByText("Chapitres")).toBeInTheDocument();
    expect(screen.getByText("Compagnons")).toBeInTheDocument();
    expect(screen.getByText("Transmetteurs")).toBeInTheDocument();
    expect(screen.getByText("Hadiths")).toBeInTheDocument();
  });

  it("déclenche un export JSON sur clic", async () => {
    global.URL.createObjectURL = vi.fn(() => "blob-url");
    global.URL.revokeObjectURL = vi.fn();
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob()),
      headers: new Headers(),
    } as Response);
    const appendChildSpy = vi.spyOn(document.body, "appendChild");
    const removeChildSpy = vi.spyOn(document.body, "removeChild");

    render(<ExportSection />);
    const chapitreButton = await screen.findByLabelText("Exporter Chapitres");
    await userEvent.click(chapitreButton);

    expect(fetchSpy).toHaveBeenCalledWith("/api/export/chapters");
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });
});
