import * as React from "react";

import { ICON_NAMES, ICON_SIZE } from "@/types/icons";
interface Icon extends React.HTMLAttributes<HTMLDivElement> {
  name: keyof typeof ICON_NAMES;
  size?: ICON_SIZE;
}

export const Icon = ({ name, size, className = "", style, ...props }: Icon) => {
  return (
    <div
      {...props}
      className={`relative flex items-start justify-center ${className}`}
      style={{ fontSize: size, ...style }}
    >
      <span className={`text-[inherit] flex items-start justify-center icon-${name}`}></span>
    </div>
  );
};
