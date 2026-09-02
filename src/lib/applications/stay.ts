/// La estancia que pide el interesado, en una sola linea legible.
///
/// Buena parte del alquiler de Artiko esta en la costa y es de temporada, asi
/// que "del 1 al 31 de agosto" es la primera pregunta que se hace cualquiera
/// al abrir una solicitud: o las fechas encajan con lo que queda libre, o no
/// hay nada que valorar. Por eso sale en la lista, en la ficha, en el correo
/// interno y en el informe del propietario, y no enterrada entre el resto de
/// respuestas.

const DURACIONES: Record<string, string> = {
  withEndDate: "Con fecha de salida",
  season: "Una temporada, menos de un ano",
  oneYear: "Un ano",
  twoOrThree: "Dos o tres anos",
  longTerm: "Largo plazo, sin fecha prevista",
};

function fecha(valor: string | undefined): Date | null {
  if (!valor) return null;
  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? null : d;
}

function corta(d: Date): string {
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/// Cuanto dura la estancia, redondeado a lo que diria una persona.
export function stayLengthText(desde: Date, hasta: Date): string | null {
  const dias = Math.round((hasta.getTime() - desde.getTime()) / 86_400_000);
  if (dias <= 0) return null;
  if (dias < 31) return `${dias} ${dias === 1 ? "dia" : "dias"}`;

  const meses = Math.round(dias / 30.44);
  if (meses < 12) return `${meses} ${meses === 1 ? "mes" : "meses"}`;

  const anos = Math.floor(meses / 12);
  const resto = meses % 12;
  const parteAnos = `${anos} ${anos === 1 ? "ano" : "anos"}`;
  return resto === 0
    ? parteAnos
    : `${parteAnos} y ${resto} ${resto === 1 ? "mes" : "meses"}`;
}

/// Devuelve null cuando no hay ni fecha de entrada ni duracion: en compras, y
/// en las solicitudes anteriores a que se preguntara esto.
export function describeStay(answers: Record<string, string>): string | null {
  const entrada = fecha(answers.moveInDate);
  const salida = fecha(answers.moveOutDate);
  const duracion = DURACIONES[answers.stayLength ?? ""] ?? null;

  if (entrada && salida) {
    const cuanto = stayLengthText(entrada, salida);
    return `Del ${corta(entrada)} al ${corta(salida)}${cuanto ? ` · ${cuanto}` : ""}`;
  }

  if (entrada) {
    return duracion
      ? `Desde el ${corta(entrada)} · ${duracion}`
      : `Desde el ${corta(entrada)}`;
  }

  return duracion;
}
