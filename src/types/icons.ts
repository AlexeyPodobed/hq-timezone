export enum ICON_NAMES {
  "arrow-down",
  "sun",
  "moon",
  "plus",
  "arrow-left",
  "arrow-right",
  "minus",
}

export type ICON_SIZE =
  | `${number}px`
  | `${number}rem`
  | `${number}em`
  | `${number}pt`
  | `${number}%`
  | "small"
  | "medium"
  | "large"
  | "x-large"
  | "xx-large"
  | "smaller"
  | "larger"
  | "inherit"
  | "initial"
  | "unset";
