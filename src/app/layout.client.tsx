"use client";

import { ReactNode } from "react";
import "@/scripts/track-hydration-errors";

export default function LayoutClient({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
