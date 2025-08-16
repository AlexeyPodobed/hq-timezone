export const BASE_API = process.env.NEXT_PUBLIC_GEO_NAMES_API ?? "";
export const BASE_PROXY = process.env.NEXT_PUBLIC_GEO_NAMES_PROXY ?? "";
export const BASE_USERNAME = process.env.NEXT_PUBLIC_GEO_NAMES_USERNAME ?? "";

export const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_API ?? "";
export const WP_API_VERSION = "v1";
export const WP_API = `${WP_URL}/wp-json/hqtimezone/${WP_API_VERSION}`;
