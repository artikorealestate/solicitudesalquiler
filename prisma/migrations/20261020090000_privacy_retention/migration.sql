-- Proteccion de datos: informacion en lugar de consentimiento obligatorio,
-- bolsa de candidatos opcional y borrado automatico por plazo.

-- Nuevos registros legales. Los antiguos (GDPR, OWNER_SHARING) se conservan
-- para las solicitudes que ya los tienen.
ALTER TYPE "ConsentType" ADD VALUE IF NOT EXISTS 'PRIVACY_NOTICE';
ALTER TYPE "ConsentType" ADD VALUE IF NOT EXISTS 'CANDIDATE_POOL';

CREATE TYPE "DeletionReason" AS ENUM ('RETENTION', 'MANUAL');

-- Punto de partida del plazo de conservacion y bolsa de candidatos.
ALTER TABLE "Application" ADD COLUMN "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Application" ADD COLUMN "candidatePool" BOOLEAN NOT NULL DEFAULT false;

-- Las solicitudes que ya existen arrancan desde su ultima modificacion real,
-- no desde hoy: si no, todas ganarian tres meses de mas sin motivo.
UPDATE "Application" SET "lastActivityAt" = "updatedAt";

CREATE INDEX "Application_lastActivityAt_idx" ON "Application"("lastActivityAt");

CREATE TABLE "RetentionWarning" (
    "applicationId" TEXT NOT NULL,
    "deleteAfter" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RetentionWarning_pkey" PRIMARY KEY ("applicationId")
);

ALTER TABLE "RetentionWarning" ADD CONSTRAINT "RetentionWarning_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "DeletionLog" (
    "id" TEXT NOT NULL,
    "reason" "DeletionReason" NOT NULL,
    "operation" "ApplicationOperation" NOT NULL,
    "propertyReference" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL,
    "lastActivityAt" TIMESTAMP(3),
    "documentCount" INTEGER NOT NULL,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeletionLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DeletionLog_deletedAt_idx" ON "DeletionLog"("deletedAt");
