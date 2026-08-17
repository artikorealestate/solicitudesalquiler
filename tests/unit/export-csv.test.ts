import { describe, expect, it } from "vitest";
import {
  buildApplicationsCsv,
  type ExportableApplication
} from "../../src/lib/applications/export-csv";

function application(
  overrides: Partial<ExportableApplication> = {}
): ExportableApplication {
  return {
    submittedAt: new Date(2026, 7, 14, 9, 5),
    status: "NEW",
    operation: "RENT",
    locale: "es",
    firstName: "Ana",
    lastName: "García López",
    email: "ana@example.com",
    phone: "600123456",
    nationality: "Española",
    idDocument: "12345678A",
    comment: null,
    answers: { householdSize: "2", provableIncome: "yes", monthlyIncome: "5200" },
    driveFolderUrl: "https://drive.google.com/drive/folders/abc",
    documentCount: 3,
    property: {
      reference: "195",
      title: "Piso en Calle de la Flor del Taronger",
      zone: "Canet d'En Berenguer"
    },
    ...overrides
  };
}

function lines(csv: string): string[] {
  return csv.replace(/^﻿/, "").trim().split("\r\n");
}

describe("exportacion a CSV", () => {
  it("empieza con la marca BOM para que Excel lea bien las tildes", () => {
    // Sin ella, "García" sale como "GarcÃ­a".
    expect(buildApplicationsCsv([application()]).startsWith("﻿")).toBe(true);
  });

  it("separa con punto y coma, no con coma", () => {
    // El Excel en espanol usa la coma como separador decimal: un CSV con
    // comas se abriria todo en una sola columna.
    const [header] = lines(buildApplicationsCsv([]));
    expect(header).toContain("Fecha;Estado;Operacion");
    expect(header.split(";").length).toBeGreaterThan(20);
  });

  it("escribe una fila por solicitud", () => {
    const csv = buildApplicationsCsv([application(), application()]);
    expect(lines(csv)).toHaveLength(3); // cabecera + 2
  });

  it("traduce estados y respuestas codificadas", () => {
    const csv = buildApplicationsCsv([application()]);
    const [, row] = lines(csv);

    expect(row).toContain("Nuevo");
    expect(row).toContain("Alquiler");
    expect(row).toContain("Si"); // provableIncome: "yes"
  });

  it("entrecomilla los valores que llevan punto y coma o salto de linea", () => {
    const csv = buildApplicationsCsv([
      application({ comment: "Primero; segundo\nTercero" })
    ]);
    expect(csv).toContain('"Primero; segundo\nTercero"');
  });

  it("duplica las comillas dentro de un valor", () => {
    const csv = buildApplicationsCsv([application({ comment: 'Dijo "hola"' })]);
    expect(csv).toContain('"Dijo ""hola"""');
  });

  it("neutraliza los valores que Excel interpretaria como formula", () => {
    // Un telefono guardado como "+34600123456" se ejecutaria como formula.
    const csv = buildApplicationsCsv([
      application({ phone: "+34600123456" })
    ]);
    expect(csv).toContain("'+34600123456");
  });

  it("no mezcla las respuestas de alquiler con las de compra", () => {
    const csv = buildApplicationsCsv([
      application({
        operation: "SALE",
        answers: { buyerProfile: "Pareja joven", needsFinancing: "yes" }
      })
    ]);
    const [header, row] = lines(csv);

    const columns = header.split(";");
    const values = row.split(";");
    const rentColumn = columns.findIndex((c) => c.startsWith("Alquiler:"));
    const saleColumn = columns.findIndex((c) =>
      c.startsWith("Compra: Quien compra")
    );

    // Las columnas de alquiler quedan vacias en una solicitud de compra.
    expect(values[rentColumn]).toBe("");
    expect(values[saleColumn]).toBe("Pareja joven");
  });

  it("escribe la fecha en formato espanol", () => {
    const csv = buildApplicationsCsv([
      application({ submittedAt: new Date(2026, 7, 14, 9, 5) })
    ]);
    expect(csv).toContain("14/08/2026 09:05");
  });

  it("genera solo la cabecera cuando no hay solicitudes", () => {
    expect(lines(buildApplicationsCsv([]))).toHaveLength(1);
  });
});
