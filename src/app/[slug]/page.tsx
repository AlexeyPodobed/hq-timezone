import { notFound } from "next/navigation";

import { getPage } from "@/api/page";
import "./defaultPage.scss";
import { Container } from "@/common/Container";
import { TextEditor } from "@/components/base/TextEditor";
import { PageAPI } from "@/types/page";

export const generateMetadata = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const { data } = await getPage(params.slug);
  const page: PageAPI | undefined = data?.[0];

  if (!page) return { title: "Not Found" };

  const meta = page.meta.yoast_head_json ?? {};
  return {
    title: meta.title || page.title?.rendered || "Untitled Page",
    description: meta.description || "HQ TIMEZONE description",
    keywords: (meta.og_title, meta.og_description, meta.og_site_name ?? "").split(",").filter(Boolean),
  };
};

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { data } = await getPage(params.slug);
  const page: PageAPI | undefined = data?.[0];
  if (!page) notFound();

  const { title, content } = page;

  return (
    <div className="default-page">
      <div className="default-page-inner">
        <Container>
          {title?.rendered && <h1>{title.rendered}</h1>}
          {content?.rendered && <TextEditor content={content.rendered} />}
        </Container>
      </div>
    </div>
  );
}
