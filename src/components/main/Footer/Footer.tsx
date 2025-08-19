import Link from "next/link";
import { Container } from "@/common/Container";
import "@/components/components.scss";
import { getFooter } from "@/api/main";
import './Footer.scss';
import { FooterLogo } from "./FooterLogo";
import { FooterMenu } from "./FooterMenu";

export default async function Footer() {
		const { data } = await getFooter();
		const logo = data.footer_logo;
		const menu = data.footer_menu;
		const buttons = data.footer_buttons;
		const text = data.footer_text;

  return (
    <footer className="footer">
      <Container>
				<div className="footer__inner">
					<div className="footer-left">
						<div>
							<div className="footer__copyright">{text}</div>
							<div className="footer__by">Designed by <Link href="#">Guyman Studio</Link></div>
							<div className="lg:hidden">
								<FooterMenu items={menu} />
							</div>
						</div>
						<div className="hidden lg:block">
							<FooterLogo src={logo.url} alt={logo.alt} />
						</div>
					</div>
					<div className="footer-right">
						<div className="lg:hidden mb-5">
							<FooterLogo src={logo.url} alt={logo.alt} />
						</div>
						{buttons.map((button, index) => (
							<Link  key={index} href={button.link.url} target={button.link.target} className="footer__link">{button.link.title}</Link>
						))}
						<div className="hidden lg:block">
							<FooterMenu items={menu} />
						</div>
					</div>
				</div>
			</Container>
    </footer>
  );
}
