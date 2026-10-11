import { ClusterBadge } from "@/components/ui/cluster-badge";
import { PlaceholderSection } from "@/components/ui/placeholder-section";
import { CLUSTER_CODES } from "@/lib/domain/clusters";

export default function HomePage() {
  return (
    <>
      <header className="pt-8 pb-6">
        {/* Logo provvisorio: solo nella Home (CLAUDE.md, Design) */}
        <h1 className="leading-none">
          <span className="font-display-narrow block text-lg uppercase tracking-widest">
            Latina
          </span>
          <span className="font-display-wide block text-[clamp(3.5rem,18vw,6rem)] uppercase leading-[0.85]">
            Pop
          </span>
          <span className="font-display-narrow block text-lg uppercase tracking-widest">
            District
          </span>
        </h1>
        <p className="mt-5 max-w-[34ch] text-base">
          Negozi, bar, laboratori e servizi di Latina in un unico distretto. Scopri dove andare,
          cosa succede e cosa c&apos;è di nuovo.
        </p>
        <ul className="mt-6 flex gap-3" aria-label="I cinque cluster del distretto">
          {CLUSTER_CODES.map((code) => (
            <li key={code}>
              <ClusterBadge code={code} />
            </li>
          ))}
        </ul>
      </header>

      <div className="grid gap-5">
        <PlaceholderSection title="Cerca" milestone="M2">
          Attività, eventi e offerte del distretto.
        </PlaceholderSection>
        <PlaceholderSection title="Eventi in arrivo" milestone="M2">
          Il calendario unico degli eventi della Rete e delle attività.
        </PlaceholderSection>
        <PlaceholderSection title="Offerte" milestone="M2">
          Le offerte pubblicate dalle attività.
        </PlaceholderSection>
        <PlaceholderSection title="Pop Trails" milestone="M2">
          Percorsi tematici tra le attività, sulla mappa.
        </PlaceholderSection>
      </div>
    </>
  );
}
