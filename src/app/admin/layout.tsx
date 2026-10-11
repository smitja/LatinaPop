import type { Metadata } from "next";
import { adminCopy } from "@/lib/copy/admin";

export const metadata: Metadata = {
  title: adminCopy.areaLabel,
  robots: { index: false, follow: false },
};

// Console desktop, densa. Guardie (ruolo admin/editor, MFA) dalla M1/M6.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh grid-cols-1 bg-paper md:grid-cols-[15rem_1fr]">
      <aside className="border-b-2 border-line bg-ink text-paper md:border-r-2 md:border-b-0">
        <p className="font-display-narrow px-4 py-4 text-sm uppercase tracking-widest">
          {adminCopy.areaLabel}
        </p>
        <nav aria-label={adminCopy.navLabel} className="px-2 pb-4">
          <ul className="grid gap-px text-sm">
            {adminCopy.sections.map((section) => (
              <li
                key={section.id}
                className="flex items-baseline justify-between gap-2 px-2 py-1.5"
              >
                <span>{section.label}</span>
                <span className="text-xs whitespace-nowrap opacity-80">
                  {adminCopy.notAvailableYet}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="min-w-0 px-6 py-6">{children}</main>
    </div>
  );
}
