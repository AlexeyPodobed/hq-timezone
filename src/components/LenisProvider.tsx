"use client";

import Lenis from "lenis";
import { ReactNode, useEffect } from "react";

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // custom easing
      smoothWheel: true,
      // smoothTouch: false,
      prevent: (node) => node.classList.contains("custom-select-dropdown"),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
