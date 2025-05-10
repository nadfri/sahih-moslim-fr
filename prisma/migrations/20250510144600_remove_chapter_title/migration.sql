/*
  Warnings:

  - You are about to drop the column `title` on the `Chapter` table. All the data in the column will be lost.
  - Made the column `name` on table `Chapter` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chapter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "index" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameArabic" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Chapter" ("createdAt", "id", "index", "name", "nameArabic", "slug", "updatedAt") SELECT "createdAt", "id", "index", "name", "nameArabic", "slug", "updatedAt" FROM "Chapter";
DROP TABLE "Chapter";
ALTER TABLE "new_Chapter" RENAME TO "Chapter";
CREATE UNIQUE INDEX "Chapter_index_key" ON "Chapter"("index");
CREATE UNIQUE INDEX "Chapter_slug_key" ON "Chapter"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
