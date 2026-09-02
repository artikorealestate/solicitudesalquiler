import type { Prisma } from "@prisma/client";
import { applicationStatuses, type ApplicationStatus } from "./labels";

export type ApplicationSearch = {
  q?: string;
  operacion?: string;
  estado?: string;
  inmueble?: string;
};

/// Traduce los filtros de la barra de busqueda a una condicion de Prisma.
///
/// Vive aparte porque lo usan dos sitios: el listado y la exportacion. Si
/// cada uno tuviera su copia, el Excel acabaria conteniendo filas distintas
/// de las que el usuario ve en pantalla.
export function buildApplicationWhere(
  search: ApplicationSearch,
): Prisma.ApplicationWhereInput {
  const where: Prisma.ApplicationWhereInput = {};

  if (search.operacion === "RENT" || search.operacion === "SALE") {
    where.operation = search.operacion;
  }

  if (
    search.estado &&
    (applicationStatuses as readonly string[]).includes(search.estado)
  ) {
    where.status = search.estado as ApplicationStatus;
  }

  if (search.inmueble) {
    where.propertyId = search.inmueble;
  }

  // Una sola caja para nombre, apellidos, email o telefono: quien atiende una
  // llamada no quiere elegir antes en que campo busca.
  const query = search.q?.trim();
  if (query) {
    where.OR = [
      { firstName: { contains: query, mode: "insensitive" } },
      { lastName: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
      { phone: { contains: query } },
    ];
  }

  return where;
}

/// Reconstruye la cadena de consulta para que el boton de exportar arrastre
/// los filtros que el usuario tiene puestos.
export function searchToQueryString(search: ApplicationSearch): string {
  const params = new URLSearchParams();
  if (search.q) params.set("q", search.q);
  if (search.operacion) params.set("operacion", search.operacion);
  if (search.estado) params.set("estado", search.estado);
  if (search.inmueble) params.set("inmueble", search.inmueble);
  return params.toString();
}
