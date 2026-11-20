import Gato from "@/components/Gato";

// Tela provisória das páginas que ainda vamos construir
export default function EmBreve({ titulo }: { titulo: string }) {
  return (
    <main className="flex flex-col items-center gap-4 pt-16 text-center">
      <Gato className="size-24" />
      <h1 className="font-display text-2xl">{titulo}</h1>
      <p className="text-ink-soft">Essa tela ainda está sendo feita, miau! 🐾</p>
    </main>
  );
}
