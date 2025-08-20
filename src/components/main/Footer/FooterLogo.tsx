import { memo } from "react";

import { ImageWrapper } from "@/common/ImageWrapper";

interface FooterLogoProps {
  src: string;
  alt: string;
}

export const FooterLogo = memo<FooterLogoProps>(({ src, alt }) => {
  return (
    <ImageWrapper
      className="footer__logo"
      src={src}
      alt={alt}
    />
  );
});

FooterLogo.displayName = "FooterLogo";
