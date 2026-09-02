import { z } from "zod";

/// Convierte los campos vacios de un formulario HTML en undefined, para
/// distinguir "no lo ha rellenado" de "lo ha dejado a cero".
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .optional();

const optionalPrice = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .optional()
  .refine(
    (value) => value === undefined || /^\d+$/.test(value.replace(/[.\s]/g, "")),
    { message: "Escribe solo numeros, sin simbolos" },
  )
  .transform((value) =>
    value === undefined ? undefined : Number(value.replace(/[.\s]/g, "")),
  );

export const propertySchema = z
  .object({
    reference: z
      .string()
      .trim()
      .min(1, "La referencia es obligatoria")
      .max(40, "La referencia es demasiado larga"),
    title: z
      .string()
      .trim()
      .min(1, "El titulo es obligatorio")
      .max(160, "El titulo es demasiado largo"),
    operationType: z.enum(["RENT", "SALE", "BOTH"]),
    zone: optionalText,
    address: optionalText,
    rentPrice: optionalPrice,
    salePrice: optionalPrice,
    idealistaUrl: z
      .string()
      .trim()
      .transform((value) => (value === "" ? undefined : value))
      .optional()
      .refine((value) => value === undefined || /^https?:\/\//i.test(value), {
        message: "Debe empezar por http:// o https://",
      }),
    mainImageUrl: optionalText,
    status: z.enum(["ACTIVE", "PAUSED", "ARCHIVED"]),
    internalNotes: optionalText,
  })
  // Un inmueble ofertado en alquiler sin precio de alquiler deja al
  // interesado sin la referencia de solvencia, que es justo lo que el
  // formulario necesita para orientarle.
  .refine(
    (data) => data.operationType !== "RENT" || data.rentPrice !== undefined,
    {
      message: "Un inmueble en alquiler necesita precio de alquiler",
      path: ["rentPrice"],
    },
  )
  .refine(
    (data) => data.operationType !== "SALE" || data.salePrice !== undefined,
    {
      message: "Un inmueble en venta necesita precio de venta",
      path: ["salePrice"],
    },
  )
  .refine(
    (data) =>
      data.operationType !== "BOTH" ||
      (data.rentPrice !== undefined && data.salePrice !== undefined),
    {
      message: "Si se oferta en ambos regimenes hacen falta los dos precios",
      path: ["salePrice"],
    },
  );

export type PropertyInput = z.infer<typeof propertySchema>;

export const operationLabels: Record<string, string> = {
  RENT: "Alquiler",
  SALE: "Venta",
  BOTH: "Alquiler y venta",
};

export const statusLabels: Record<string, string> = {
  ACTIVE: "Activo",
  PAUSED: "Pausado",
  ARCHIVED: "Archivado",
};
