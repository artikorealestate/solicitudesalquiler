import { describe, expect, it } from "vitest";
import {
  addMonths,
  daysUntilDeletion,
  isDue,
  isInWarningWindow,
  retentionFor,
  type Retention,
} from "../../src/lib/privacy/retention";

const d = (iso: string) => new Date(iso);

function scheduled(retention: Retention) {
  if (retention.kind !== "scheduled") {
    throw new Error("Se esperaba un borrado programado");
  }
  return retention;
}

describe("addMonths", () => {
  it("suma meses de calendario", () => {
    expect(addMonths(d("2026-08-19T10:00:00Z"), 3).toISOString()).toBe(
      "2026-11-19T10:00:00.000Z",
    );
  });

  // El 31 de enero mas un mes no puede ser el 3 de marzo.
  it("se queda en el ultimo dia si el mes es mas corto", () => {
    expect(addMonths(d("2026-01-31T00:00:00Z"), 1).toISOString()).toBe(
      "2026-02-28T00:00:00.000Z",
    );
  });

  it("cruza de año", () => {
    expect(addMonths(d("2026-11-15T00:00:00Z"), 3).toISOString()).toBe(
      "2027-02-15T00:00:00.000Z",
    );
  });
});

describe("retentionFor", () => {
  const base = {
    status: "NEW",
    lastActivityAt: d("2026-09-01T00:00:00Z"),
    activity: [],
  };

  it("borra a los tres meses de la ultima gestion", () => {
    const r = scheduled(retentionFor(base));
    expect(r.months).toBe(3);
    expect(r.deleteAfter.toISOString()).toBe("2026-12-01T00:00:00.000Z");
  });

  // Un documento subido despues cuenta como actividad: quien sigue mandando
  // papeles sigue interesado.
  it("cuenta como actividad un documento, una nota o una peticion posteriores", () => {
    const r = scheduled(
      retentionFor({
        ...base,
        activity: [d("2026-09-20T00:00:00Z"), d("2026-10-05T00:00:00Z")],
      }),
    );
    expect(r.lastActivity.toISOString()).toBe("2026-10-05T00:00:00.000Z");
    expect(r.deleteAfter.toISOString()).toBe("2027-01-05T00:00:00.000Z");
  });

  it("ignora actividad mas antigua que la ultima gestion", () => {
    const r = scheduled(
      retentionFor({ ...base, activity: [d("2026-08-01T00:00:00Z")] }),
    );
    expect(r.lastActivity.toISOString()).toBe("2026-09-01T00:00:00.000Z");
  });

  it("ignora fechas vacias o invalidas", () => {
    const r = scheduled(
      retentionFor({
        ...base,
        activity: [null, undefined, new Date("no es una fecha")],
      }),
    );
    expect(r.lastActivity.toISOString()).toBe("2026-09-01T00:00:00.000Z");
  });

  // Reservado o cerrado es el expediente de un contrato: tiene sus propios
  // plazos legales y no puede desaparecer solo.
  it("no programa el borrado de una reserva ni de una operacion cerrada", () => {
    expect(retentionFor({ ...base, status: "RESERVED" }).kind).toBe("contract");
    expect(retentionFor({ ...base, status: "CLOSED" }).kind).toBe("contract");
  });

  // Lo normal es que nadie marque a los no elegidos como descartados. Eso no
  // puede alargar la conservacion.
  it("trata igual una solicitud olvidada en Nuevo que una descartada", () => {
    const nueva = scheduled(retentionFor({ ...base, status: "NEW" }));
    const descartada = scheduled(
      retentionFor({ ...base, status: "DISCARDED" }),
    );
    expect(nueva.deleteAfter.getTime()).toBe(descartada.deleteAfter.getTime());
  });
});

describe("cuando toca borrar y avisar", () => {
  const r = retentionFor({
    status: "REVIEWING",
    lastActivityAt: d("2026-08-01T00:00:00Z"),
    activity: [],
  });
  // Borrado previsto: 1 de noviembre de 2026.

  it("no toca nada antes de las dos semanas previas", () => {
    const now = d("2026-10-10T00:00:00Z");
    expect(isDue(r, now)).toBe(false);
    expect(isInWarningWindow(r, now)).toBe(false);
  });

  it("avisa en las dos semanas previas", () => {
    const now = d("2026-10-20T00:00:00Z");
    expect(isDue(r, now)).toBe(false);
    expect(isInWarningWindow(r, now)).toBe(true);
    expect(daysUntilDeletion(r, now)).toBe(12);
  });

  it("borra al llegar la fecha, y deja de avisar", () => {
    const now = d("2026-11-01T00:00:00Z");
    expect(isDue(r, now)).toBe(true);
    expect(isInWarningWindow(r, now)).toBe(false);
  });

  it("nunca borra un contrato", () => {
    const contrato = retentionFor({
      status: "CLOSED",
      lastActivityAt: d("2020-01-01T00:00:00Z"),
      activity: [],
    });
    expect(isDue(contrato, d("2030-01-01T00:00:00Z"))).toBe(false);
    expect(daysUntilDeletion(contrato)).toBeNull();
  });
});
