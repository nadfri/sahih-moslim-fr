/*
  Warnings:

  - Made the column `index` on table `Chapter` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chapter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Chapter" ("createdAt", "id", "index", "slug", "title", "updatedAt") SELECT "createdAt", "id", "index", "slug", "title", "updatedAt" FROM "Chapter";
DROP TABLE "Chapter";
ALTER TABLE "new_Chapter" RENAME TO "Chapter";
CREATE UNIQUE INDEX "Chapter_title_key" ON "Chapter"("title");
CREATE UNIQUE INDEX "Chapter_slug_key" ON "Chapter"("slug");
CREATE UNIQUE INDEX "Chapter_index_key" ON "Chapter"("index");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
