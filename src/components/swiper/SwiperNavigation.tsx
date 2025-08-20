import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { memo } from "react";

import { Icon } from "@/components/base/Icon";

const navVariants = cva("", {
  variants: {
    variant: {
      default: "",
    },
    direction: {
      both: "",
      prev: "hidden",
      next: "hidden",
    },
  },
  defaultVariants: {
    variant: "default",
    direction: "both",
  },
});

interface SwiperNavigationProps extends VariantProps<typeof navVariants> {
  className?: string;
  prevClassName: string;
  nextClassName: string;
}

const SwiperNavigation = memo<SwiperNavigationProps>(({ className, prevClassName, nextClassName, direction = "both" }) => {
  return (
    <div className={clsx("w-full flex items-center gap-3", className)}>
      <>
        <div
          className={clsx(
            "cursor-pointer flex items-center justify-center  transition-all",
            navVariants({ direction: direction === "next" ? "next" : "both" }),
            prevClassName
          )}
        >
          <Icon
            name="arrow-left"
            className="text-[2.125rem] text-yellow"
          />
        </div>
        <div
          className={clsx(
            "cursor-pointer flex items-center justify-center  transition-all",
            navVariants({ direction: direction === "next" ? "next" : "both" }),
            nextClassName
          )}
        >
          <Icon
            name="arrow-left"
            className="text-[2.125rem] -rotate-180 text-yellow"
          />
        </div>
      </>
    </div>
  );
});

SwiperNavigation.displayName = "SwiperNavigation";

export default SwiperNavigation;
