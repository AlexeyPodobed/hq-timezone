import api from "@/api/api";
import { WP_API } from "@/consts/api";
import { EXPIRE_5_MINUTES } from "@/consts/time.ts";
import { Header } from "@/types/main";

export const getHeader = async (): Promise<{
  status: number;
  data: Header;
}> => {
  try {
    const { data, status } = await api.get(`${WP_API}/header`, {}, { next: { revalidate: EXPIRE_5_MINUTES } });

    return { data, status };
  } catch (error) {
    console.log("Header:", error);
    throw error;
  }
};

// export const getFooter = async (): Promise<{
//   status: number;
//   data: FooterMenu;
// }> => {
//   try {
//     const { data, status } = await api.get(`${WP_API}/footer`, {}, { next: { revalidate: EXPIRE_5_MINUTES } });
//     return { data, status };
//   } catch (error) {
//     console.log("Footer:", error);
//     throw error;
//   }
// };
