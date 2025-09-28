import { memo } from "react";

import { Container } from "@/common/Container";

import "./CardsSection.scss";
import { CardItem } from "./CardItem";

interface Card {
  tag: string;
  title: string;
  text: string;
  image: {
    url: string;
    alt?: string;
    width: number;
    height: number;
  };
  icon: string;
}

export interface CardsSectionProps {
  posts?: Card[];
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
                icon={post.icon}
                text={post.text}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
});

CardsSection.displayName = "CardsSection";
