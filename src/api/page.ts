import api from "@/api/api";
import { WP_CORE_API } from "@/consts/api";
import { EXPIRE_5_MINUTES } from "@/consts/time";
import { PageAPI } from "@/types/page";

export const getPage = async (
  slug: string
): Promise<{
  status: number;
  data: PageAPI;
}> => {
  try {
    const { data, status } = await api.get(`${WP_CORE_API}/pages?slug=${slug}`, {}, { next: { revalidate: EXPIRE_5_MINUTES } });

    return { data, status };
  } catch (error) {
    console.log("Fetch page failed:", error);
    throw error;
  }
};
