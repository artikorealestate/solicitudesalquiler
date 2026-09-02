import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import {
  issueUploadTicket,
  verifyUploadTicket,
} from "../../src/lib/applications/upload-ticket";

beforeAll(() => {
  process.env.NEXTAUTH_SECRET = "secreto-de-pruebas-suficientemente-largo";
});

afterEach(() => {
  vi.useRealTimers();
});

/// El formulario publico es anonimo. Sin este billete, cualquiera que
/// adivinase el identificador de una solicitud podria colgar archivos en la
/// carpeta de Drive de otra persona.
describe("billete de subida", () => {
  const applicationId = "cly1234567890abcdef";

  it("acepta un billete recien emitido para su solicitud", () => {
    const ticket = issueUploadTicket(applicationId);
    expect(verifyUploadTicket(ticket, applicationId)).toBe(true);
  });

  it("rechaza el billete de OTRA solicitud", () => {
    const ticket = issueUploadTicket(applicationId);
    expect(verifyUploadTicket(ticket, "otra-solicitud-distinta")).toBe(false);
  });

  it("rechaza un billete con la firma manipulada", () => {
    const ticket = issueUploadTicket(applicationId);
    const [id, expires] = ticket.split(".");
    const forged = `${id}.${expires}.firmaInventadaPorUnAtacante`;

    expect(verifyUploadTicket(forged, applicationId)).toBe(false);
  });

  it("rechaza un billete al que le han estirado la caducidad", () => {
    const ticket = issueUploadTicket(applicationId);
    const [id, , signature] = ticket.split(".");
    const extended = `${id}.${Date.now() + 999_999_999}.${signature}`;

    // La caducidad forma parte de lo firmado, asi que cambiarla invalida
    // la firma.
    expect(verifyUploadTicket(extended, applicationId)).toBe(false);
  });

  it("caduca a los 30 minutos", () => {
    const ticket = issueUploadTicket(applicationId);

    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 29 * 60 * 1000);
    expect(verifyUploadTicket(ticket, applicationId)).toBe(true);

    vi.setSystemTime(Date.now() + 2 * 60 * 1000);
    expect(verifyUploadTicket(ticket, applicationId)).toBe(false);
  });

  it("rechaza basura sin forma de billete", () => {
    expect(verifyUploadTicket("", applicationId)).toBe(false);
    expect(verifyUploadTicket("solo-un-trozo", applicationId)).toBe(false);
    expect(verifyUploadTicket("a.b", applicationId)).toBe(false);
    expect(verifyUploadTicket("a.b.c.d", applicationId)).toBe(false);
  });

  it("rechaza una caducidad que no es un numero", () => {
    expect(
      verifyUploadTicket(`${applicationId}.manana.loquesea`, applicationId),
    ).toBe(false);
  });
});
