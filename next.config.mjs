/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb"
    }
  },

  /// Sin mapas de codigo en produccion.
  ///
  /// Con ellos, cualquiera puede leer el codigo fuente original desde las
  /// herramientas del navegador: nombres de campos, comprobaciones internas,
  /// como funciona el limite de envios. Nada de eso ayuda a un interesado y
  /// si le ahorra trabajo a quien quiera saltarselo.
  productionBrowserSourceMaps: false,

  /// Oculta la cabecera que anuncia que el sitio corre sobre Next.js.
  poweredByHeader: false,

  /// Permite probar desde el movil por la red local durante el desarrollo.
  /// No afecta a produccion.
  allowedDevOrigins: ["192.168.1.246", "192.168.1.128"],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Impide que la aplicacion se cargue dentro de un iframe ajeno,
          // que es como se montan las suplantaciones para robar datos.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Evita que el navegador adivine el tipo de un archivo y acabe
          // ejecutando como script algo que se subio como imagen.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No mandamos la direccion completa de nuestras paginas a sitios
          // externos: algunas llevan identificadores en la ruta.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // La app no necesita camara, microfono ni ubicacion.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()"
          }
        ]
      },
      {
        // Las paginas con datos personales no deben quedar cacheadas en
        // ningun intermediario ni en el navegador de un ordenador compartido.
        source: "/(admin|documentos)/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, private" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" }
        ]
      }
    ];
  }
};

export default nextConfig;
