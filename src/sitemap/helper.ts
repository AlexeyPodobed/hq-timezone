import api from "@/api/api";
import { WP_CORE_API } from "@/consts/api";
import { EXPIRE_3_DAYS } from "@/consts/time";

export type Page = {
  id: number;
  slug: string;
  link: string;
  status: string;
  modified_gmt: string;
};

export const getPageList = async (): Promise<{
  status: number;
  data: Page[];
}> => {
  try {
    const { data, status } = await api.get(`${WP_CORE_API}/pages`, {}, { next: { revalidate: EXPIRE_3_DAYS } });

    return { data, status };
  } catch (error) {
    console.error("Sitemap Page list:", error);
    throw error;
  }
};
