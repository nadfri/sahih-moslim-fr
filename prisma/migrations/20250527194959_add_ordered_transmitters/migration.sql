-- CreateTable
CREATE TABLE "HadithTransmitter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hadithId" TEXT NOT NULL,
    "transmitterId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "HadithTransmitter_hadithId_fkey" FOREIGN KEY ("hadithId") REFERENCES "Hadith" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HadithTransmitter_transmitterId_fkey" FOREIGN KEY ("transmitterId") REFERENCES "Transmitter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "HadithTransmitter_hadithId_transmitterId_key" ON "HadithTransmitter"("hadithId", "transmitterId");

-- CreateIndex
CREATE UNIQUE INDEX "HadithTransmitter_hadithId_order_key" ON "HadithTransmitter"("hadithId", "order");

-- CreateIndex
CREATE INDEX "HadithTransmitter_hadithId_idx" ON "HadithTransmitter"("hadithId");

-- CreateIndex
CREATE INDEX "HadithTransmitter_transmitterId_idx" ON "HadithTransmitter"("transmitterId");
