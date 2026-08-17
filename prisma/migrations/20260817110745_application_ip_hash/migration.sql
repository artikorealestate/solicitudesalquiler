-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "ipHash" TEXT;

-- CreateIndex
CREATE INDEX "Application_ipHash_submittedAt_idx" ON "Application"("ipHash", "submittedAt");

