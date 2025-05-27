import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/prisma/prisma";
import { auth } from "@/src/authentification/auth";
import { DELETE } from "./route";

// Only mock the auth function
vi.mock("@/src/authentification/auth", () => ({
  auth: vi.fn(),
}));

function createParams(id: string) {
  // Simulate Next.js 15 promised params
  return Promise.resolve({ id });
}

describe("DELETE /api/hadiths/delete/[id] (integration)", () => {
  // Track created entities for cleanup
  const createdEntities: {
    chapters: string[];
    narrators: string[];
    hadiths: string[];
  } = {
    chapters: [],
    narrators: [],
    hadiths: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    // Clean up all created entities in correct order (dependencies first)
    if (createdEntities.hadiths.length > 0) {
      await prisma.hadith.deleteMany({
        where: { id: { in: createdEntities.hadiths } },
      });
      createdEntities.hadiths = [];
    }

    if (createdEntities.narrators.length > 0) {
      await prisma.narrator.deleteMany({
        where: { id: { in: createdEntities.narrators } },
      });
      createdEntities.narrators = [];
    }

    if (createdEntities.chapters.length > 0) {
      await prisma.chapter.deleteMany({
        where: { id: { in: createdEntities.chapters } },
      });
      createdEntities.chapters = [];
    }
  });

  it("deletes a hadith if admin and id exists", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "ADMIN" } });
    // Create chapter and narrator for the hadith with unique names
    const timestamp = Date.now();
    const uniqueId = timestamp % 1000000; // Keep it within INT range
    const chapter = await prisma.chapter.create({
      data: {
        name: `Delete Chapter ${timestamp}`,
        slug: `delete-chapter-${timestamp}`,
        index: 9999 + uniqueId,
      },
    });
    createdEntities.chapters.push(chapter.id);

    const narrator = await prisma.narrator.create({
      data: {
        name: `Delete Narrator ${timestamp}`,
        slug: `delete-narrator-${timestamp}`,
      },
    });
    createdEntities.narrators.push(narrator.id);

    // Create a hadith to delete
    const hadith = await prisma.hadith.create({
      data: {
        numero: 8888 + uniqueId,
        matn_fr: "fr",
        matn_ar: "ar",
        chapter: { connect: { id: chapter.id } },
        narrator: { connect: { id: narrator.id } },
      },
    });
    // Note: hadith will be deleted by the DELETE endpoint, no need to track it

    const req = new NextRequest(
      `http://localhost:3000/api/hadiths/delete/${hadith.id}`,
      { method: "DELETE" }
    );
    const res = await DELETE(req, { params: createParams(hadith.id) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toMatch(/deleted successfully/i);
    // Check that hadith is deleted
    const deleted = await prisma.hadith.findUnique({
      where: { id: hadith.id },
    });
    expect(deleted).toBeNull();
  });

  it("returns 403 if not admin", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "USER" } });
    const req = new NextRequest("http://localhost:3000/api/hadiths/delete/1", {
      method: "DELETE",
    });
    const res = await DELETE(req, { params: createParams("1") });
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/admin access required/i);
  });

  it("returns 400 if id is missing", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "ADMIN" } });
    const req = new NextRequest("http://localhost:3000/api/hadiths/delete/", {
      method: "DELETE",
    });
    // @ts-expect-error: simulate missing id
    const res = await DELETE(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toMatch(/missing hadith id/i);
  });

  it("returns 500 if hadith does not exist", async () => {
    (
      auth as unknown as { mockResolvedValue: (v: unknown) => void }
    ).mockResolvedValue({ user: { role: "ADMIN" } });
    const req = new NextRequest(
      "http://localhost:3000/api/hadiths/delete/doesnotexist",
      { method: "DELETE" }
    );
    const res = await DELETE(req, { params: createParams("doesnotexist") });
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toMatch(/error deleting hadith/i);
  });
});
