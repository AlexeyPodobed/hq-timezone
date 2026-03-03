import { CityFull } from "@/types/cities";

export const readStoredCity = (storageKey: string): CityFull | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CityFull;

    if (!parsed?.name || !parsed?.timezone) {
      return null;
    }

    return parsed;
  } catch {
    console.log("sessionStorage parse failed");
    return null;
  }
};

export const writeStoredCity = (storageKey: string, city: CityFull) => {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(storageKey, JSON.stringify(city));
  } catch (error) {
    console.log("sessionStorage set failed:", error);
  }
};
