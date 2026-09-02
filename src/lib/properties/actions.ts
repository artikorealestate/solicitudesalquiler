"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { propertySchema } from "@/lib/properties/schema";

export type FormState = {
  errors?: Record<string, string>;
  message?: string;
};

/// Las acciones de servidor son endpoints publicos: aunque el middleware
/// protege las paginas de /admin, hay que volver a comprobar la sesion aqui.
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("No autorizado");
  }
  return session.user.email;
}

function toObject(formData: FormData) {
  return Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [key, String(value)]),
  );
}

function collectErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export async function saveProperty(
  propertyId: string | null,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = propertySchema.safeParse(toObject(formData));

  if (!parsed.success) {
    return { errors: collectErrors(parsed.error.issues) };
  }

  const data = parsed.data;

  // La referencia identifica la carpeta del inmueble en Drive, asi que dos
  // inmuebles con la misma referencia mezclarian documentacion de clientes
  // distintos.
  const duplicate = await prisma.property.findUnique({
    where: { reference: data.reference },
    select: { id: true },
  });

  if (duplicate && duplicate.id !== propertyId) {
    return {
      errors: { reference: "Ya existe un inmueble con esa referencia" },
    };
  }

  if (propertyId) {
    await prisma.property.update({ where: { id: propertyId }, data });
  } else {
    await prisma.property.create({ data });
  }

  revalidatePath("/admin/inmuebles");
  revalidatePath("/admin");
  redirect("/admin/inmuebles");
}

export async function setPropertyStatus(
  propertyId: string,
  status: "ACTIVE" | "PAUSED" | "ARCHIVED",
) {
  await requireAdmin();

  await prisma.property.update({
    where: { id: propertyId },
    data: { status },
  });

  revalidatePath("/admin/inmuebles");
  revalidatePath("/admin");
}

/// Cambia el estado de todos los inmuebles que estan ahora mismo en un estado
/// concreto.
///
/// Existe porque al sincronizar Idealista entran treinta y pico inmuebles de
/// golpe, y activarlos de uno en uno seria absurdo. Sigue siendo una decision
/// consciente: hay que pulsarlo.
export async function setStatusForAll(
  fromStatus: "ACTIVE" | "PAUSED" | "ARCHIVED",
  toStatus: "ACTIVE" | "PAUSED" | "ARCHIVED",
) {
  const email = await requireAdmin();

  const { count } = await prisma.property.updateMany({
    where: { status: fromStatus },
    data: { status: toStatus },
  });

  console.info(
    `[inmuebles] ${email} paso ${count} inmuebles de ${fromStatus} a ${toStatus}`,
  );

  revalidatePath("/admin/inmuebles");
  revalidatePath("/admin");
}
