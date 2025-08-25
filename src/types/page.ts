import { MetaOptions } from "@/types/main.ts";

export interface PageAPI {
  meta: MetaOptions;
  id: number;
  title?: { rendered?: string };
  content?: { rendered?: string };
}
