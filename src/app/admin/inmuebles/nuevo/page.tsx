import { PropertyForm } from "@/components/admin/property-form";

export default function NewPropertyPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <p className="eyebrow">Catalogo</p>
      <h1 className="heading-xl mt-2">Nuevo inmueble</h1>
      <PropertyForm />
    </main>
  );
}
