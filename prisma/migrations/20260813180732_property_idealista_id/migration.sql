-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "description" TEXT,
ADD COLUMN     "idealistaId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Property_idealistaId_key" ON "Property"("idealistaId");
