import { memo } from "react";

import { ImageWrapper } from "@/common/ImageWrapper";

export interface CardItemProps {
  bgSrc: string;
  bgAlt: string;
  tag: string;
  title: string;
}

export const CardItem = memo<CardItemProps>(({ bgSrc, bgAlt, tag, title }) => {
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
				<div className="card-item__text">
					<span className="card-item__text-inner">There are 24 main time zones based on Earth's rotation, but in practice, there are over 40 official time zones due to countries using half-hour or quarter-hour offsets.</span>
				</div>
				{/* <div className="card-item__icon">
					
				</div> */}
        <div className="card-item__tag">{tag}</div>
        <div className="card-item__title">{title}</div>
      </div>
    </div>
  );
});

CardItem.displayName = "CardItem";
