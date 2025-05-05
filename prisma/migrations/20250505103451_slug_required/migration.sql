/*
  Warnings:

  - Made the column `slug` on table `Chapter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `Narrator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `Sahaba` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chapter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Chapter" ("createdAt", "id", "slug", "title", "updatedAt") SELECT "createdAt", "id", "slug", "title", "updatedAt" FROM "Chapter";
DROP TABLE "Chapter";
ALTER TABLE "new_Chapter" RENAME TO "Chapter";
CREATE UNIQUE INDEX "Chapter_title_key" ON "Chapter"("title");
CREATE UNIQUE INDEX "Chapter_slug_key" ON "Chapter"("slug");
CREATE TABLE "new_Narrator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameArabic" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Narrator" ("createdAt", "id", "name", "nameArabic", "slug", "updatedAt") SELECT "createdAt", "id", "name", "nameArabic", "slug", "updatedAt" FROM "Narrator";
DROP TABLE "Narrator";
ALTER TABLE "new_Narrator" RENAME TO "Narrator";
CREATE UNIQUE INDEX "Narrator_name_key" ON "Narrator"("name");
CREATE UNIQUE INDEX "Narrator_slug_key" ON "Narrator"("slug");
CREATE TABLE "new_Sahaba" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameArabic" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Sahaba" ("createdAt", "id", "name", "nameArabic", "slug", "updatedAt") SELECT "createdAt", "id", "name", "nameArabic", "slug", "updatedAt" FROM "Sahaba";
DROP TABLE "Sahaba";
ALTER TABLE "new_Sahaba" RENAME TO "Sahaba";
CREATE UNIQUE INDEX "Sahaba_name_key" ON "Sahaba"("name");
CREATE UNIQUE INDEX "Sahaba_slug_key" ON "Sahaba"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
