import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExportSection } from "./ExportSection";

describe("ExportSection", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("affiche le titre, les boutons d'export et les badges de compte", () => {
    // On fournit des props simulant les datas
    const datas = {
      chapters: [
        { id: "1", name_fr: "Chapitre 1", slug: "chapitre-1", hadithCount: 2 },
        { id: "2", name_fr: "Chapitre 2", slug: "chapitre-2", hadithCount: 2 },
        { id: "3", name_fr: "Chapitre 3", slug: "chapitre-3", hadithCount: 2 },
        { id: "4", name_fr: "Chapitre 4", slug: "chapitre-4", hadithCount: 2 },
      ],
      sahabas: [{ id: "1", name_fr: "Sahaba", slug: "sahaba", hadithCount: 1 }],
      transmitters: [
        { id: "1", name_fr: "Trans", slug: "trans", hadithCount: 3 },
      ],
      hadithsCount: 42,
    };
    render(<ExportSection datas={datas} />);
    expect(screen.getByText("Exporter en JSON")).toBeInTheDocument();
    expect(screen.getAllByText("Télécharger").length).toBeGreaterThan(0);
    expect(screen.getByText("Chapitres")).toBeInTheDocument();
    expect(screen.getByText("Compagnons")).toBeInTheDocument();
    expect(screen.getByText("Transmetteurs")).toBeInTheDocument();
    expect(screen.getByText("Hadiths")).toBeInTheDocument();
    // Vérifie la présence des badges de compte
    const ones = screen.getAllByText("1");
    expect(ones.length).toBe(2); // 1 pour sahabas, 1 pour transmitters
    // Affiche le DOM pour debug si le badge attendu n'est pas trouvé
    try {
      expect(screen.getByText("2")).toBeInTheDocument(); // chapters
    } catch (e) {
      console.log(screen.debug());
      throw e;
    }
    expect(screen.getByText("42")).toBeInTheDocument(); // hadithsCount
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

    // On fournit aussi datas pour respecter la signature
    const datas = {
      chapters: [
        { id: "1", name_fr: "Chapitre 1", slug: "chapitre-1", hadithCount: 2 },
        { id: "2", name_fr: "Chapitre 2", slug: "chapitre-2", hadithCount: 2 },
        { id: "3", name_fr: "Chapitre 3", slug: "chapitre-3", hadithCount: 2 },
        { id: "4", name_fr: "Chapitre 4", slug: "chapitre-4", hadithCount: 2 },
      ],
      sahabas: [{ id: "1", name_fr: "Sahaba", slug: "sahaba", hadithCount: 1 }],
      transmitters: [
        { id: "1", name_fr: "Trans", slug: "trans", hadithCount: 3 },
      ],
      hadithsCount: 42,
    };
    render(<ExportSection datas={datas} />);
    const chapitreButton = await screen.findByLabelText("Exporter Chapitres");
    await userEvent.click(chapitreButton);

    expect(fetchSpy).toHaveBeenCalledWith("/api/export/chapters");
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });
});
