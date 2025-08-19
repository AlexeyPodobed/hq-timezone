import clsx from "clsx";
// import Link from "next/link";

import { Container } from "@/common/Container";
// import SocLink from "@/components/base/SocLink";
import "@/components/components.scss";
import { getFooter } from "@/api/main";
import { ImageWrapper } from "@/common/ImageWrapper";
import Link from "next/link";

interface FooterProps {
  className?: string;
}

export default async function Footer({ className }: FooterProps) {
		const { data } = await getFooter();
		const logo = data.footer_logo;
		const menu = data.footer_menu;
		const buttons = data.footer_buttons;
		const text = data.footer_text;
	
  return (
    <footer className={clsx("footer", className)}>
      <Container>
				<ImageWrapper src={logo.url} alt={logo.alt} />
				<div>
				{menu.map((item, index) => (
					<Link key={index} href={item.url} target={item.target}>{item.title}</Link>
				))}
				</div>
				<div>
				{buttons.map((button, index) => (
					<Link key={index} href={button.link.url} target={button.link.target}>
						{button.link.title}
					</Link>
				))}
				</div>
				<div>{text}</div>
			</Container>
    </footer>
  );
}
