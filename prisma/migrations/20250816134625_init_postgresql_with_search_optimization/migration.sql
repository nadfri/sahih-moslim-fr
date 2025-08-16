-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateTable
CREATE TABLE "Hadith" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "matn_fr" TEXT NOT NULL,
    "matn_ar" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "narratorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hadith_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameArabic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Narrator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameArabic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Narrator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sahaba" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameArabic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sahaba_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transmitter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameArabic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transmitter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HadithTransmitter" (
    "id" TEXT NOT NULL,
    "hadithId" TEXT NOT NULL,
    "transmitterId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "HadithTransmitter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HadithToSahaba" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HadithToSahaba_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "Hadith_numero_key" ON "Hadith"("numero");

-- CreateIndex
CREATE INDEX "Hadith_chapterId_idx" ON "Hadith"("chapterId");

-- CreateIndex
CREATE INDEX "Hadith_narratorId_idx" ON "Hadith"("narratorId");

-- CreateIndex
CREATE INDEX "Hadith_numero_idx" ON "Hadith"("numero");

-- CreateIndex
CREATE INDEX "Hadith_chapterId_numero_idx" ON "Hadith"("chapterId", "numero");

-- CreateIndex
CREATE INDEX "Hadith_narratorId_numero_idx" ON "Hadith"("narratorId", "numero");

-- CreateIndex
CREATE INDEX "Hadith_matn_fr_idx" ON "Hadith"("matn_fr");

-- CreateIndex
CREATE INDEX "Hadith_matn_ar_idx" ON "Hadith"("matn_ar");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_index_key" ON "Chapter"("index");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_name_key" ON "Chapter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_slug_key" ON "Chapter"("slug");

-- CreateIndex
CREATE INDEX "Chapter_name_idx" ON "Chapter"("name");

-- CreateIndex
CREATE INDEX "Chapter_slug_idx" ON "Chapter"("slug");

-- CreateIndex
CREATE INDEX "Chapter_index_idx" ON "Chapter"("index");

-- CreateIndex
CREATE UNIQUE INDEX "Narrator_name_key" ON "Narrator"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Narrator_slug_key" ON "Narrator"("slug");

-- CreateIndex
CREATE INDEX "Narrator_name_idx" ON "Narrator"("name");

-- CreateIndex
CREATE INDEX "Narrator_slug_idx" ON "Narrator"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Sahaba_name_key" ON "Sahaba"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sahaba_slug_key" ON "Sahaba"("slug");

-- CreateIndex
CREATE INDEX "Sahaba_name_idx" ON "Sahaba"("name");

-- CreateIndex
CREATE INDEX "Sahaba_slug_idx" ON "Sahaba"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Transmitter_name_key" ON "Transmitter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Transmitter_slug_key" ON "Transmitter"("slug");

-- CreateIndex
CREATE INDEX "Transmitter_name_idx" ON "Transmitter"("name");

-- CreateIndex
CREATE INDEX "Transmitter_slug_idx" ON "Transmitter"("slug");

-- CreateIndex
CREATE INDEX "HadithTransmitter_hadithId_idx" ON "HadithTransmitter"("hadithId");

-- CreateIndex
CREATE INDEX "HadithTransmitter_transmitterId_idx" ON "HadithTransmitter"("transmitterId");

-- CreateIndex
CREATE UNIQUE INDEX "HadithTransmitter_hadithId_transmitterId_key" ON "HadithTransmitter"("hadithId", "transmitterId");

-- CreateIndex
CREATE UNIQUE INDEX "HadithTransmitter_hadithId_order_key" ON "HadithTransmitter"("hadithId", "order");

-- CreateIndex
CREATE INDEX "_HadithToSahaba_B_index" ON "_HadithToSahaba"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hadith" ADD CONSTRAINT "Hadith_narratorId_fkey" FOREIGN KEY ("narratorId") REFERENCES "Narrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hadith" ADD CONSTRAINT "Hadith_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HadithTransmitter" ADD CONSTRAINT "HadithTransmitter_transmitterId_fkey" FOREIGN KEY ("transmitterId") REFERENCES "Transmitter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HadithTransmitter" ADD CONSTRAINT "HadithTransmitter_hadithId_fkey" FOREIGN KEY ("hadithId") REFERENCES "Hadith"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HadithToSahaba" ADD CONSTRAINT "_HadithToSahaba_A_fkey" FOREIGN KEY ("A") REFERENCES "Hadith"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HadithToSahaba" ADD CONSTRAINT "_HadithToSahaba_B_fkey" FOREIGN KEY ("B") REFERENCES "Sahaba"("id") ON DELETE CASCADE ON UPDATE CASCADE;
