import { BASE_PROXY } from "@/consts/api";

const USERNAME = process.env.NEXT_PUBLIC_GEO_NAMES_USERNAME ?? "";
const TOKEN = process.env.NEXT_PUBLIC_GEO_NAMES_TOKEN ?? "";

const isNonEmpty = (v?: string | null) => !!v && v.trim().length > 0;

class APIWrapper {
  //   resolveBase() builds an absolute base for relative URLs
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

  // detect if final target is GeoNames (origin or proxy)
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

  private async fetchWrapper(url: string, options: RequestInit = {}): Promise<Response> {
    return await fetch(url, options);
  }

  public async get(url: string, params?: Record<string, any>, options?: RequestInit): Promise<any> {
    const fullUrl = this.appendQueryParams(url, params);

    const response = await this.fetchWrapper(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      ...options,
    });

    return { data: await response.json(), status: response.status };
  }

  public async post(url: string, body: any, headers: HeadersInit = {}): Promise<any> {
    const response = await this.fetchWrapper(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    return { data: await response.json(), status: response.status };
  }

  public async put(url: string, body: any, headers: HeadersInit = {}): Promise<any> {
    const response = await this.fetchWrapper(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    return { data: await response.json(), status: response.status };
  }

  public async delete(url: string, headers: HeadersInit = {}): Promise<any> {
    const response = await this.fetchWrapper(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    return { data: await response.json(), status: response.status };
  }
}

const api = new APIWrapper();

export default api;
