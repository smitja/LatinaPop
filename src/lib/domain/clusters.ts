// I cinque cluster della rete (SPEC §0). Dalla M1 la fonte di verità è la
// tabella `clusters`; qui restano codici e nomi per tipi, token e test.
export const CLUSTER_CODES = ["A", "B", "C", "D", "E"] as const;

export type ClusterCode = (typeof CLUSTER_CODES)[number];

export const CLUSTERS: Record<ClusterCode, { label: string; role: string }> = {
  A: { label: "Pop, Gaming & Computer Shop", role: "Tornei, demo, esperienze" },
  B: { label: "Creatività, Stampa & Cultura visiva", role: "Workshop, contest, mostre" },
  C: { label: "Food & Socialità", role: "Luoghi d'incontro e serate a tema" },
  D: { label: "Gusto & Filiera locale", role: "Prodotti dell'Agro Pontino" },
  E: { label: "Servizi alla persona e alla comunità", role: "Vita di quartiere" },
};

export function isClusterCode(value: unknown): value is ClusterCode {
  return typeof value === "string" && (CLUSTER_CODES as readonly string[]).includes(value);
}
