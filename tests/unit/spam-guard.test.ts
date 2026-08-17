import { beforeAll, describe, expect, it } from "vitest";
import {
  MAX_PER_IP_PER_DAY,
  MAX_PER_IP_PER_HOUR,
  MIN_FILL_SECONDS,
  checkRate,
  checkSubmissionShape,
  clientIpFrom,
  hashIp
} from "../../src/lib/security/spam-guard";

beforeAll(() => {
  process.env.NEXTAUTH_SECRET = "secreto-de-pruebas-suficientemente-largo";
});

function headers(values: Record<string, string>) {
  return { get: (name: string) => values[name.toLowerCase()] ?? null };
}

describe("campo trampa", () => {
  it("deja pasar cuando está vacío", () => {
    const verdict = checkSubmissionShape({ honeypot: "", startedAt: undefined });
    expect(verdict.allow).toBe(true);
  });

  it("deja pasar cuando ni siquiera viene", () => {
    const verdict = checkSubmissionShape({
      honeypot: undefined,
      startedAt: undefined
    });
    expect(verdict.allow).toBe(true);
  });

  it("rechaza cuando viene relleno", () => {
    // Una persona no ve ese campo, así que solo lo rellena un programa.
    const verdict = checkSubmissionShape({
      honeypot: "https://spam.example",
      startedAt: undefined
    });

    expect(verdict.allow).toBe(false);
    if (!verdict.allow) {
      expect(verdict.reason).toBe("honeypot");
      // Al robot se le responde que todo ha ido bien: decirle por qué ha
      // fallado solo le ayuda a afinar el siguiente intento.
      expect(verdict.pretendSuccess).toBe(true);
    }
  });
});

describe("tiempo de relleno", () => {
  const now = 1_000_000_000_000;

  it("rechaza un envío instantáneo", () => {
    const verdict = checkSubmissionShape({
      honeypot: "",
      startedAt: now - 500,
      now
    });

    expect(verdict.allow).toBe(false);
    if (!verdict.allow) expect(verdict.reason).toBe("demasiado-rapido");
  });

  it("deja pasar a quien tarda lo razonable", () => {
    const verdict = checkSubmissionShape({
      honeypot: "",
      startedAt: now - (MIN_FILL_SECONDS + 5) * 1000,
      now
    });

    expect(verdict.allow).toBe(true);
  });

  it("deja pasar a quien se toma su tiempo", () => {
    const verdict = checkSubmissionShape({
      honeypot: "",
      startedAt: now - 45 * 60 * 1000,
      now
    });

    expect(verdict.allow).toBe(true);
  });

  it("rechaza un tiempo del futuro", () => {
    const verdict = checkSubmissionShape({
      honeypot: "",
      startedAt: now + 60_000,
      now
    });

    expect(verdict.allow).toBe(false);
  });

  it("no bloquea si falta la marca de tiempo", () => {
    // Puede ser un navegador con el reloj mal puesto. No es motivo para
    // perder una solicitud real.
    expect(
      checkSubmissionShape({ honeypot: "", startedAt: undefined, now }).allow
    ).toBe(true);
  });
});

describe("límite de envíos", () => {
  it("deja pasar el uso normal", () => {
    expect(checkRate({ lastHour: 2, lastDay: 4 }).allow).toBe(true);
  });

  it("permite a una familia mirar varios pisos en una tarde", () => {
    // Cinco solicitudes seguidas desde la misma casa son plausibles.
    expect(checkRate({ lastHour: 5, lastDay: 5 }).allow).toBe(true);
  });

  it("corta el envío masivo por hora", () => {
    const verdict = checkRate({
      lastHour: MAX_PER_IP_PER_HOUR,
      lastDay: MAX_PER_IP_PER_HOUR
    });

    expect(verdict.allow).toBe(false);
    if (!verdict.allow) {
      expect(verdict.reason).toBe("limite-por-hora");
      // Aquí sí se avisa: puede ser una persona real de una oficina con
      // varios compañeros, y merece saber que espere un rato.
      expect(verdict.pretendSuccess).toBe(false);
    }
  });

  it("corta el goteo diario", () => {
    const verdict = checkRate({ lastHour: 1, lastDay: MAX_PER_IP_PER_DAY });

    expect(verdict.allow).toBe(false);
    if (!verdict.allow) expect(verdict.reason).toBe("limite-diario");
  });
});

describe("dirección de internet", () => {
  it("coge la primera de x-forwarded-for", () => {
    expect(
      clientIpFrom(headers({ "x-forwarded-for": "203.0.113.5, 70.41.3.18" }))
    ).toBe("203.0.113.5");
  });

  it("cae a x-real-ip", () => {
    expect(clientIpFrom(headers({ "x-real-ip": "203.0.113.9" }))).toBe(
      "203.0.113.9"
    );
  });

  it("devuelve null si no hay ninguna", () => {
    expect(clientIpFrom(headers({}))).toBe(null);
  });

  it("nunca guarda la dirección en claro", () => {
    const hash = hashIp("203.0.113.5");

    expect(hash).not.toContain("203.0.113.5");
    expect(hash).toHaveLength(32);
  });

  it("la misma dirección da siempre la misma huella", () => {
    expect(hashIp("203.0.113.5")).toBe(hashIp("203.0.113.5"));
  });

  it("direcciones distintas dan huellas distintas", () => {
    expect(hashIp("203.0.113.5")).not.toBe(hashIp("203.0.113.6"));
  });
});
