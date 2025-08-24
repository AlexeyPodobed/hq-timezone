import { notFound } from "next/navigation";

import { getPage } from "@/api/page";
import "./defaultPage.scss";
import { Container } from "@/common/Container.tsx";
import { TextEditor } from "@/components/base/TextEditor";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const { data: page } = await getPage(slug);

  // If no page found → show Next.js 404
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (!page[0]) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { title, content } = page[0];

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
