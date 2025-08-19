import { memo } from "react";

import { Container } from "@/common/Container";

import "./CardsSection.scss";
import { CardItem } from "./CardItem";

export interface CardsSectionProps {
  posts?: {
    tag: string;
    title: string;
		image: {
				url: string;
				alt?: string;
				width: number;
				height: number;
			};
		icon: {
			url: string;
			alt?: string;
			width: number;
			height: number;
		};
  }[];
}

export const CardsSection = memo<CardsSectionProps>(({ posts }) => {
  return (
    <section className="cards-section">
      <Container>
        <div className="cards-section-inner">
          <div className="cards-section__row">
            {posts?.map((post, index) => (
              <CardItem
                key={index}
                bgSrc={post.image.url}
                bgAlt={post.image.alt || ""}
                tag={post.tag}
                title={post.title}
								iconSrc={post.icon?.url || ""}
								iconAlt={post.icon?.alt || ""}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
});

CardsSection.displayName = "CardsSection";
