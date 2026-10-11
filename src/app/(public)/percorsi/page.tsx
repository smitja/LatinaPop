import type { Metadata } from "next";
import { PlaceholderSection } from "@/components/ui/placeholder-section";

export const metadata: Metadata = { title: "Percorsi" };

export default function TrailsPage() {
  return (
    <div className="grid gap-5 pt-8">
      <h1 className="text-2xl">Pop Trails</h1>
      <PlaceholderSection title="Percorsi" milestone="M2">
        Itinerari tematici tra le attività del distretto, con le tappe sulla mappa.
      </PlaceholderSection>
    </div>
  );
}
