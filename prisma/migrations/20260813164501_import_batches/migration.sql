-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "syncToken" TEXT;

-- CreateTable
CREATE TABLE "ImportBatch" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'idealista-bookmarklet',
    "payload" JSONB NOT NULL,
    "itemCount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdByEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "ImportBatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImportBatch_status_createdAt_idx" ON "ImportBatch"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_syncToken_key" ON "AdminUser"("syncToken");

-- AddForeignKey
ALTER TABLE "ImportBatch" ADD CONSTRAINT "ImportBatch_createdByEmail_fkey" FOREIGN KEY ("createdByEmail") REFERENCES "AdminUser"("email") ON DELETE CASCADE ON UPDATE CASCADE;

