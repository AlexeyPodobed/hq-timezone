import { getPage } from "@/api/page";
import "./defaultPage.scss";
import { Container } from "@/common/Container.tsx";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const { data: page } = await getPage(slug);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { title, content } = page[0];

  return (
    <div className="default-page">
      <div className="default-page-inner">
        <Container>
          {title?.rendered && <h1>{title.rendered}</h1>}
          {content?.rendered && (
            <div
              className="the-content"
              dangerouslySetInnerHTML={{ __html: content.rendered }}
            />
          )}
        </Container>
      </div>
    </div>
  );
}
