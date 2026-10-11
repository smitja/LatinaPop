import { CLUSTERS, type ClusterCode } from "@/lib/domain/clusters";

// Classi complete (non composte a runtime) perché Tailwind le trovi.
const FILL: Record<ClusterCode, string> = {
  A: "bg-cluster-a text-cluster-a-ink",
  B: "bg-cluster-b text-cluster-b-ink",
  C: "bg-cluster-c text-cluster-c-ink",
  D: "bg-cluster-d text-cluster-d-ink",
  E: "bg-cluster-e text-cluster-e-ink",
};

const TILT: Record<ClusterCode, string> = {
  A: "-rotate-3",
  B: "rotate-2",
  C: "-rotate-2",
  D: "rotate-3",
  E: "-rotate-1",
};

type Props = {
  code: ClusterCode;
  size?: "sm" | "md" | "lg";
  withLabel?: boolean;
};

const SIZE = {
  sm: "size-7 text-sm",
  md: "size-10 text-lg",
  lg: "size-16 text-3xl",
};

// Il "bollino" del cluster: lettera + colore + bordo, mai solo colore.
export function ClusterBadge({ code, size = "md", withLabel = false }: Props) {
  const { label } = CLUSTERS[code];
  const sticker = (
    <span
      aria-hidden={withLabel ? true : undefined}
      role={withLabel ? undefined : "img"}
      aria-label={withLabel ? undefined : `Cluster ${code}: ${label}`}
      className={`font-display-wide inline-grid shrink-0 place-items-center rounded-sticker border-2 border-line shadow-sticker ${FILL[code]} ${TILT[code]} ${SIZE[size]}`}
    >
      {code}
    </span>
  );

  if (!withLabel) return sticker;

  return (
    <span className="inline-flex items-center gap-3">
      {sticker}
      <span className="text-sm font-semibold">{label}</span>
    </span>
  );
}
