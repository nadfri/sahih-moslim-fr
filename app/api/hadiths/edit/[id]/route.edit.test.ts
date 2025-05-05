import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/prisma/prisma";
import { auth } from "@/src/authentification/auth";
import { PATCH } from "./route";

// Only mock the auth function
vi.mock("@/src/authentification/auth", () => ({
  auth: vi.fn(),
}));

function createParams(id: string) {
  // Next.js 15: params is a Promise
  return Promise.resolve({ id });
}

function createNextRequest(body: unknown) {
  const jsonString = JSON.stringify(body);
  return new NextRequest("http://localhost:3000/api/hadiths/edit/any", {
    method: "PATCH",
    body: jsonString,
    headers: { "content-type": "application/json" },
  });
}

describe("PATCH /api/hadiths/edit/[id] (integration)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 403 if not admin", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "USER" } });
    const req = createNextRequest({});

    const res = await PATCH(req, { params: createParams("any") });
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/admin access required/i);
  });

  it("returns 400 if id is missing", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "ADMIN" } });
    const req = createNextRequest({});

    const res = await PATCH(req, {
      params: Promise.resolve({ id: undefined }) as unknown as Promise<{
        id: string;
      }>,
    });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toMatch(/Données invalides/i);
  });

  it("returns 400 if invalid data", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "ADMIN" } });
    const req = createNextRequest({ matn_fr: "" }); // missing required fields
    const res = await PATCH(req, { params: createParams("any") });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.errors).toBeDefined();
  });

  it("returns 404 if hadith not found", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "ADMIN" } });
    const req = createNextRequest({
      numero: 999999,
      matn_fr: "fr",
      matn_ar: "ar",
      chapterTitle: "Edit Chapter",
      narratorName: "Edit Narrator",
      mentionedSahabasNames: [],
    });
    const res = await PATCH(req, { params: createParams("doesnotexistid") });
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/Hadith non trouvé/i);
  });

  it("edits a hadith successfully", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "ADMIN" } });
    // Clean up before creating to avoid unique constraint error
    await prisma.hadith.deleteMany({ where: { numero: 123456 } });
    await prisma.chapter.deleteMany({ where: { slug: "edit-chapter" } });
    await prisma.narrator.deleteMany({ where: { slug: "edit-narrator" } });
    await prisma.sahaba.deleteMany({ where: { slug: "edit-sahaba" } });

    // Create chapter, narrator, sahaba, and hadith
    const chapter = await prisma.chapter.create({
      data: { title: "Edit Chapter", slug: "edit-chapter" },
    });
    const narrator = await prisma.narrator.create({
      data: { name: "Edit Narrator", slug: "edit-narrator" },
    });
    const sahaba = await prisma.sahaba.create({
      data: { name: "Edit Sahaba", slug: "edit-sahaba" },
    });
    const hadith = await prisma.hadith.create({
      data: {
        numero: 123456,
        matn_fr: "old fr",
        matn_ar: "old ar",
        isnad: null,
        chapter: { connect: { id: chapter.id } },
        narrator: { connect: { id: narrator.id } },
        mentionedSahabas: { connect: [{ id: sahaba.id }] },
      },
    });

    const req = createNextRequest({
      numero: 654321,
      matn_fr: "new fr",
      matn_ar: "new ar",
      chapterTitle: chapter.title,
      narratorName: narrator.name,
      mentionedSahabasNames: [sahaba.name],
    });
    const res = await PATCH(req, { params: createParams(hadith.id) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.numero).toBe(654321);
    expect(json.data.matn_fr).toBe("new fr");
    // Clean up
    await prisma.hadith.delete({ where: { id: hadith.id } });
    await prisma.chapter.delete({ where: { id: chapter.id } });
    await prisma.narrator.delete({ where: { id: narrator.id } });
    await prisma.sahaba.delete({ where: { id: sahaba.id } });
  });
});
