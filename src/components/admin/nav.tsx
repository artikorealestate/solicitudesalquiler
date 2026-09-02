"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/inmuebles", label: "Inmuebles" },
  { href: "/admin/solicitudes", label: "Solicitudes" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 text-sm">
      {items.map((item) => {
        // "/admin" solo marca en la propia portada; los demas tambien en sus
        // subpaginas, para no perder la referencia al entrar en un detalle.
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              active
                ? "bg-cream-deep font-bold text-ink-strong"
                : "text-ink hover:bg-cream hover:text-ink-strong"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
