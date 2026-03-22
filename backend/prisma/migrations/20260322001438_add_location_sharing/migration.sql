-- CreateTable
CREATE TABLE "UserLocation" (
    "userId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLocation_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "LocationShare" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocationShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserLocation_updatedAt_idx" ON "UserLocation"("updatedAt");

-- CreateIndex
CREATE INDEX "LocationShare_ownerId_idx" ON "LocationShare"("ownerId");

-- CreateIndex
CREATE INDEX "LocationShare_viewerId_idx" ON "LocationShare"("viewerId");

-- CreateIndex
CREATE INDEX "LocationShare_isEnabled_idx" ON "LocationShare"("isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "LocationShare_ownerId_viewerId_key" ON "LocationShare"("ownerId", "viewerId");

-- AddForeignKey
ALTER TABLE "UserLocation" ADD CONSTRAINT "UserLocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationShare" ADD CONSTRAINT "LocationShare_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationShare" ADD CONSTRAINT "LocationShare_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
