import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/prisma/prisma";
import { auth } from "@/src/authentification/auth";
import { POST } from "./route";

// Only mock the auth function
vi.mock("@/src/authentification/auth", () => ({
  auth: vi.fn(),
}));

function createNextRequest(body: unknown) {
  // Create a NextRequest with a JSON body as string
  const jsonString = JSON.stringify(body);
  return new NextRequest("http://localhost:3000/api/hadiths/add", {
    method: "POST",
    body: jsonString,
    headers: { "content-type": "application/json" },
  });
}

describe("POST /api/hadiths/add (integration)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 403 if not admin", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "USER" } });
    const req = createNextRequest({});
    const res = await POST(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/admin access required/i);
  });

  it("returns 400 if invalid data (missing matn_fr)", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "ADMIN" } });
    const req = createNextRequest({
      numero: 123456,
      matn_fr: "",
      matn_ar: "Some Arabic text",
      chapterName: "Test Chapter",
      narratorName: "Test Narrator",
      mentionedSahabasNames: [],
      isnadTransmittersNames: [],
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.errors).toBeDefined();
    expect(json.errors.matn_fr).toBeDefined();
  });

  it("returns 409 if hadith number already exists", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "ADMIN" } });
    // Insert a hadith with numero 9999
    await prisma.hadith.create({
      data: {
        numero: 9999,
        matn_fr: "fr",
        matn_ar: "ar",
        chapter: {
          create: {
            name: "Chapter Exists",
            slug: "chapter-exists",
            index: 1001,
          },
        },
        narrator: {
          create: { name: "Narrator Exists", slug: "narrator-exists" },
        },
      },
    });
    const req = createNextRequest({
      numero: 9999,
      matn_fr: "fr",
      matn_ar: "ar",
      chapterName: "Chapter Exists",
      narratorName: "Narrator Exists",
      mentionedSahabasNames: [],
      isnadTransmittersNames: [],
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/existe déjà/);
    // Clean up
    await prisma.hadith.deleteMany({ where: { numero: 9999 } });
    await prisma.chapter.deleteMany({ where: { name: "Chapter Exists" } });
    await prisma.narrator.deleteMany({ where: { name: "Narrator Exists" } });
  });

  it("returns 400 if chapter not found", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "ADMIN" } });
    const req = createNextRequest({
      numero: 123457,
      matn_fr: "fr",
      matn_ar: "ar",
      chapterName: "Chapter Not Found",
      narratorName: "Narrator Exists",
      mentionedSahabasNames: [],
      isnadTransmittersNames: [],
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/Chapitre/);
  });

  it("returns 400 if narrator not found", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "ADMIN" } });
    // Insert chapter
    const chapter = await prisma.chapter.create({
      data: {
        name: "Chapter For Narrator",
        slug: "chapter-for-narrator",
        index: 1002,
      },
    });
    const req = createNextRequest({
      numero: 123458,
      matn_fr: "fr",
      matn_ar: "ar",
      chapterName: chapter.name,
      narratorName: "Narrator Not Found",
      mentionedSahabasNames: [],
      isnadTransmittersNames: [],
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/Narrateur/);
    // Clean up
    await prisma.chapter.delete({ where: { id: chapter.id } });
  });

  it("returns 400 if some sahabas not found", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "ADMIN" } });
    // Insert chapter and narrator
    const chapter = await prisma.chapter.create({
      data: {
        name: "Chapter For Sahaba",
        slug: "chapter-for-sahaba",
        index: 1003,
      },
    });
    const narrator = await prisma.narrator.create({
      data: { name: "Narrator For Sahaba", slug: "narrator-for-sahaba" },
    });
    // Insert one sahaba only
    await prisma.sahaba.create({ data: { name: "Ali", slug: "ali" } });
    const req = createNextRequest({
      numero: 123459,
      matn_fr: "fr",
      matn_ar: "ar",
      chapterName: chapter.name,
      narratorName: narrator.name,
      mentionedSahabasNames: ["Ali", "Omar"],
      isnadTransmittersNames: [],
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/Sahaba/);
    expect(json.message).toMatch(/Omar/);
    // Clean up
    await prisma.chapter.delete({ where: { id: chapter.id } });
    await prisma.narrator.delete({ where: { id: narrator.id } });
    await prisma.sahaba.deleteMany({
      where: { name: { in: ["Ali", "Omar"] } },
    });
  });

  it("returns 400 if some transmitters not found", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "ADMIN" } });
    // Insert chapter and narrator with unique names
    const chapter = await prisma.chapter.create({
      data: {
        name: "Chapter For Transmitter Test",
        slug: "chapter-for-transmitter-test",
        index: 1006,
      },
    });
    const narrator = await prisma.narrator.create({
      data: {
        name: "Narrator For Transmitter Test",
        slug: "narrator-for-transmitter-test",
      },
    });
    // Insert one transmitter only
    await prisma.transmitter.create({
      data: { name: "Malik Test", slug: "malik-test" },
    });
    const req = createNextRequest({
      numero: 123461,
      matn_fr: "fr",
      matn_ar: "ar",
      chapterName: chapter.name,
      narratorName: narrator.name,
      mentionedSahabasNames: [],
      isnadTransmittersNames: ["Malik Test", "Nafi Test"],
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/Transmetteur/);
    expect(json.message).toMatch(/Nafi Test/);
    // Clean up
    await prisma.chapter.delete({ where: { id: chapter.id } });
    await prisma.narrator.delete({ where: { id: narrator.id } });
    await prisma.transmitter.deleteMany({
      where: { name: { in: ["Malik Test", "Nafi Test"] } },
    });
  });

  it("returns 200 and hadith data on success", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "ADMIN" } });
    // Insert chapter, narrator, sahaba, transmitter with unique names
    const chapter = await prisma.chapter.create({
      data: {
        name: "Chapter Success Test",
        slug: "chapter-success-test",
        index: 1007,
      },
    });
    const narrator = await prisma.narrator.create({
      data: { name: "Narrator Success Test", slug: "narrator-success-test" },
    });
    const sahaba = await prisma.sahaba.create({
      data: { name: "Ali Success Test", slug: "ali-success-test" },
    });
    const transmitter = await prisma.transmitter.create({
      data: { name: "Malik Success Test", slug: "malik-success-test" },
    });
    const req = createNextRequest({
      numero: 123460,
      matn_fr: "fr",
      matn_ar: "ar",
      chapterName: chapter.name,
      narratorName: narrator.name,
      mentionedSahabasNames: ["Ali Success Test"],
      isnadTransmittersNames: ["Malik Success Test"],
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(json.data.numero).toBe(123460);
    // Clean up
    await prisma.hadith.deleteMany({ where: { numero: 123460 } });
    await prisma.chapter.delete({ where: { id: chapter.id } });
    await prisma.narrator.delete({ where: { id: narrator.id } });
    await prisma.sahaba.delete({ where: { id: sahaba.id } });
    await prisma.transmitter.delete({ where: { id: transmitter.id } });
  });
});
