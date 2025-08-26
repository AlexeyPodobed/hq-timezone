import process from "node:process";

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const WP_API = `${process.env.NEXT_PUBLIC_WORDPRESS_API ?? ""}/wp-json/wp/v2/pages`;

const get = async (url, options) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    cache: "no-store",
    ...options,
  });

  return { data: await response.json(), status: response.status };
};

export async function getPageList() {
  try {
    const { data, status } = await get(`${WP_API}`);
    return { data, status };
  } catch (error) {
    console.log("Page list:", error);
    throw error;
  }
}
