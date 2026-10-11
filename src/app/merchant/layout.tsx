import type { Metadata } from "next";
import { merchantCopy } from "@/lib/copy/merchant";

export const metadata: Metadata = {
  title: merchantCopy.areaLabel,
  robots: { index: false, follow: false },
};

// Console da telefono, dietro al banco: una colonna, target grandi.
// Le guardie di accesso (membership attiva) arrivano con la M1.
export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper pb-[env(safe-area-inset-bottom)]">
      <header className="border-b-2 border-line bg-ink pt-[env(safe-area-inset-top)] text-paper">
        <div className="mx-auto flex min-h-touch max-w-xl items-center justify-between px-gutter py-3">
          <p className="font-display-narrow text-sm uppercase tracking-widest">
            {merchantCopy.areaLabel}
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-xl px-gutter py-6">{children}</main>
    </div>
  );
}
