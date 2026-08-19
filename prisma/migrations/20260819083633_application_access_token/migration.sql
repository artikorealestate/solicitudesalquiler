-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "accessToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Application_accessToken_key" ON "Application"("accessToken");

