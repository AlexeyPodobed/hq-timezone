import { ImageWrapper } from "@/common/ImageWrapper";
import { memo } from "react";

interface FooterLogoProps {
	src:string;
	alt:string;
}

export const  FooterLogo = memo<FooterLogoProps>(({src,alt}) =>{
	return (
		<ImageWrapper className="footer__logo" src={src} alt={alt} />
	)
})