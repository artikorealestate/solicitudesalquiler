# Artiko Interesados MVP Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static HTML-only repository with a working Next.js foundation for the Artiko interesados app: admin Google login gate, property management data model, public intake shell, multilingual routing, and local persistence tests.

**Architecture:** Build a Next.js App Router application with server-side actions and a Prisma data layer. Use SQLite locally so the project runs immediately, while keeping the schema portable to Postgres for production. Keep Google Drive and Gmail integrations behind interfaces so milestone 2 can attach real Google credentials without rewriting the app.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Prisma, SQLite for local development, NextAuth/Auth.js Google provider, Vitest, Testing Library, Playwright.

## Global Constraints

- Public form users do not log in.
- Admin panel uses Google/Gmail login.
- Admin access is restricted to configured email addresses.
- Documents remain in Google Drive in later milestones.
- Public UI supports: es, en, de, fr, ru, uk, nl, pt, it.
- Admin UI may start in Spanish.
- Do not expose Google secrets, database URLs, auth secrets, or email credentials in the repository.
- Keep the current `index.html` available as legacy reference until the new app is running.
- First milestone must not implement Idealista scraping.
- First milestone must create a foundation that can later send confirmation emails and create Drive folders.

---

## File Structure

Create these files:

- `package.json` - npm scripts and dependencies.
- `tsconfig.json` - TypeScript config.
- `next.config.mjs` - Next.js config.
- `postcss.config.mjs` - Tailwind PostCSS config.
- `tailwind.config.ts` - Tailwind theme and content paths.
- `.env.example` - documented environment variable names without secrets.
- `.gitignore` - excludes dependencies, env files, generated Prisma files, build output.
- `prisma/schema.prisma` - database schema.
- `src/app/layout.tsx` - root layout.
- `src/app/page.tsx` - redirect or link to default public language.
- `src/app/[locale]/page.tsx` - public intake landing shell.
- `src/app/admin/page.tsx` - admin dashboard gate.
- `src/app/admin/properties/page.tsx` - admin property list page.
- `src/app/admin/properties/new/page.tsx` - create property page.
- `src/app/api/auth/[...nextauth]/route.ts` - Google auth endpoint.
- `src/components/ui/Button.tsx` - shared button.
- `src/components/ui/TextField.tsx` - shared input field.
- `src/features/auth/auth-options.ts` - NextAuth options and admin email guard.
- `src/features/auth/session.ts` - server helper for admin sessions.
- `src/features/i18n/locales.ts` - supported locale definitions.
- `src/features/i18n/dictionaries.ts` - dictionary loader and core translation data.
- `src/features/properties/property-actions.ts` - server actions for property create/list.
- `src/features/properties/property-schema.ts` - validation for property input.
- `src/features/properties/PropertyForm.tsx` - admin form component.
- `src/features/properties/PropertyList.tsx` - admin list component.
- `src/features/intake/intake-config.ts` - operation and question definitions.
- `src/features/intake/PublicIntakeShell.tsx` - public intake first screen.
- `src/lib/db.ts` - Prisma client singleton.
- `src/lib/env.ts` - environment parsing.
- `src/lib/slug.ts` - safe slug/folder-name helpers.
- `tests/unit/slug.test.ts` - unit tests for slugs.
- `tests/unit/i18n.test.ts` - unit tests for locales and dictionaries.
- `tests/unit/property-schema.test.ts` - unit tests for property validation.
- `tests/unit/auth-options.test.ts` - unit tests for admin email guard.
- `tests/e2e/public-intake.spec.ts` - Playwright smoke test.
- `tests/e2e/admin-auth.spec.ts` - Playwright smoke test for auth gate.
- `vitest.config.ts` - Vitest config.
- `playwright.config.ts` - Playwright config.

Modify these files:

- `index.html` - do not modify during this milestone except if the project scaffold requires moving it to `legacy/index.html`; if moved, commit the move separately and preserve file contents.

## Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `lint`, `test`, `test:e2e`, `prisma:generate`, `prisma:migrate`.
- Produces: app routes can import `src/app/globals.css`.

- [ ] **Step 1: Write failing scaffold verification**

Create `tests/unit/scaffold.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("project scaffold", () => {
  it("defines required npm scripts", () => {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    expect(pkg.scripts.dev).toBe("next dev");
    expect(pkg.scripts.build).toBe("next build");
    expect(pkg.scripts.test).toBe("vitest run");
    expect(pkg.scripts["test:e2e"]).toBe("playwright test");
    expect(pkg.scripts.lint).toBe("eslint .");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/scaffold.test.ts`

Expected: command fails because `package.json` or `vitest` does not exist yet.

- [ ] **Step 3: Create `package.json`**

