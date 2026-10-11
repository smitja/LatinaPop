import { FUNDING_NOTICE_DEFAULT } from "@/lib/copy/common";

export type PublicSettings = {
  popcoinEnabled: boolean;
  fundingNotice: string;
};

// M0: valori di default. Dalla M1 si leggono dalla tabella `settings`
// (popcoin_enabled = false finché la Rete non lancia la fase 2).
export async function getPublicSettings(): Promise<PublicSettings> {
  return resolveSettings({});
}

export function resolveSettings(raw: {
  popcoin_enabled?: unknown;
  funding_notice?: unknown;
}): PublicSettings {
  const notice = typeof raw.funding_notice === "string" ? raw.funding_notice.trim() : "";
  return {
    popcoinEnabled: raw.popcoin_enabled === true,
    fundingNotice: notice.length > 0 ? notice : FUNDING_NOTICE_DEFAULT,
  };
}
