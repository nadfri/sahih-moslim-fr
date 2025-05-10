/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN "name" TEXT;
ALTER TABLE "Chapter" ADD COLUMN "nameArabic" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_name_key" ON "Chapter"("name");
