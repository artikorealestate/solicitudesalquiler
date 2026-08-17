import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";

/// Emails autorizados por variable de entorno. Es la lista de arranque: sirve
/// para poder entrar la primera vez, cuando la tabla AdminUser aun esta vacia.
function seedAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/// Un email puede entrar si esta en ADMIN_EMAILS o si tiene una ficha activa
/// en AdminUser. Lo segundo permite dar y quitar accesos desde el panel sin
/// volver a desplegar la aplicacion.
export async function isAuthorizedAdmin(email: string): Promise<boolean> {
  const normalized = email.toLowerCase();

  if (seedAdminEmails().includes(normalized)) return true;

  const admin = await prisma.adminUser.findUnique({
    where: { email: normalized },
    select: { active: true }
  });

  return admin?.active === true;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],

  // Sin adaptador de base de datos: la sesion viaja en una cookie firmada.
  // El panel solo lo usan unos pocos administradores, no necesitamos
  // persistir sesiones ni cuentas.
  //
  // Un dia de duracion, no una semana: el panel da acceso a DNIs, nominas y
  // datos de contacto de clientes. Un portatil olvidado en una cafeteria
  // deja de ser un problema al dia siguiente, y volver a entrar es un clic
  // porque Google recuerda la cuenta.
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },

  pages: {
    signIn: "/admin/login",
    error: "/admin/login"
  },

  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;

      if (!(await isAuthorizedAdmin(email))) {
        // NextAuth traduce esto a ?error=AccessDenied en la pagina de login.
        return false;
      }

      // Dejamos constancia del acceso y damos de alta la ficha la primera vez
      // que entra alguien de la lista de ADMIN_EMAILS.
      await prisma.adminUser.upsert({
        where: { email },
        create: { email, name: user.name ?? null, lastLogin: new Date() },
        update: { name: user.name ?? undefined, lastLogin: new Date() }
      });

      return true;
    },

    async session({ session }) {
      return session;
    }
  }
};
