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

  const meta = page.meta ?? {};
  return {
    title: meta.meta_title || page.title?.rendered || "Untitled Page",
    description: meta.meta_description || "",
    keywords: (meta.meta_keywords ?? "").split(",").filter(Boolean),
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
