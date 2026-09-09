/// La estancia que pide el interesado, en una sola linea legible.
///
/// Buena parte del alquiler de Artiko esta en la costa y es de temporada, asi
/// que "del 1 al 31 de agosto" es la primera pregunta que se hace cualquiera
/// al abrir una solicitud: o las fechas encajan con lo que queda libre, o no
/// hay nada que valorar. Por eso sale en la lista, en la ficha, en el correo
/// interno y en el informe del propietario, y no enterrada entre el resto de
/// respuestas.

const DURACIONES: Record<string, string | null> = {
  withEndDate: "con fecha de salida",
  season: null,
  oneYear: "un año",
  twoOrThree: "dos o tres años",
  longTerm: "sin fecha de salida prevista",
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
  if (dias < 31) return `${dias} ${dias === 1 ? "día" : "días"}`;

  const meses = Math.round(dias / 30.44);
  if (meses < 12) return `${meses} ${meses === 1 ? "mes" : "meses"}`;

  const anos = Math.floor(meses / 12);
  const resto = meses % 12;
  const parteAnos = `${anos} ${anos === 1 ? "año" : "años"}`;
  return resto === 0
    ? parteAnos
    : `${parteAnos} y ${resto} ${resto === 1 ? "mes" : "meses"}`;
}

/// Devuelve null cuando no hay ni fecha de entrada ni duracion: en compras, y
/// en las solicitudes anteriores a que se preguntara esto.
///
/// Empieza diciendo de que tipo de alquiler se trata porque es lo primero que
/// decide si la solicitud interesa: un piso que se quiere alquilar todo el ano
/// no encaja con quien pide julio y agosto, por muy buen candidato que sea.
export function describeStay(answers: Record<string, string>): string | null {
  const entrada = fecha(answers.moveInDate);
  const salida = fecha(answers.moveOutDate);
  const duracion = DURACIONES[answers.stayLength ?? ""] ?? null;

  // Solo se etiqueta cuando se sabe: las solicitudes anteriores a estas
  // preguntas tienen fecha de entrada y nada mas, y llamarlas "larga
  // estancia" seria inventarselo.
  const clasificable =
    Boolean(answers.stayLength) || Boolean(entrada && salida);
  const tipo = clasificable
    ? isSeasonalStay(answers)
      ? "Temporada"
      : "Larga estancia"
    : null;

  const detalle = (() => {
    if (entrada && salida) {
      const cuanto = stayLengthText(entrada, salida);
      return `del ${corta(entrada)} al ${corta(salida)}${cuanto ? ` (${cuanto})` : ""}`;
    }

    if (entrada) {
      return duracion
        ? `desde el ${corta(entrada)} · ${duracion}`
        : `desde el ${corta(entrada)}`;
    }

    return duracion ? duracion : null;
  })();

  if (!tipo)
    return detalle ? detalle[0].toUpperCase() + detalle.slice(1) : null;
  return detalle ? `${tipo} · ${detalle}` : tipo;
}

/// Frontera entre alquiler de temporada y vivienda habitual.
///
/// La ley espanola distingue el arrendamiento de vivienda del de temporada
/// por el uso, no por una cifra, pero en la practica todo lo que baja de once
/// meses se firma como temporada. Es el corte que usa Artiko.
const DIAS_DE_TEMPORADA = 335;

/// Si la estancia es de temporada.
///
/// Importa porque el estudio de solvencia al 30% no se le aplica a quien
/// viene dos meses de verano: se le pediria nomina, contrato y vida laboral
/// para una estancia que suele pagarse por adelantado, y lo unico que se
/// consigue es que abandone el formulario.
///
/// Ante la duda devuelve false: las solicitudes anteriores a estas preguntas
/// siguen tratandose como vivienda habitual, que es como se recibieron.
export function isSeasonalStay(answers: Record<string, string>): boolean {
  if (answers.stayLength === "season") return true;

  // Quien pide un ano o mas no es temporada aunque haya quedado guardada una
  // fecha de salida de antes de cambiar de opinion.
  if (
    answers.stayLength === "oneYear" ||
    answers.stayLength === "twoOrThree" ||
    answers.stayLength === "longTerm"
  ) {
    return false;
  }

  const entrada = fecha(answers.moveInDate);
  const salida = fecha(answers.moveOutDate);
  if (!entrada || !salida) return false;

  const dias = (salida.getTime() - entrada.getTime()) / 86_400_000;
  return dias > 0 && dias < DIAS_DE_TEMPORADA;
}
