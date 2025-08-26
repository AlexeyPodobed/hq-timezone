import Link from "next/link";

import { getFooter } from "@/api/main";
import { Container } from "@/common/Container";
import "@/components/components.scss";
import "./Footer.scss";
import { ContactSection } from "@/components/sections/ContactSection/ContactSection.tsx";
import { getSlugFromWpUrl } from "@/utils/global";

import { FooterLogo } from "./FooterLogo";
import { FooterMenu } from "./FooterMenu";

export default async function Footer() {
  const { data } = await getFooter();
  const { footer_logo, footer_menu, footer_buttons, footer_text, contact_section } = data;

  return (
    <>
      <div className="page-wrapper !min-h-0 !pt-0">
        <ContactSection
          background_image={contact_section?.background_image}
          image={contact_section?.image}
        />
      </div>
      <footer className="footer">
        <Container>
          <div className="footer__inner">
            <div className="footer-left">
              <div>
                <div className="footer__copyright">{footer_text}</div>
                <div className="footer__by">
                  Designed by <Link href="/">Guyman Studio</Link>
                </div>
                <div className="lg:hidden">
                  <FooterMenu items={footer_menu} />
                </div>
              </div>
              <div className="hidden lg:block">
                <FooterLogo
                  src={footer_logo.url}
                  alt={footer_logo.alt}
                />
              </div>
            </div>
            <div className="footer-right">
              <div className="lg:hidden mb-5">
                <FooterLogo
                  src={footer_logo.url}
                  alt={footer_logo.alt}
                />
              </div>
              {footer_buttons.map((button, index) => (
                <Link
                  key={index}
                  href={getSlugFromWpUrl(button.link.url)}
                  target={button.link.target}
                  className="footer__link"
                  prefetch
                >
                  {button.link.title}
                </Link>
              ))}
              <div className="hidden lg:block">
                <FooterMenu items={footer_menu} />
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}
