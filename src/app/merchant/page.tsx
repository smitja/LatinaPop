import { merchantCopy } from "@/lib/copy/merchant";

export default function MerchantHomePage() {
  const sections = Object.values(merchantCopy.sections);

  return (
    <div className="grid gap-8">
      <section aria-labelledby="banco" className="grid gap-3">
        <h1 id="banco" className="text-3xl">
          {merchantCopy.counterTitle}
        </h1>
        <div
          aria-live="polite"
          className="rounded-card border-2 border-dashed border-line bg-surface p-6 text-base"
        >
          {merchantCopy.counterEmpty}
        </div>
      </section>

      <section aria-labelledby="gestione" className="grid gap-3">
        <h2 id="gestione" className="text-xl">
          {merchantCopy.manageTitle}
        </h2>
        <ul className="grid gap-2">
          {sections.map((label) => (
            <li
              key={label}
              className="flex min-h-touch items-center justify-between rounded-card border-2 border-line-soft bg-surface px-4 py-3"
            >
              <span className="font-semibold">{label}</span>
              <span className="text-xs text-muted">{merchantCopy.notAvailableYet}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
