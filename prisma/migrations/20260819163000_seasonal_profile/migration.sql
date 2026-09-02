-- Perfil de temporada: a quien viene unos meses no se le pide
-- documentacion de solvencia, asi que necesita su propio perfil en las
-- peticiones de documentacion.
ALTER TYPE "ApplicantProfile" ADD VALUE IF NOT EXISTS 'SEASONAL';
