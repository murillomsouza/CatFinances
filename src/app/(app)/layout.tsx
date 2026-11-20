import BarraInferior from "@/components/BarraInferior";
import { exigirUsuario } from "@/lib/sessao";

export default async function LayoutDoApp({ children }: { children: React.ReactNode }) {
  await exigirUsuario(); // sem login, vai para /entrar

  return (
    <>
      <div className="mx-auto w-full max-w-md px-4 pb-32 pt-[max(1rem,env(safe-area-inset-top))]">
        {children}
      </div>
      <BarraInferior />
    </>
  );
}
