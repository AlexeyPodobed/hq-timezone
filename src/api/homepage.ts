import api from "@/api/api";
import { WP_API } from "@/consts/api";
import { HomePageAPI } from "@/types/home";

export const getHomePage = async (): Promise<{
  status: number;
  data: HomePageAPI;
}> => {
  try {
    const { data, status } = await api.get(`${WP_API}/homepage_flexible`, {}, { cache: "no-store" });

    return { data, status };
  } catch (error) {
    console.log("Fetch homepage failed:", error);
    throw error;
  }
};