```json
{
  "name": "artiko-interesados",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^2.10.0",
    "@prisma/client": "^6.13.0",
    "next": "^15.4.6",
    "next-auth": "^4.24.11",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "zod": "^4.0.15"
  },
  "devDependencies": {
    "@playwright/test": "^1.54.2",
    "@testing-library/jest-dom": "^6.6.4",
    "@testing-library/react": "^16.3.0",
    "@types/node": "^24.2.1",
    "@types/react": "^19.1.9",
    "@types/react-dom": "^19.1.7",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.33.0",
    "eslint-config-next": "^15.4.6",
    "jsdom": "^26.1.0",
    "postcss": "^8.5.6",
    "prisma": "^6.13.0",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.9.2",
    "vitest": "^3.2.4"
  }
}
```

- [ ] **Step 4: Create TypeScript and framework config**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb"
    }
  }
};

export default nextConfig;
```

Create `postcss.config.mjs`:

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
```

Create `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#1C1C1C",
        gold: "#CBB26A",
        warm: "#F7F5F2",
        border: "#E0DBD3"
      },
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"]
      },
      borderRadius: {
        card: "8px"
      }
    }
  },
  plugins: []
};

export default config;
```

- [ ] **Step 5: Create environment and ignore files**

Create `.env.example`:

```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-local-secret"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
ADMIN_EMAILS="info@artikore.com"
GOOGLE_DRIVE_ROOT_FOLDER_ID=""
GMAIL_FROM_ADDRESS=""
INTERNAL_NOTIFICATION_EMAILS="info@artikore.com"
```

Create `.gitignore`:

```gitignore
node_modules
.next
out
dist
coverage
.env
.env.*
!.env.example
prisma/dev.db
prisma/dev.db-journal
playwright-report
test-results
```

- [ ] **Step 6: Create root app files**

Create `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

html {
  min-height: 100%;
}

body {
  min-height: 100vh;
  margin: 0;
  background: #1c1c1c;
  color: #1c1c1c;
}

button,
input,
select,
textarea {
  font: inherit;
}
```

Create `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artiko Interesados",
  description: "Gestion de solicitudes de compra y alquiler de Artiko Real Estate"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

Create `src/app/page.tsx`:

```tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/es");
}
```

- [ ] **Step 7: Create Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"]
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname
    }
  }
});
```

- [ ] **Step 8: Install dependencies**

Run: `npm install`

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 9: Run scaffold test**

Run: `npm test -- tests/unit/scaffold.test.ts`

Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.mjs postcss.config.mjs tailwind.config.ts .env.example .gitignore src/app tests/unit vitest.config.ts
git commit -m "feat: scaffold Next app foundation"
```

## Task 2: Add Prisma Schema And Database Helpers

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Create: `src/lib/env.ts`
- Create: `src/lib/slug.ts`
- Test: `tests/unit/slug.test.ts`

**Interfaces:**
- Produces: `slugifyFolderName(value: string): string`
- Produces: `buildDriveFolderLabel(input: { reference: string; title: string }): string`
- Produces: `db` Prisma client singleton.

- [ ] **Step 1: Write failing slug tests**

Create `tests/unit/slug.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildDriveFolderLabel, slugifyFolderName } from "@/lib/slug";

describe("slugifyFolderName", () => {
  it("keeps readable Spanish names while removing unsafe characters", () => {
    expect(slugifyFolderName("C/ Colon, 12 - Atico nº 5")).toBe("C Colon 12 - Atico no 5");
  });

  it("uses a fallback for empty names", () => {
    expect(slugifyFolderName("   ")).toBe("Sin referencia");
  });
});

