-- CreateTable
CREATE TABLE "Hadith" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" INTEGER NOT NULL,
    "matn_fr" TEXT NOT NULL,
    "matn_ar" TEXT NOT NULL,
    "isnad" TEXT,
    "chapterId" TEXT NOT NULL,
    "narratorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Hadith_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Hadith_narratorId_fkey" FOREIGN KEY ("narratorId") REFERENCES "Narrator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Narrator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameArabic" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Sahaba" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameArabic" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_HadithToSahaba" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_HadithToSahaba_A_fkey" FOREIGN KEY ("A") REFERENCES "Hadith" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_HadithToSahaba_B_fkey" FOREIGN KEY ("B") REFERENCES "Sahaba" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Account" ("access_token", "createdAt", "expires_at", "id", "id_token", "provider", "providerAccountId", "refresh_token", "scope", "session_state", "token_type", "type", "updatedAt", "userId") SELECT "access_token", "createdAt", "expires_at", "id", "id_token", "provider", "providerAccountId", "refresh_token", "scope", "session_state", "token_type", "type", "updatedAt", "userId" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Hadith_numero_key" ON "Hadith"("numero");

-- CreateIndex
CREATE INDEX "Hadith_chapterId_idx" ON "Hadith"("chapterId");

-- CreateIndex
CREATE INDEX "Hadith_narratorId_idx" ON "Hadith"("narratorId");

-- CreateIndex
CREATE INDEX "Hadith_numero_idx" ON "Hadith"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_title_key" ON "Chapter"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Narrator_name_key" ON "Narrator"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sahaba_name_key" ON "Sahaba"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_HadithToSahaba_AB_unique" ON "_HadithToSahaba"("A", "B");

-- CreateIndex
CREATE INDEX "_HadithToSahaba_B_index" ON "_HadithToSahaba"("B");
