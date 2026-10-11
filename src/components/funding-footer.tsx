import Link from "next/link";
import { common } from "@/lib/copy/common";

// Dicitura obbligatoria del finanziamento (regola 13, SPEC N9):
// presente su ogni pagina pubblica, non va rimossa per ragioni estetiche.
export function FundingFooter({ notice }: { notice: string }) {
  return (
    <footer className="mx-auto mt-12 max-w-xl px-gutter">
      <div className="border-t-2 border-line pt-4 text-xs text-muted">
        <p>{notice}</p>
        <p className="mt-2">
          <Link href="/il-progetto" className="font-semibold text-ink underline underline-offset-2">
            {common.projectLink}
          </Link>
        </p>
      </div>
    </footer>
  );
}
