"use client";
import clsx from "clsx";
import { usePathname } from "next/navigation";

import { HeaderHomeLink } from "@/components/main/Header/HeaderHomeLink.tsx";
import { useTimeStore } from "@/store/timeStore";

export default function HeaderTimeSwitcher() {
  const { is24h, set24h } = useTimeStore();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {isHome && (
        <div className="header__switcher">
          <div
            className={clsx("header__switcher-btn", !is24h && "active")}
            onClick={() => set24h(false)}
          >
            <span>12h</span>
          </div>
          <div
            className={clsx("header__switcher-btn", is24h && "active")}
            onClick={() => set24h(true)}
          >
            <span>24h</span>
          </div>
        </div>
      )}
      {!isHome && <HeaderHomeLink />}
    </>
  );
}
