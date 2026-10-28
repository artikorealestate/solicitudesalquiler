-- Perfiles nuevos, segun lo que piden las aseguradoras de impago.
ALTER TYPE "ApplicantProfile" ADD VALUE 'BUSINESS_OWNER';
ALTER TYPE "ApplicantProfile" ADD VALUE 'FOREIGN_INCOME';
ALTER TYPE "ApplicantProfile" ADD VALUE 'NO_INCOME';

-- Documentacion de cada persona que firma o avala.
ALTER TABLE "DocumentRequest" ADD COLUMN "people" JSONB;
