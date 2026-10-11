import type { MetadataRoute } from "next";
import { common } from "@/lib/copy/common";

// Manifest della PWA (U14). Icone segnaposto finché non arriva l'identità
// visiva del distretto. Il service worker arriva con la M2.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: common.appName,
    short_name: common.appShortName,
    description: common.appDescription,
    lang: "it",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f2f4f6",
    theme_color: "#f2f4f6",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
