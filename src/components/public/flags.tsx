import type { Locale } from "@/i18n/config";

/// Banderas dibujadas como SVG, no como emoji.
///
/// Los emoji de bandera (🇪🇸) no se dibujan en Windows: el sistema no trae
/// esas imagenes y muestra las dos letras del pais en su lugar. Como buena
/// parte de los interesados entrara desde un PC con Windows, se dibujan a
/// mano y asi se ven igual en todas partes.
///
/// La bandera representa el idioma, no la nacionalidad de quien lo habla; es
/// la convencion habitual en los selectores y se entiende de un vistazo.

const FLAG_VIEWBOX = "0 0 60 40";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox={FLAG_VIEWBOX}
      role="presentation"
      aria-hidden="true"
      className="h-4 w-6 shrink-0 rounded-[2px] shadow-[0_0_0_1px_rgba(52,52,52,0.12)]"
    >
      {children}
    </svg>
  );
}

/// Tres franjas horizontales de igual altura.
function HorizontalBands({ colors }: { colors: [string, string, string] }) {
  return (
    <Frame>
      {colors.map((color, index) => (
        <rect
          key={color + index}
          x="0"
          y={(index * 40) / 3}
          width="60"
          height={40 / 3}
          fill={color}
        />
      ))}
    </Frame>
  );
}

/// Tres franjas verticales de igual anchura.
function VerticalBands({ colors }: { colors: [string, string, string] }) {
  return (
    <Frame>
      {colors.map((color, index) => (
        <rect
          key={color + index}
          x={index * 20}
          y="0"
          width="20"
          height="40"
          fill={color}
        />
      ))}
    </Frame>
  );
}

const flags: Record<Locale, React.ReactNode> = {
  // Espana: rojo, amarillo (doble alto) y rojo.
  es: (
    <Frame>
      <rect x="0" y="0" width="60" height="40" fill="#c60b1e" />
      <rect x="0" y="10" width="60" height="20" fill="#ffc400" />
    </Frame>
  ),

  // Reino Unido: aspas blancas y rojas sobre azul, mas la cruz de San Jorge.
  en: (
    <Frame>
      <clipPath id="artiko-flag-uk">
        <path d="M30,20 h30 v20 z v20 h-30 z h-30 v-20 z v-20 h30 z" />
      </clipPath>
      <rect x="0" y="0" width="60" height="40" fill="#00247d" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
      <path
        d="M0,0 L60,40 M60,0 L0,40"
        clipPath="url(#artiko-flag-uk)"
        stroke="#cf142b"
        strokeWidth="5"
      />
      <path d="M30,0 v40 M0,20 h60" stroke="#fff" strokeWidth="13" />
      <path d="M30,0 v40 M0,20 h60" stroke="#cf142b" strokeWidth="8" />
    </Frame>
  ),

  de: <HorizontalBands colors={["#000000", "#dd0000", "#ffce00"]} />,
  fr: <VerticalBands colors={["#002395", "#ffffff", "#ed2939"]} />,
  ru: <HorizontalBands colors={["#ffffff", "#0039a6", "#d52b1e"]} />,
  nl: <HorizontalBands colors={["#ae1c28", "#ffffff", "#21468b"]} />,
  it: <VerticalBands colors={["#009246", "#ffffff", "#ce2b37"]} />,

  // Ucrania: azul arriba, amarillo abajo.
  uk: (
    <Frame>
      <rect x="0" y="0" width="60" height="20" fill="#0057b7" />
      <rect x="0" y="20" width="60" height="20" fill="#ffd700" />
    </Frame>
  ),

  // Portugal: verde y rojo, con la esfera armilar simplificada.
  pt: (
    <Frame>
      <rect x="0" y="0" width="60" height="40" fill="#da291c" />
      <rect x="0" y="0" width="24" height="40" fill="#046a38" />
      <circle
        cx="24"
        cy="20"
        r="8"
        fill="none"
        stroke="#ffe900"
        strokeWidth="2"
      />
      <rect
        x="20"
        y="16"
        width="8"
        height="8"
        fill="#fff"
        stroke="#da291c"
        strokeWidth="1"
      />
    </Frame>
  ),
};

export function Flag({ locale }: { locale: Locale }) {
  return <>{flags[locale]}</>;
}
