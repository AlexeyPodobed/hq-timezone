import { getHomePageId, getHomeMetaById } from "@/api/homepage";

export const fetchFrontPageMeta = async (): Promise<{
  title: string;
  description: string;
  keywords: string[];
}> => {
  try {
    const { data } = await getHomePageId();

    if (typeof data.page_on_front !== "number") {
      throw new Error("Invalid page_on_front");
    }

    const id = data.page_on_front;
    const { data: meta } = await getHomeMetaById(id);

    if (!meta?.yoast_head_json) {
      throw new Error("No yoast_head_json in page");
    }

    const { title, description, og_title, og_description, og_site_name } = meta.yoast_head_json;

    const keywords = [og_title, og_description, og_site_name]
      .filter(Boolean)
      .flatMap((s) => s!.split(/\s+/))
      .map((s) => s.toLowerCase())
      .filter((s, i, arr) => s.length > 2 && arr.indexOf(s) === i);

    return { title, description, keywords };
  } catch (error) {
    console.error("Failed to fetch front page meta:", error);
    throw error;
  }
};
