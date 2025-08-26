import { NextResponse } from "next/server";

import { generateSitemapXml } from "@/sitemap/sitemap.js";

export async function GET(_req: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || ""; // TEST
  //   const origin = new URL(req.url).origin; FALLBACK AFTER TEST
  //   const baseUrl = origin || process.env.NEXT_PUBLIC_DOMAIN || "";
  const xml = await generateSitemapXml(baseUrl);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, s-maxage=259200",
    },
  });
}
