import { memo } from "react";

import { ImageWrapper } from "@/common/ImageWrapper";
import { AnimLottie } from "@/common/lottie";

export interface CardItemProps {
  bgSrc: string;
  bgAlt: string;
  tag: string;
  title: string;
  icon: string;
  text: string;
}

export const CardItem = memo<CardItemProps>(({ bgSrc, bgAlt, tag, title, icon, text }) => {
  return (
    <div className="card-item">
      <ImageWrapper
        src={bgSrc}
        alt={bgAlt}
        className="absolute w-full h-full top-0 left-0"
        cover
        absolute
      />

      <div className="card-item-inner">
        <div className="card-item__icon">
          <AnimLottie json={JSON.parse(icon)} />
        </div>
        <div className="card-item__text">
          <span className="card-item__text-inner">{text}</span>
        </div>
        <div className="card-item__tag">{tag}</div>
        <div className="card-item__title">{title}</div>
      </div>
    </div>
  );
});

CardItem.displayName = "CardItem";
