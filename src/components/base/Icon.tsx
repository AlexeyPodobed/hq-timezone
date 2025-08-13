import * as React from "react";

import { ICON_NAMES, ICON_SIZE } from "@/types/icons";

const DEFAULT_SIZE = `1rem`;

interface Icon extends React.HTMLAttributes<HTMLDivElement> {
  name: keyof typeof ICON_NAMES;
  size?: ICON_SIZE;
}

export const Icon = ({ name, size = DEFAULT_SIZE, className = "", style, ...props }: Icon) => {
  return (
    <div
      {...props}
      className={`relative flex items-start justify-center ${className}`}
      style={{ fontSize: size, ...style }}
    >
      <span className={`text-[inherit] text-inherit-size flex items-start justify-center icon-${name}`}></span>
    </div>
  );
};
