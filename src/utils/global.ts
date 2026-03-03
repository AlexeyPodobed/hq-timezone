export const rem = (rem: number) =>
  rem * (typeof window === "undefined" ? 16 : +getComputedStyle(document.documentElement).fontSize.replace("px", ""));

export function getSlugFromWpUrl(url?: string | null): string {
  if (!url) return "/";

  const match = url.match(/^https?:\/\/[^/]+(\/.*)?$/i);
  if (match) return match[1] || "/";
  return url;
}
