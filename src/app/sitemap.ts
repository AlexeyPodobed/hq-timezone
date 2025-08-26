import type { MetadataRoute } from "next";

import { getPageList } from "@/sitemap/helper";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "";
  const { data: pages } = await getPageList();

  const published = (pages || []).filter((p) => p?.status === "publish");

  const homePage = {
    url: `${baseUrl}/`,
    lastModified: new Date(),
  };

  const pageEntries = published.map((page) => {
    const slug = page.slug?.replace(/^\/|\/$/g, "");
    return {
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(page.modified_gmt || Date.now()),
    };
  });

  return [homePage, ...pageEntries];
}