describe("buildDriveFolderLabel", () => {
  it("combines reference and title for property folders", () => {
    expect(buildDriveFolderLabel({ reference: "ART-42", title: "Piso centro" })).toBe("ART-42 - Piso centro");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/slug.test.ts`

Expected: FAIL because `@/lib/slug` does not exist.

- [ ] **Step 3: Create slug helper**

Create `src/lib/slug.ts`:

```ts
const UNSAFE_FOLDER_CHARS = /[<>:"/\\|?*,\u0000-\u001F]/g;

export function slugifyFolderName(value: string): string {
  const cleaned = value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/º/g, "o")
    .replace(/ª/g, "a")
    .replace(UNSAFE_FOLDER_CHARS, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.length > 0 ? cleaned.slice(0, 120) : "Sin referencia";
}

export function buildDriveFolderLabel(input: { reference: string; title: string }): string {
  return slugifyFolderName(`${input.reference} - ${input.title}`);
}
```

- [ ] **Step 4: Add Prisma schema**

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model AdminUser {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      String   @default("admin")
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Property {
  id             String   @id @default(cuid())
  reference      String   @unique
  title          String
  // RENT, PURCHASE, BOTH
  operationType  String
  zone           String
  approximateAddress String?
  rentPrice      Int?
  purchasePrice  Int?
  idealistaUrl   String?
  mainImageUrl   String?
  // ACTIVE, PAUSED, ARCHIVED
  status         String   @default("ACTIVE")
  internalNotes  String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  leads          Lead[]
}

model Lead {
  id                 String     @id @default(cuid())
  // RENT, PURCHASE
  operationType      String
  locale             String
  firstName          String
  lastName           String
  email              String
  phone              String
  nationality        String?
  identityDocument   String?
  answersJson        String
  // NEW, REVIEWING, MISSING_DOCUMENTS, QUALIFIED, REJECTED, VISIT_PROPOSED, VISITED, OFFER, RESERVED, CLOSED
  status             String     @default("NEW")
  driveFolderUrl     String?
  documentLinksJson  String     @default("[]")
  rgpdConsent        Boolean
  shareConsent       Boolean
  propertyId         String
  property           Property   @relation(fields: [propertyId], references: [id])
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt
}
```

- [ ] **Step 5: Add environment parser**

Create `src/lib/env.ts`:

```ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  ADMIN_EMAILS: z.string().default("info@artikore.com"),
  GOOGLE_DRIVE_ROOT_FOLDER_ID: z.string().optional(),
  GMAIL_FROM_ADDRESS: z.string().optional(),
  INTERNAL_NOTIFICATION_EMAILS: z.string().default("info@artikore.com")
});

export const env = envSchema.parse(process.env);

export function getAdminEmails(): string[] {
  return env.ADMIN_EMAILS.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
}
```

- [ ] **Step 6: Add Prisma client singleton**

Create `src/lib/db.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
```

- [ ] **Step 7: Generate Prisma client and migrate**

Run: `copy .env.example .env`

Run: `npm run prisma:generate`

Run: `npm run prisma:migrate -- --name init`

Expected: Prisma client generated and SQLite migration created.

- [ ] **Step 8: Run slug tests**

Run: `npm test -- tests/unit/slug.test.ts`

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add prisma src/lib tests/unit/slug.test.ts .env.example
git commit -m "feat: add database schema and helpers"
```

## Task 3: Add I18n Foundation And Public Intake Shell

**Files:**
- Create: `src/features/i18n/locales.ts`
- Create: `src/features/i18n/dictionaries.ts`
- Create: `src/features/intake/intake-config.ts`
- Create: `src/features/intake/PublicIntakeShell.tsx`
- Create: `src/app/[locale]/page.tsx`
- Test: `tests/unit/i18n.test.ts`
- Test: `tests/e2e/public-intake.spec.ts`
- Create: `playwright.config.ts`

**Interfaces:**
- Produces: `SUPPORTED_LOCALES`
- Produces: `isSupportedLocale(locale: string): locale is SupportedLocale`
- Produces: `getDictionary(locale: SupportedLocale)`
- Produces: `INTAKE_OPERATIONS`

- [ ] **Step 1: Write failing i18n tests**

Create `tests/unit/i18n.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getDictionary } from "@/features/i18n/dictionaries";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/features/i18n/locales";

describe("i18n", () => {
  it("supports all required public locales", () => {
    expect(SUPPORTED_LOCALES.map((locale) => locale.code)).toEqual([
      "es",
      "en",
      "de",
      "fr",
      "ru",
      "uk",
      "nl",
      "pt",
      "it"
    ]);
  });

  it("returns translated public form labels", () => {
    expect(getDictionary("en").public.chooseOperation).toBe("What are you interested in?");
    expect(getDictionary("fr").public.rent).toBe("Rent");
    expect(getDictionary("es").public.purchase).toBe("Compra");
  });

  it("rejects unsupported locales", () => {
    expect(isSupportedLocale("ja")).toBe(false);
    expect(isSupportedLocale("uk")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/i18n.test.ts`

Expected: FAIL because i18n files do not exist.

- [ ] **Step 3: Create locale definitions**

Create `src/features/i18n/locales.ts`:

```ts
export const SUPPORTED_LOCALES = [
  { code: "es", label: "Espanol" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Francais" },
  { code: "ru", label: "Russkiy" },
  { code: "uk", label: "Ukrainska" },
  { code: "nl", label: "Nederlands" },
  { code: "pt", label: "Portugues" },
  { code: "it", label: "Italiano" }
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]["code"];

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.some((item) => item.code === locale);
}
```

- [ ] **Step 4: Create dictionaries**

Create `src/features/i18n/dictionaries.ts`:

```ts
import type { SupportedLocale } from "./locales";

type PublicDictionary = {
  brand: string;
  subtitle: string;
  chooseLanguage: string;
  chooseOperation: string;
  rent: string;
  purchase: string;
  property: string;
  continue: string;
};

const dictionaries: Record<SupportedLocale, { public: PublicDictionary }> = {
  es: { public: { brand: "Artiko Real Estate", subtitle: "Solicitud de interes", chooseLanguage: "Idioma", chooseOperation: "Que te interesa?", rent: "Alquiler", purchase: "Compra", property: "Inmueble", continue: "Continuar" } },
  en: { public: { brand: "Artiko Real Estate", subtitle: "Interest request", chooseLanguage: "Language", chooseOperation: "What are you interested in?", rent: "Rent", purchase: "Purchase", property: "Property", continue: "Continue" } },
  de: { public: { brand: "Artiko Real Estate", subtitle: "Interessentenformular", chooseLanguage: "Sprache", chooseOperation: "Wofur interessieren Sie sich?", rent: "Miete", purchase: "Kauf", property: "Immobilie", continue: "Weiter" } },
  fr: { public: { brand: "Artiko Real Estate", subtitle: "Demande d'interet", chooseLanguage: "Langue", chooseOperation: "Que recherchez-vous ?", rent: "Rent", purchase: "Achat", property: "Bien", continue: "Continuer" } },
  ru: { public: { brand: "Artiko Real Estate", subtitle: "Zayavka na interes", chooseLanguage: "Yazyk", chooseOperation: "Chto vas interesuet?", rent: "Arenda", purchase: "Pokupka", property: "Obekt", continue: "Prodolzhit" } },
  uk: { public: { brand: "Artiko Real Estate", subtitle: "Zayavka na zatsikavlenist", chooseLanguage: "Mova", chooseOperation: "Shcho vas tsikavyt?", rent: "Orenda", purchase: "Kupivlya", property: "Nerukhomist", continue: "Prodovzhyty" } },
  nl: { public: { brand: "Artiko Real Estate", subtitle: "Interesseaanvraag", chooseLanguage: "Taal", chooseOperation: "Waar bent u in geinteresseerd?", rent: "Huur", purchase: "Koop", property: "Woning", continue: "Doorgaan" } },
  pt: { public: { brand: "Artiko Real Estate", subtitle: "Pedido de interesse", chooseLanguage: "Idioma", chooseOperation: "Em que tem interesse?", rent: "Arrendamento", purchase: "Compra", property: "Imovel", continue: "Continuar" } },
  it: { public: { brand: "Artiko Real Estate", subtitle: "Richiesta di interesse", chooseLanguage: "Lingua", chooseOperation: "A cosa sei interessato?", rent: "Affitto", purchase: "Acquisto", property: "Immobile", continue: "Continua" } }
};

export function getDictionary(locale: SupportedLocale) {
  return dictionaries[locale];
}
```

- [ ] **Step 5: Create intake config**

Create `src/features/intake/intake-config.ts`:

```ts
export const INTAKE_OPERATIONS = [
  { value: "RENT", labelKey: "rent" },
  { value: "PURCHASE", labelKey: "purchase" }
] as const;

export type PublicOperation = (typeof INTAKE_OPERATIONS)[number]["value"];
```

- [ ] **Step 6: Create public intake shell**

Create `src/features/intake/PublicIntakeShell.tsx`:

```tsx
import Link from "next/link";
import { getDictionary } from "@/features/i18n/dictionaries";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/features/i18n/locales";
import { INTAKE_OPERATIONS } from "@/features/intake/intake-config";

export function PublicIntakeShell({ locale }: { locale: SupportedLocale }) {
  const dictionary = getDictionary(locale).public;

  return (
    <main className="min-h-screen bg-brand px-4 py-8 text-brand">
      <section className="mx-auto max-w-3xl rounded-card bg-white shadow-2xl">
        <div className="border-b border-border px-6 py-8 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-gold">{dictionary.brand}</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold">{dictionary.subtitle}</h1>
        </div>
        <div className="space-y-8 px-6 py-8">
          <div>
            <label className="text-sm font-semibold uppercase tracking-wide">{dictionary.chooseLanguage}</label>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SUPPORTED_LOCALES.map((item) => (
                <Link
                  key={item.code}
                  href={`/${item.code}`}
                  className={`rounded-card border px-3 py-3 text-center text-sm transition ${item.code === locale ? "border-gold bg-[#CBB26A14] font-semibold" : "border-border hover:border-gold"}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold">{dictionary.chooseOperation}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {INTAKE_OPERATIONS.map((operation) => (
                <button
                  key={operation.value}
                  type="button"
                  className="min-h-24 rounded-card border border-border px-4 py-4 text-left transition hover:border-gold hover:bg-[#CBB26A14]"
                >
                  <span className="block text-lg font-semibold">
                    {dictionary[operation.labelKey as "rent" | "purchase"]}
                  </span>
                  <span className="mt-2 block text-sm text-neutral-500">{dictionary.property}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 7: Create locale route**

Create `src/app/[locale]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/features/i18n/locales";
import { PublicIntakeShell } from "@/features/intake/PublicIntakeShell";

export default async function PublicLocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return <PublicIntakeShell locale={locale} />;
}
```

- [ ] **Step 8: Add Playwright config and public smoke test**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120000
  },
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } }
  ]
});
```

Create `tests/e2e/public-intake.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("public intake renders language and operation choices", async ({ page }) => {
  await page.goto("/es");
  await expect(page.getByText("Artiko Real Estate")).toBeVisible();
  await expect(page.getByText("Alquiler")).toBeVisible();
  await expect(page.getByText("Compra")).toBeVisible();
  await page.getByText("English").click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByText("What are you interested in?")).toBeVisible();
});
```

- [ ] **Step 9: Run unit and e2e tests**

Run: `npm test -- tests/unit/i18n.test.ts`

Expected: PASS.

Run: `npm run test:e2e -- tests/e2e/public-intake.spec.ts`

Expected: PASS in desktop and mobile projects.

- [ ] **Step 10: Commit**

```bash
git add src/features/i18n src/features/intake src/app/[locale] tests/unit/i18n.test.ts tests/e2e/public-intake.spec.ts playwright.config.ts
git commit -m "feat: add multilingual public intake shell"
```

## Task 4: Add Admin Google Auth Gate

**Files:**
- Create: `src/features/auth/auth-options.ts`
- Create: `src/features/auth/session.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/app/admin/page.tsx`
- Test: `tests/unit/auth-options.test.ts`
- Test: `tests/e2e/admin-auth.spec.ts`

**Interfaces:**
- Produces: `isAllowedAdminEmail(email: string | null | undefined): boolean`
- Produces: `authOptions`
- Produces: `requireAdminSession(): Promise<Session>`

- [ ] **Step 1: Write failing admin email tests**

Create `tests/unit/auth-options.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";

vi.stubEnv("DATABASE_URL", "file:./test.db");
vi.stubEnv("ADMIN_EMAILS", "info@artikore.com,rober@artikore.com");

describe("isAllowedAdminEmail", () => {
  it("allows configured admin emails case-insensitively", async () => {
    const { isAllowedAdminEmail } = await import("@/features/auth/auth-options");
    expect(isAllowedAdminEmail("INFO@artikore.com")).toBe(true);
  });

  it("rejects unconfigured emails", async () => {
    const { isAllowedAdminEmail } = await import("@/features/auth/auth-options");
    expect(isAllowedAdminEmail("cliente@gmail.com")).toBe(false);
    expect(isAllowedAdminEmail(undefined)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/auth-options.test.ts`

Expected: FAIL because auth files do not exist.

- [ ] **Step 3: Create auth options**

Create `src/features/auth/auth-options.ts`:

```ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getAdminEmails } from "@/lib/env";

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "missing-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "missing-google-client-secret"
    })
  ],
  callbacks: {
    async signIn({ user }) {
      return isAllowedAdminEmail(user.email);
    },
    async session({ session }) {
      return session;
    }
  },
  pages: {
    signIn: "/admin"
  }
};
```

- [ ] **Step 4: Create auth route**

Create `src/app/api/auth/[...nextauth]/route.ts`:

```ts
import NextAuth from "next-auth";
import { authOptions } from "@/features/auth/auth-options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

- [ ] **Step 5: Create server session helper**

Create `src/features/auth/session.ts`:

```ts
import { getServerSession, type Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, isAllowedAdminEmail } from "./auth-options";

export async function requireAdminSession(): Promise<Session> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !isAllowedAdminEmail(session.user.email)) {
    redirect("/admin");
  }

  return session;
}
```

- [ ] **Step 6: Create admin landing gate**

Create `src/app/admin/page.tsx`:

```tsx
import { getServerSession } from "next-auth";
import { authOptions, isAllowedAdminEmail } from "@/features/auth/auth-options";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = isAllowedAdminEmail(session?.user?.email);

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <section className="mx-auto max-w-4xl rounded-card border border-neutral-800 bg-neutral-900 p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">Artiko Real Estate</p>
        <h1 className="mt-3 text-3xl font-semibold">Panel de administradores</h1>
        {isAdmin ? (
          <div className="mt-8 space-y-4">
            <p className="text-neutral-300">Sesion iniciada como {session?.user?.email}</p>
            <a className="inline-flex rounded-card bg-gold px-4 py-3 font-semibold text-brand" href="/admin/properties">
              Gestionar inmuebles
            </a>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <p className="text-neutral-300">Acceso privado para el equipo de Artiko.</p>
            <a className="inline-flex rounded-card bg-gold px-4 py-3 font-semibold text-brand" href="/api/auth/signin">
              Entrar con Google
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
```

- [ ] **Step 7: Create admin auth e2e smoke test**

Create `tests/e2e/admin-auth.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("admin page shows Google login entry point", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByText("Panel de administradores")).toBeVisible();
  await expect(page.getByText("Entrar con Google")).toBeVisible();
});
```

- [ ] **Step 8: Run tests**

Run: `npm test -- tests/unit/auth-options.test.ts`

Expected: PASS.

Run: `npm run test:e2e -- tests/e2e/admin-auth.spec.ts`

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/features/auth src/app/api src/app/admin tests/unit/auth-options.test.ts tests/e2e/admin-auth.spec.ts
git commit -m "feat: add Google admin auth gate"
```

## Task 5: Add Property Validation, Actions, And Admin Screens

**Files:**
- Create: `src/features/properties/property-schema.ts`
- Create: `src/features/properties/property-actions.ts`
- Create: `src/features/properties/PropertyForm.tsx`
- Create: `src/features/properties/PropertyList.tsx`
- Create: `src/app/admin/properties/page.tsx`
- Create: `src/app/admin/properties/new/page.tsx`
- Test: `tests/unit/property-schema.test.ts`

**Interfaces:**
- Produces: `propertyInputSchema`
- Produces: `createProperty(formData: FormData): Promise<{ ok: true } | { ok: false; message: string }>`
- Produces: `listProperties()`

- [ ] **Step 1: Write failing property validation tests**

Create `tests/unit/property-schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { propertyInputSchema } from "@/features/properties/property-schema";

describe("propertyInputSchema", () => {
  it("accepts a valid rental property", () => {
    const result = propertyInputSchema.safeParse({
      reference: "ART-001",
      title: "Piso luminoso",
      operationType: "RENT",
      zone: "Valencia centro",
      approximateAddress: "Calle Colon",
      rentPrice: "1200",
      purchasePrice: "",
      idealistaUrl: "https://www.idealista.com/inmueble/123/",
      mainImageUrl: "https://example.com/foto.jpg",
      status: "ACTIVE",
      internalNotes: ""
    });

    expect(result.success).toBe(true);
  });

  it("requires purchase price for purchase-only properties", () => {
    const result = propertyInputSchema.safeParse({
      reference: "ART-002",
      title: "Atico",
      operationType: "PURCHASE",
      zone: "Ruzafa",
      approximateAddress: "",
      rentPrice: "",
      purchasePrice: "",
      idealistaUrl: "",
      mainImageUrl: "",
      status: "ACTIVE",
      internalNotes: ""
    });

    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/property-schema.test.ts`

Expected: FAIL because `property-schema.ts` does not exist.

- [ ] **Step 3: Create property schema**

Create `src/features/properties/property-schema.ts`:

```ts
import { z } from "zod";

const optionalPrice = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : Number(value)))
  .pipe(z.number().int().positive().nullable());

export const propertyInputSchema = z
  .object({
    reference: z.string().trim().min(2).max(40),
    title: z.string().trim().min(3).max(120),
    operationType: z.enum(["RENT", "PURCHASE", "BOTH"]),
    zone: z.string().trim().min(2).max(120),
    approximateAddress: z.string().trim().max(160).optional(),
    rentPrice: optionalPrice,
    purchasePrice: optionalPrice,
    idealistaUrl: z.union([z.string().url(), z.literal("")]).transform((value) => value || null),
    mainImageUrl: z.union([z.string().url(), z.literal("")]).transform((value) => value || null),
    status: z.enum(["ACTIVE", "PAUSED", "ARCHIVED"]),
    internalNotes: z.string().trim().max(2000).optional()
  })
  .superRefine((value, context) => {
    if ((value.operationType === "RENT" || value.operationType === "BOTH") && !value.rentPrice) {
      context.addIssue({ code: "custom", path: ["rentPrice"], message: "El precio de alquiler es obligatorio." });
    }
    if ((value.operationType === "PURCHASE" || value.operationType === "BOTH") && !value.purchasePrice) {
      context.addIssue({ code: "custom", path: ["purchasePrice"], message: "El precio de compra es obligatorio." });
    }
  });

export type PropertyInput = z.infer<typeof propertyInputSchema>;
```

- [ ] **Step 4: Create property actions**

Create `src/features/properties/property-actions.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { propertyInputSchema } from "./property-schema";

export async function listProperties() {
  return db.property.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }]
  });
}

export async function createProperty(formData: FormData): Promise<{ ok: true } | { ok: false; message: string }> {
  const parsed = propertyInputSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos del inmueble invalidos." };
  }

  await db.property.create({
    data: parsed.data
  });

  revalidatePath("/admin/properties");
  return { ok: true };
}
```

- [ ] **Step 5: Create property form**

Create `src/features/properties/PropertyForm.tsx`:

```tsx
import { createProperty } from "./property-actions";

export function PropertyForm() {
  return (
    <form action={createProperty} className="grid gap-4 rounded-card border border-neutral-200 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Referencia
          <input name="reference" required className="rounded-card border border-neutral-300 px-3 py-2" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Titulo
          <input name="title" required className="rounded-card border border-neutral-300 px-3 py-2" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-2 text-sm font-medium">
          Operacion
          <select name="operationType" className="rounded-card border border-neutral-300 px-3 py-2" defaultValue="RENT">
            <option value="RENT">Alquiler</option>
            <option value="PURCHASE">Compra</option>
            <option value="BOTH">Ambas</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Precio alquiler
          <input name="rentPrice" type="number" min="1" className="rounded-card border border-neutral-300 px-3 py-2" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Precio compra
          <input name="purchasePrice" type="number" min="1" className="rounded-card border border-neutral-300 px-3 py-2" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Zona
        <input name="zone" required className="rounded-card border border-neutral-300 px-3 py-2" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Calle o direccion aproximada
        <input name="approximateAddress" className="rounded-card border border-neutral-300 px-3 py-2" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        URL de Idealista
        <input name="idealistaUrl" type="url" className="rounded-card border border-neutral-300 px-3 py-2" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Imagen principal
        <input name="mainImageUrl" type="url" className="rounded-card border border-neutral-300 px-3 py-2" />
      </label>
      <input type="hidden" name="status" value="ACTIVE" />
      <label className="grid gap-2 text-sm font-medium">
        Notas internas
        <textarea name="internalNotes" className="min-h-24 rounded-card border border-neutral-300 px-3 py-2" />
      </label>
      <button className="rounded-card bg-brand px-4 py-3 font-semibold text-white" type="submit">
        Crear inmueble
      </button>
    </form>
  );
}
```

- [ ] **Step 6: Create property list**

Create `src/features/properties/PropertyList.tsx`:

```tsx
import type { Property } from "@prisma/client";

export function PropertyList({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return <p className="rounded-card border border-dashed border-neutral-300 p-6 text-neutral-500">Todavia no hay inmuebles.</p>;
  }

  return (
    <div className="overflow-hidden rounded-card border border-neutral-200 bg-white">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            <th className="px-4 py-3">Referencia</th>
            <th className="px-4 py-3">Inmueble</th>
            <th className="px-4 py-3">Operacion</th>
            <th className="px-4 py-3">Zona</th>
            <th className="px-4 py-3">Estado</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id} className="border-t border-neutral-100">
              <td className="px-4 py-3 font-semibold">{property.reference}</td>
              <td className="px-4 py-3">{property.title}</td>
              <td className="px-4 py-3">{property.operationType}</td>
              <td className="px-4 py-3">{property.zone}</td>
              <td className="px-4 py-3">{property.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 7: Create admin property pages**

Create `src/app/admin/properties/page.tsx`:

```tsx
import Link from "next/link";
import { requireAdminSession } from "@/features/auth/session";
import { listProperties } from "@/features/properties/property-actions";
import { PropertyList } from "@/features/properties/PropertyList";

export default async function AdminPropertiesPage() {
  await requireAdminSession();
  const properties = await listProperties();

  return (
    <main className="min-h-screen bg-neutral-100 px-4 py-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Artiko</p>
            <h1 className="text-3xl font-semibold">Inmuebles</h1>
          </div>
          <Link className="rounded-card bg-brand px-4 py-3 font-semibold text-white" href="/admin/properties/new">
            Nuevo inmueble
          </Link>
        </div>
        <PropertyList properties={properties} />
      </section>
    </main>
  );
}
```

Create `src/app/admin/properties/new/page.tsx`:

```tsx
import Link from "next/link";
import { requireAdminSession } from "@/features/auth/session";
import { PropertyForm } from "@/features/properties/PropertyForm";

export default async function NewPropertyPage() {
  await requireAdminSession();

  return (
    <main className="min-h-screen bg-neutral-100 px-4 py-8">
      <section className="mx-auto max-w-3xl space-y-6">
        <Link className="text-sm font-semibold text-neutral-600" href="/admin/properties">
          Volver a inmuebles
        </Link>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Artiko</p>
          <h1 className="text-3xl font-semibold">Nuevo inmueble</h1>
        </div>
        <PropertyForm />
      </section>
    </main>
  );
}
```

- [ ] **Step 8: Run tests**

Run: `npm test -- tests/unit/property-schema.test.ts`

Expected: PASS.

Run: `npm run build`

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/features/properties src/app/admin/properties tests/unit/property-schema.test.ts
git commit -m "feat: add admin property management foundation"
```

## Task 6: Document Google Milestone Interfaces

**Files:**
- Create: `src/features/google/google-drive.ts`
- Create: `src/features/email/email-service.ts`
- Test: `tests/unit/google-interface.test.ts`

**Interfaces:**
- Produces: `DocumentStorage` interface.
- Produces: `EmailService` interface.
- Produces: no real Google calls in milestone 1.

- [ ] **Step 1: Write failing interface tests**

Create `tests/unit/google-interface.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createDisabledDocumentStorage } from "@/features/google/google-drive";
import { createDisabledEmailService } from "@/features/email/email-service";

describe("disabled Google milestone services", () => {
  it("reports Drive integration as disabled until credentials are configured", async () => {
    const storage = createDisabledDocumentStorage();
    await expect(storage.createLeadFolder({ operation: "RENT", propertyLabel: "ART-1", leadLabel: "Rober" })).rejects.toThrow("Google Drive integration is not configured");
  });

  it("reports email integration as disabled until credentials are configured", async () => {
    const email = createDisabledEmailService();
    await expect(email.sendLeadConfirmation({ to: "client@example.com", locale: "es", firstName: "Ana", propertyTitle: "Piso", operation: "RENT" })).rejects.toThrow("Email integration is not configured");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/google-interface.test.ts`

Expected: FAIL because service files do not exist.

- [ ] **Step 3: Create Drive interface**

Create `src/features/google/google-drive.ts`:

```ts
export type DriveOperation = "RENT" | "PURCHASE";

export type CreateLeadFolderInput = {
  operation: DriveOperation;
  propertyLabel: string;
  leadLabel: string;
};

export type CreatedLeadFolder = {
  folderId: string;
  folderUrl: string;
};

export interface DocumentStorage {
  createLeadFolder(input: CreateLeadFolderInput): Promise<CreatedLeadFolder>;
}

export function createDisabledDocumentStorage(): DocumentStorage {
  return {
    async createLeadFolder() {
      throw new Error("Google Drive integration is not configured");
    }
  };
}
```

- [ ] **Step 4: Create email interface**

Create `src/features/email/email-service.ts`:

```ts
export type LeadEmailOperation = "RENT" | "PURCHASE";

export type LeadConfirmationEmail = {
  to: string;
  locale: string;
  firstName: string;
  propertyTitle: string;
  operation: LeadEmailOperation;
};

export interface EmailService {
  sendLeadConfirmation(input: LeadConfirmationEmail): Promise<void>;
}

export function createDisabledEmailService(): EmailService {
  return {
    async sendLeadConfirmation() {
      throw new Error("Email integration is not configured");
    }
  };
}
```

- [ ] **Step 5: Run tests**

Run: `npm test -- tests/unit/google-interface.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/google src/features/email tests/unit/google-interface.test.ts
git commit -m "feat: define Google Drive and email interfaces"
```

## Task 7: Full Verification

**Files:**
- Modify: none unless verification exposes issues.

**Interfaces:**
- Consumes: all scripts and routes from previous tasks.
- Produces: verified MVP foundation ready for milestone 2.

- [ ] **Step 1: Run unit tests**

Run: `npm test`

Expected: all unit tests PASS.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: build completes without TypeScript or Next.js errors.

- [ ] **Step 3: Run e2e tests**

Run: `npm run test:e2e`

Expected: public intake and admin auth smoke tests PASS.

- [ ] **Step 4: Inspect git status**

Run: `git status --short`

Expected: no unstaged or uncommitted files except local `.env`, ignored database files, and generated runtime artifacts ignored by `.gitignore`.

- [ ] **Step 5: Commit fixes if required**

If verification required code changes, commit them:

```bash
git add <changed-files>
git commit -m "fix: stabilize MVP foundation verification"
```

## Self-Review

Spec coverage in this milestone:

- Covered: Next.js app foundation, public no-login shell, all required public languages, admin Google login gate, configured admin email restriction, property model and admin property creation, lead/property database schema, future Drive/email interfaces.
- Deferred to milestone 2: real Google Drive folder creation, document upload, Gmail sending, lead submission persistence, interested-user confirmation emails, internal notification emails.
- Deferred to milestone 3: full admin lead management, export to CSV/Excel, status workflows, property images stored in Drive or object storage.

Placeholder scan:

- The plan contains concrete file names, commands, expected outcomes, and code snippets for each task.

Type consistency:

- Operation values are `RENT` and `PURCHASE` in public intake, lead interfaces, and Prisma.
- Property operation additionally supports `BOTH`.
- Admin email guard is named `isAllowedAdminEmail`.
- Drive interface is named `DocumentStorage`.
- Email interface is named `EmailService`.
