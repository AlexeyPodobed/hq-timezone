// api.ts
import { BASE_PROXY } from "@/consts/api";

// ✅ Added: read public debug flag for optional logging
const API_DEBUG = process.env.NEXT_PUBLIC_API_DEBUG === "1";

// ✅ Changed: keep username/token here to avoid import cycles; read once
const USERNAME = process.env.NEXT_PUBLIC_GEO_NAMES_USERNAME ?? "";
const TOKEN = process.env.NEXT_PUBLIC_GEO_NAMES_TOKEN ?? "";

// ✅ Added: helper to safely parse boolean-like env if needed later
const isNonEmpty = (v?: string | null) => !!v && v.trim().length > 0;

class APIWrapper {
  // ✅ Added: resolveBase() builds an absolute base for relative URLs
  // - CSR: use window.location.origin
  // - SSR: prefer Vercel URL (https), then NEXT_PUBLIC_DOMAIN, then localhost
  private resolveBase(url: string): string | undefined {
    // If the incoming URL is already absolute, no base is needed
    if (url.startsWith("http://") || url.startsWith("https://")) return undefined;

    // Client-side: we have origin, this is the safest way
    if (typeof window !== "undefined") return window.location.origin;

    // Server-side: try vercel URL first (e.g. hq-timezone.vercel.app)
    const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
    if (isNonEmpty(vercel)) return `https://${vercel}`;

    // Fallback to explicit domain if provided (MUST include protocol)
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    if (isNonEmpty(domain)) return domain!;

    // Last resort for local dev SSR
    return "http://localhost:3000";
  }

  // ✅ Added: detect if final target is GeoNames (origin or proxy)
  // We need this to append username/token automatically.
  private isGeoNamesTarget(u: URL): boolean {
    // Direct origin cases (http/https api.geonames.org or secure.geonames.org)
    const host = u.hostname.toLowerCase();
    if (host.includes("geonames.org")) return true;

    // Proxy case: path starts with configured proxy base
    // (normalize to pathname only because BASE_PROXY may be relative)
    const proxyPath = (BASE_PROXY || "").replace(/^https?:\/\/[^/]+/, ""); // strip host if present
    if (proxyPath && u.pathname.startsWith(proxyPath)) return true;

    return false;
  }

  // ✅ Changed: now supports relative URLs by using resolveBase()
  // ✅ Changed: appends username/token only for GeoNames endpoints
  private appendQueryParams(url: string, params?: Record<string, any>): string {
    // Build absolute URL if needed
    const base = this.resolveBase(url);
    const u = base ? new URL(url, base) : new URL(url);

    // Append provided query params
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          u.searchParams.append(key, String(value));
        }
      }
    }

    // Append username/token for GeoNames if missing
    if (this.isGeoNamesTarget(u)) {
      if (isNonEmpty(USERNAME) && !u.searchParams.has("username")) {
        u.searchParams.append("username", USERNAME);
      }
      if (isNonEmpty(TOKEN) && !u.searchParams.has("token")) {
        u.searchParams.append("token", TOKEN as string);
      }
    }

    return u.toString();
  }

  // ✅ Kept: thin fetch wrapper; can extend with common headers if needed
  private async fetchWrapper(url: string, options: RequestInit = {}): Promise<Response> {
    return await fetch(url, options);
  }

  // ✅ Changed: log full URL when API_DEBUG=1
  // ✅ Changed: do NOT set Content-Type for GET (not needed and sometimes harmful)
  public async get<T = any>(url: string, params?: Record<string, any>, options?: RequestInit): Promise<{ data: T; status: number }> {
    const fullUrl = this.appendQueryParams(url, params);

    if (API_DEBUG) {
      const where = typeof window === "undefined" ? "SSR" : "CSR";
      // console.log in English per your rule
      console.log(`[API ${where} GET]`, fullUrl);
    }

    const response = await this.fetchWrapper(fullUrl, {
      method: "GET",
      // No 'Content-Type' for GET
      ...options,
    });

    let data: T;
    try {
      data = (await response.json()) as T;
    } catch {
      // ✅ Added: guard for non-JSON responses
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data = null as any;
    }

    if (API_DEBUG) {
      console.log("[API STATUS]", response.status, response.statusText);
    }

    return { data, status: response.status };
  }

  // ✅ Unchanged logic; small safety JSON parse guard added
  public async post<T = any>(url: string, body: any, headers: HeadersInit = {}): Promise<{ data: T; status: number }> {
    const fullUrl = this.appendQueryParams(url);
    if (API_DEBUG) {
      const where = typeof window === "undefined" ? "SSR" : "CSR";
      console.log(`[API ${where} POST]`, fullUrl);
    }

    const response = await this.fetchWrapper(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    let data: T;
    try {
      data = (await response.json()) as T;
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data = null as any;
    }

    if (API_DEBUG) {
      console.log("[API STATUS]", response.status, response.statusText);
    }

    return { data, status: response.status };
  }

  // ✅ Unchanged logic; small safety JSON parse guard added
  public async put<T = any>(url: string, body: any, headers: HeadersInit = {}): Promise<{ data: T; status: number }> {
    const fullUrl = this.appendQueryParams(url);
    if (API_DEBUG) {
      const where = typeof window === "undefined" ? "SSR" : "CSR";
      console.log(`[API ${where} PUT]`, fullUrl);
    }

    const response = await this.fetchWrapper(fullUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    let data: T;
    try {
      data = (await response.json()) as T;
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data = null as any;
    }

    if (API_DEBUG) {
      console.log("[API STATUS]", response.status, response.statusText);
    }

    return { data, status: response.status };
  }

  // ✅ Unchanged logic; small safety JSON parse guard added
  public async delete<T = any>(url: string, headers: HeadersInit = {}): Promise<{ data: T; status: number }> {
    const fullUrl = this.appendQueryParams(url);
    if (API_DEBUG) {
      const where = typeof window === "undefined" ? "SSR" : "CSR";
      console.log(`[API ${where} DELETE]`, fullUrl);
    }

    const response = await this.fetchWrapper(fullUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    let data: T;
    try {
      data = (await response.json()) as T;
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data = null as any;
    }

    if (API_DEBUG) {
      console.log("[API STATUS]", response.status, response.statusText);
    }

    return { data, status: response.status };
  }
}

const api = new APIWrapper();
export default api;
