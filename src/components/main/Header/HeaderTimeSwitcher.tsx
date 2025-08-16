"use client";
import clsx from "clsx";

import { useTimeStore } from "@/store/timeStore";

export default function HeaderTimeSwitcher() {
  const { is24h, set24h } = useTimeStore();

  return (
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
  );
}
