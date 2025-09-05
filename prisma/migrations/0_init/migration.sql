-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "public"."profiles" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "image" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Hadith" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "matn_fr" TEXT NOT NULL,
    "matn_ar" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "matn_en" TEXT NOT NULL,

    CONSTRAINT "Hadith_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chapter" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name_en" TEXT,
    "name_fr" TEXT,
    "name_ar" TEXT,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sahaba" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name_en" TEXT,
    "name_fr" TEXT,
    "name_ar" TEXT,

    CONSTRAINT "Sahaba_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transmitter" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name_en" TEXT,
    "name_fr" TEXT,
    "name_ar" TEXT,

    CONSTRAINT "Transmitter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HadithTransmitter" (
    "id" TEXT NOT NULL,
    "hadithId" TEXT NOT NULL,
    "transmitterId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "HadithTransmitter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_HadithToSahaba" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HadithToSahaba_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hadith_numero_key" ON "public"."Hadith"("numero");

-- CreateIndex
CREATE INDEX "idx_hadith_chapterid" ON "public"."Hadith"("chapterId");

-- CreateIndex
CREATE INDEX "idx_hadith_chapterid_numero" ON "public"."Hadith"("chapterId", "numero");

-- CreateIndex
CREATE INDEX "idx_hadith_matn_ar" ON "public"."Hadith"("matn_ar");

-- CreateIndex
CREATE INDEX "idx_hadith_matn_en" ON "public"."Hadith"("matn_en");

-- CreateIndex
CREATE INDEX "idx_hadith_matn_fr" ON "public"."Hadith"("matn_fr");

-- CreateIndex
CREATE INDEX "idx_hadith_numero" ON "public"."Hadith"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_index_key" ON "public"."Chapter"("index");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_slug_key" ON "public"."Chapter"("slug");

-- CreateIndex
CREATE INDEX "idx_chapter_index" ON "public"."Chapter"("index");

-- CreateIndex
CREATE INDEX "idx_chapter_name_ar" ON "public"."Chapter"("name_ar");

-- CreateIndex
CREATE INDEX "idx_chapter_name_en" ON "public"."Chapter"("name_en");

-- CreateIndex
CREATE INDEX "idx_chapter_name_fr" ON "public"."Chapter"("name_fr");

-- CreateIndex
CREATE INDEX "idx_chapter_slug" ON "public"."Chapter"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Sahaba_slug_key" ON "public"."Sahaba"("slug");

-- CreateIndex
CREATE INDEX "idx_sahaba_name_ar" ON "public"."Sahaba"("name_ar");

-- CreateIndex
CREATE INDEX "idx_sahaba_name_en" ON "public"."Sahaba"("name_en");

-- CreateIndex
CREATE INDEX "idx_sahaba_name_fr" ON "public"."Sahaba"("name_fr");

-- CreateIndex
CREATE INDEX "idx_sahaba_slug" ON "public"."Sahaba"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Transmitter_slug_key" ON "public"."Transmitter"("slug");

-- CreateIndex
CREATE INDEX "idx_transmitter_name_ar" ON "public"."Transmitter"("name_ar");

-- CreateIndex
CREATE INDEX "idx_transmitter_name_en" ON "public"."Transmitter"("name_en");

-- CreateIndex
CREATE INDEX "idx_transmitter_name_fr" ON "public"."Transmitter"("name_fr");

-- CreateIndex
CREATE INDEX "idx_transmitter_slug" ON "public"."Transmitter"("slug");

-- CreateIndex
CREATE INDEX "idx_ht_hadithid" ON "public"."HadithTransmitter"("hadithId");

-- CreateIndex
CREATE INDEX "idx_ht_transmitterid" ON "public"."HadithTransmitter"("transmitterId");

-- CreateIndex
CREATE UNIQUE INDEX "HadithTransmitter_hadithId_transmitterId_key" ON "public"."HadithTransmitter"("hadithId", "transmitterId");

-- CreateIndex
CREATE UNIQUE INDEX "HadithTransmitter_hadithId_order_key" ON "public"."HadithTransmitter"("hadithId", "order");

-- CreateIndex
CREATE INDEX "_HadithToSahaba_B_index" ON "public"."_HadithToSahaba"("B");

-- AddForeignKey
ALTER TABLE "public"."Hadith" ADD CONSTRAINT "fk_hadith_chapter" FOREIGN KEY ("chapterId") REFERENCES "public"."Chapter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."HadithTransmitter" ADD CONSTRAINT "fk_ht_hadith" FOREIGN KEY ("hadithId") REFERENCES "public"."Hadith"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."HadithTransmitter" ADD CONSTRAINT "fk_ht_transmitter" FOREIGN KEY ("transmitterId") REFERENCES "public"."Transmitter"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."_HadithToSahaba" ADD CONSTRAINT "_HadithToSahaba_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Hadith"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_HadithToSahaba" ADD CONSTRAINT "_HadithToSahaba_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Sahaba"("id") ON DELETE CASCADE ON UPDATE CASCADE;

