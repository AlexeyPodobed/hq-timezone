import { getPageList } from "./helper.js";

export async function generateSitemapXml(baseUrl) {
  const date = new Date().toISOString().split("T")[0];

  const { data: pages } = await getPageList();
  const published = (pages || []).filter((p) => p?.status === "publish");

  const home = createSitemapEntry(`${baseUrl}/`, date);

  const allPages = published
    .map((page) => {
      const path = getPagePath(page, pages);
      if (!path) return null;
      const url = `${baseUrl}/${path}`;
      return createSitemapEntry(url, date);
    })
    .filter(Boolean)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${home}\n${allPages}\n</urlset>`;
}

function createSitemapEntry(url, date) {
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`;
}

function getPagePath(page, allPages) {
  if (!page) return "";

  if (page.link) {
    try {
      const { pathname } = new URL(page.link);
      return decodeURIComponent(pathname.replace(/^\/|\/$/g, ""));
    } catch {
      console.error("Sitemap error");
    }
  }

  let path = decodeURIComponent(page.slug || "").trim();
  if (!path) return "";

  let parentPage = allPages.find((p) => p.id === page.parent);
  while (parentPage && parentPage.id) {
    const parentSlug = decodeURIComponent(parentPage.slug || "").trim();
    if (parentSlug) path = `${parentSlug}/${path}`;
    parentPage = allPages.find((p) => p.id === parentPage.parent);
  }

  return path.replace(/\/{2,}/g, "/").replace(/^\/|\/$/g, "");
}
