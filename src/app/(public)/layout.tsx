import { BottomNav } from "@/components/nav/bottom-nav";
import { FundingFooter } from "@/components/funding-footer";
import { getPublicSettings } from "@/lib/settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSettings();

  return (
    <div className="pb-safe-nav pt-[env(safe-area-inset-top)]">
      <main id="contenuto" className="mx-auto max-w-xl px-gutter">
        {children}
      </main>
      <FundingFooter notice={settings.fundingNotice} />
      <BottomNav popcoinEnabled={settings.popcoinEnabled} />
    </div>
  );
}
