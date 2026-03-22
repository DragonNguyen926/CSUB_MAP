-- CreateTable
CREATE TABLE "LocationViewPreference" (
    "id" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocationViewPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LocationViewPreference_viewerId_idx" ON "LocationViewPreference"("viewerId");

-- CreateIndex
CREATE INDEX "LocationViewPreference_targetId_idx" ON "LocationViewPreference"("targetId");

-- CreateIndex
CREATE UNIQUE INDEX "LocationViewPreference_viewerId_targetId_key" ON "LocationViewPreference"("viewerId", "targetId");

-- AddForeignKey
ALTER TABLE "LocationViewPreference" ADD CONSTRAINT "LocationViewPreference_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationViewPreference" ADD CONSTRAINT "LocationViewPreference_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
