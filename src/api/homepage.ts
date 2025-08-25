import api from "@/api/api";
import { WP_API, WP_API_MAIN, WP_CORE_API } from "@/consts/api";
import { EXPIRE_5_MINUTES } from "@/consts/time";
import { HomePageAPI, HomePageID } from "@/types/home";
import { PageMeta } from "@/types/main";

export const getHomePage = async (): Promise<{
  status: number;
  data: HomePageAPI;
}> => {
  try {
    const { data, status } = await api.get(`${WP_API}/homepage_flexible`, {}, { next: { revalidate: EXPIRE_5_MINUTES } });

    return { data, status };
  } catch (error) {
    console.log("Fetch homepage failed:", error);
    throw error;
  }
};

export const getHomePageId = async (): Promise<{
  status: number;
  data: HomePageID;
}> => {
  try {
    const { data, status } = await api.get(`${WP_API_MAIN}`, {}, { next: { revalidate: EXPIRE_5_MINUTES } });

    return { data, status };
  } catch (error) {
    console.log("Fetch homepage failed:", error);
    throw error;
  }
};

export const getHomeMetaById = async (
  id: number
): Promise<{
  status: number;
  data: PageMeta;
}> => {
  try {
    const { data, status } = await api.get(`${WP_CORE_API}/pages/${id}`, {}, { next: { revalidate: EXPIRE_5_MINUTES } });

    return { data, status };
  } catch (error) {
    console.log("Fetch page failed:", error);
    throw error;
  }
};
