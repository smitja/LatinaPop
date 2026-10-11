import type { Metadata } from "next";
import { PlaceholderSection } from "@/components/ui/placeholder-section";

export const metadata: Metadata = { title: "Eventi" };

export default function EventsPage() {
  return (
    <div className="grid gap-5 pt-8">
      <h1 className="text-2xl">Eventi</h1>
      <PlaceholderSection title="Agenda" milestone="M2">
        Eventi di oggi, del weekend e per data, tipo e cluster. Orari e prezzi non comunicati
        compaiono come &laquo;da confermare&raquo;.
      </PlaceholderSection>
    </div>
  );
}
