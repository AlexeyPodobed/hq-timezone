export interface PageAPI {
  id: number;
  title?: { rendered?: string };
  content?: { rendered?: string };
  meta?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
  };
}
