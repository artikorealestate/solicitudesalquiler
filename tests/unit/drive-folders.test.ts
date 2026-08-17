import { describe, expect, it } from "vitest";
import {
  applicantFolderName,
  sanitizeFolderName
} from "../../src/lib/google/drive";

describe("nombres de carpeta en Drive", () => {
  describe("sanitizeFolderName", () => {
    it("sustituye las barras, que confunden al leer rutas", () => {
      expect(sanitizeFolderName("Sagunto/Sagunt")).toBe("Sagunto-Sagunt");
      expect(sanitizeFolderName("a\\b")).toBe("a-b");
    });

    it("quita las comillas, que romperian las busquedas de Drive", () => {
      expect(sanitizeFolderName(`Canet d'En Berenguer`)).toBe(
        "Canet dEn Berenguer"
      );
    });

    it("compacta los espacios sobrantes", () => {
      expect(sanitizeFolderName("  Piso   grande  ")).toBe("Piso grande");
    });

    it("conserva tildes y ñ", () => {
      expect(sanitizeFolderName("Ático en Peñíscola")).toBe("Ático en Peñíscola");
    });

    it("recorta los nombres desmesurados", () => {
      expect(sanitizeFolderName("x".repeat(300))).toHaveLength(120);
    });
  });

  describe("applicantFolderName", () => {
    it("pone la fecha delante para que Drive ordene cronologicamente", () => {
      const name = applicantFolderName(
        new Date("2026-08-14T10:30:00Z"),
        "Ana",
        "García López"
      );
      expect(name).toBe("2026-08-14 - Ana García López");
    });

    it("las carpetas de distintos dias se ordenan solas", () => {
      const enero = applicantFolderName(new Date("2026-01-05T00:00:00Z"), "B", "B");
      const marzo = applicantFolderName(new Date("2026-03-05T00:00:00Z"), "A", "A");

      // Orden alfabetico == orden cronologico, que es el objetivo.
      expect([marzo, enero].sort()).toEqual([enero, marzo]);
    });

    it("limpia los nombres problematicos igual que las demas carpetas", () => {
      const name = applicantFolderName(
        new Date("2026-08-14T00:00:00Z"),
        "Jean-Luc",
        "O'Connor"
      );
      expect(name).toBe("2026-08-14 - Jean-Luc OConnor");
    });
  });
});
