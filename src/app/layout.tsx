import type { Metadata, Viewport } from "next";
import { archivo, atkinson } from "./fonts";
import { common } from "@/lib/copy/common";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: common.appName,
    template: `%s · ${common.appName}`,
  },
  description: common.appDescription,
  applicationName: common.appName,
  appleWebApp: {
    capable: true,
    title: common.appShortName,
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f2f4f6",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${archivo.variable} ${atkinson.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
