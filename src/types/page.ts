import { PageMeta } from "./main";

export interface PageAPI {
  meta: PageMeta;
  id: number;
  title?: { rendered?: string };
  content?: { rendered?: string };
}
