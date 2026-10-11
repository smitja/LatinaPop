import type { Metadata } from "next";
import { common } from "@/lib/copy/common";
import { getPublicSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Il progetto" };

export default async function ProjectPage() {
  const { fundingNotice } = await getPublicSettings();

  return (
    <article className="grid gap-5 pt-8">
      <h1 className="text-2xl">Il progetto</h1>
      <p>
        Latina Pop District è una rete di attività economiche su strada del Comune di Latina. Questa
        WebApp è di proprietà della Rete.
      </p>
      <section className="rounded-card border-2 border-line bg-surface p-5">
        <h2 className="text-lg">Finanziamento</h2>
        <p className="mt-2">{fundingNotice}</p>
        <p className="mt-4 text-sm text-muted">Loghi istituzionali: {common.placeholder}</p>
      </section>
      <section>
        <h2 className="text-lg">Riferimenti della Rete</h2>
        <p className="mt-2 text-sm text-muted">{common.placeholder}</p>
      </section>
    </article>
  );
}
