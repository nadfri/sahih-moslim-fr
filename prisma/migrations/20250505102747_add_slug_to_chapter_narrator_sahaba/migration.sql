/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Narrator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Sahaba` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN "slug" TEXT;

-- AlterTable
ALTER TABLE "Narrator" ADD COLUMN "slug" TEXT;

-- AlterTable
ALTER TABLE "Sahaba" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_slug_key" ON "Chapter"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Narrator_slug_key" ON "Narrator"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Sahaba_slug_key" ON "Sahaba"("slug");
