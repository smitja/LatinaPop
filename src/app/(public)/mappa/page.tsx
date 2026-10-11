import type { Metadata } from "next";
import { ClusterBadge } from "@/components/ui/cluster-badge";
import { PlaceholderSection } from "@/components/ui/placeholder-section";
import { CLUSTER_CODES } from "@/lib/domain/clusters";

export const metadata: Metadata = { title: "Mappa" };

export default function MapPage() {
  return (
    <div className="grid gap-5 pt-8">
      <h1 className="text-2xl">Mappa</h1>
      <PlaceholderSection title="Mappa ed elenco" milestone="M2">
        Mappa ed elenco equivalenti, con filtri per cluster, tipo di attività, offerte e ingresso
        senza gradini.
      </PlaceholderSection>
      <section aria-labelledby="legenda" className="grid gap-3">
        <h2 id="legenda" className="text-lg">
          Cluster
        </h2>
        <ul className="grid gap-3">
          {CLUSTER_CODES.map((code) => (
            <li key={code}>
              <ClusterBadge code={code} withLabel />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
