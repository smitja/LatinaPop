import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceholderSection } from "@/components/ui/placeholder-section";
import { getPublicSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "PopCoin" };

export default async function PopcoinPage() {
  // Con PopCoin spento la sezione non esiste (controllo lato server).
  const { popcoinEnabled } = await getPublicSettings();
  if (!popcoinEnabled) notFound();

  return (
    <div className="grid gap-5 pt-8">
      <h1 className="text-2xl">PopCoin</h1>
      <PlaceholderSection title="Saldo, premi e album" milestone="M5">
        Saldo, movimenti, premi, album delle Pop Cards e badge.
      </PlaceholderSection>
    </div>
  );
}
