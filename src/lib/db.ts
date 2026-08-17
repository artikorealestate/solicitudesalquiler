import { PrismaClient } from "@prisma/client";

// En desarrollo Next.js recarga los modulos en cada cambio; sin este cache
// se abriria una conexion nueva por recarga hasta agotar el pool de Supabase.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
