"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { publicNav } from "@/lib/copy/common";
import { CalendarIcon, CoinIcon, HomeIcon, MapIcon, TrailIcon } from "@/components/ui/icons";

type Item = {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export function BottomNav({ popcoinEnabled }: { popcoinEnabled: boolean }) {
  const pathname = usePathname();

  // Con PopCoin spento la quarta voce diventa "Percorsi" (CLAUDE.md, Design).
  const items: Item[] = [
    { href: "/", label: publicNav.home, Icon: HomeIcon },
    { href: "/mappa", label: publicNav.map, Icon: MapIcon },
    { href: "/eventi", label: publicNav.events, Icon: CalendarIcon },
    popcoinEnabled
      ? { href: "/popcoin", label: publicNav.popcoin, Icon: CoinIcon }
      : { href: "/percorsi", label: publicNav.trails, Icon: TrailIcon },
  ];

  return (
    <nav
      aria-label={publicNav.label}
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-line bg-surface pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-4">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="group flex min-h-nav flex-col items-center justify-center gap-1 px-1 py-2 text-xs font-semibold"
              >
                <span
                  className={`grid h-8 w-14 place-items-center rounded-pill border-2 transition-colors ${
                    active
                      ? "border-line bg-ink text-paper"
                      : "border-transparent text-ink group-hover:border-line-soft"
                  }`}
                >
                  <Icon />
                </span>
                <span className={active ? "underline decoration-2 underline-offset-4" : undefined}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
